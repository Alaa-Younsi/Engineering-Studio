interface LinkedInButtonProps {
  href?: string
  className?: string
}

export function LinkedInButton({ href = 'https://linkedin.com', className = '' }: LinkedInButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Retrouvez-nous sur LinkedIn"
      className={`group inline-flex items-center h-10 w-fit max-w-full rounded-full bg-white hover:bg-black overflow-hidden transition-colors duration-300 ease-out ${className}`}
    >
      <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center font-display font-bold text-sm text-black group-hover:text-white transition-colors duration-300">
        in
      </span>
      <span className="grid [grid-template-columns:0fr] group-hover:[grid-template-columns:1fr] transition-[grid-template-columns] duration-300 ease-out">
        <span className="overflow-hidden whitespace-nowrap font-body text-sm text-black group-hover:text-white transition-colors duration-300">
          <span className="block pr-4">Retrouvez-nous sur LinkedIn</span>
        </span>
      </span>
    </a>
  )
}
