'use client'

interface SteamWispProps {
  x: number
  delay: number
  duration: number
}

function SteamWisp({ x, delay, duration }: SteamWispProps) {
  return (
    <div
      aria-hidden="true"
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, bottom: 0, animationDelay: `${delay}s` }}
    >
      <svg
        width="24"
        height="60"
        viewBox="0 0 24 60"
        className="opacity-0"
        style={{
          animation: `steam-rise ${duration}s ease-out ${delay}s infinite`,
        }}
      >
        <path
          d="M12 55 Q6 45 12 35 Q18 25 12 15 Q6 5 12 0"
          stroke="#D6A84F"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.4"
        />
      </svg>
    </div>
  )
}

export function FloatingSteam({ count = 5 }: { count?: number }) {
  const wisps = Array.from({ length: count }, (_, i) => ({
    x: 10 + (i * 80) / count + Math.sin(i * 2.1) * 5,
    delay: i * 0.8,
    duration: 2.5 + (i % 3) * 0.5,
  }))

  return (
    <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-20 pointer-events-none overflow-hidden">
      {wisps.map((w, i) => (
        <SteamWisp key={i} {...w} />
      ))}
    </div>
  )
}
