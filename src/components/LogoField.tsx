/**
 * Full-screen background of the logo mark rendered as evenly-spaced "coins" —
 * each mark sits in its own grid cell with a gap around it, so the marks read
 * as distinct badges instead of the seamless edge-to-edge lattice you get from
 * a plain repeating background (the mark fills its canvas, so tiling it makes
 * neighbours touch). Used behind the Devis / Réunion form flows.
 */
export function LogoField() {
  return (
    <div className="fixed inset-0 bg-black pointer-events-none overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 grid content-start justify-items-center gap-8 sm:gap-10 lg:gap-12 p-5"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))' }}
      >
        {Array.from({ length: 600 }).map((_, i) => (
          <div
            key={i}
            className="w-full max-w-[72px] aspect-square"
            style={{
              backgroundImage: "url('/Assets/logo/Logo-seul.png')",
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              opacity: 0.15,
            }}
          />
        ))}
      </div>
    </div>
  )
}
