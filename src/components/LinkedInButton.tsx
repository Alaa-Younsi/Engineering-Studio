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
      className={`group inline-flex items-center h-10 rounded-full bg-white hover:bg-black overflow-hidden max-w-[40px] hover:max-w-[18rem] transition-[max-width,background-color] duration-300 ease-out ${className}`}
    >
      <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center font-display font-bold text-sm text-black group-hover:text-white transition-colors duration-300">
        in
      </span>
      <span className="whitespace-nowrap font-body text-sm text-black group-hover:text-white pr-4 transition-colors duration-300">
        Retrouvez-nous sur LinkedIn
      </span>
    </a>
  )
}
