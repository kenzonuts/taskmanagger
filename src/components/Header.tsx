type HeaderProps = {
  title: string
  subtitle: string
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="workspace-header">
      <h1 className="workspace-title">{title}</h1>
      <p className="workspace-subtitle">{subtitle}</p>
    </header>
  )
}
