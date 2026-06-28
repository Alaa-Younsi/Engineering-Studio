interface PagePlaceholderProps {
  title: string
}

export function PagePlaceholder({ title }: PagePlaceholderProps) {
  return (
    <main className="min-h-screen flex items-center justify-center pt-16">
      <h1 className="font-display font-bold text-4xl text-white">{title}</h1>
    </main>
  )
}
