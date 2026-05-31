# Admin Setup Guide — Salon de Thé Bien Vivre

## Creating the First Admin User

### Method 1: Via Supabase Dashboard (Recommended for first setup)

1. Go to your Supabase project → **Authentication → Users**
2. Click **"Add user"** → **"Create new user"**
3. Enter the admin email and a strong password
4. Click **"Create User"** — note the User UID

5. Go to **SQL Editor** and run:

```sql
INSERT INTO profiles (id, full_name, email, role, status)
VALUES (
  'USER_UID_HERE',         -- paste the UID from step 4
  'Admin Name',            -- admin's full name
  'admin@yourdomain.com',  -- admin's email
  'owner',                 -- role: owner, admin, staff, content_editor, instructor, read_only
  'active'
);
```

6. The admin can now log in at `/fr/admin`

---

### Method 2: Via Supabase Auth Trigger (Automated)

Add a database trigger to auto-create a profile on signup:

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'read_only',  -- default role — upgrade manually
    'active'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

After signup, manually update the role via SQL:

```sql
UPDATE profiles SET role = 'owner' WHERE email = 'admin@yourdomain.com';
```

---

## User Roles

| Role | Access |
|---|---|
| `owner` | Full access — all admin functions |
| `admin` | Full admin access |
| `staff` | View reservations, inquiries, basic dashboard |
| `content_editor` | Manage menu, experiences, blog posts |
| `instructor` | View own experience schedules |
| `read_only` | Dashboard view only |

---

## Updating a User's Role

```sql
UPDATE profiles
SET role = 'admin'  -- or: staff, content_editor, instructor, read_only
WHERE email = 'user@example.com';
```

---

## Suspending a User

```sql
UPDATE profiles SET status = 'suspended' WHERE email = 'user@example.com';
```

---

## Resetting an Admin Password

1. Go to Supabase Dashboard → Authentication → Users
2. Find the user → click the three-dot menu → **"Send password reset"**

Or via SQL (forces re-login):
```sql
-- The user will need to use "Forgot Password" on the login page
```
