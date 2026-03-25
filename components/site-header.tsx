import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="topbar">
      <Link href="/" className="brand">
        <span className="brand-mark" />
        <span className="brand-text">Systems Notes</span>
      </Link>

      <nav className="nav" aria-label="Primary">
        <Link href="/">Home</Link>
        <Link href="/blog">Blog</Link>
      </nav>
    </header>
  );
}
