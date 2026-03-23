import Link from "next/link";
import { getAdminSession } from "@/lib/auth";

export async function SiteHeader() {
  const session = await getAdminSession();

  return (
    <header className="topbar">
      <Link href="/" className="brand">
        <span className="brand-mark" />
        <span className="brand-text">Systems Notes</span>
      </Link>

      <nav className="nav" aria-label="Primary">
        <Link href="/">Home</Link>
        <Link href="/blog">Blog</Link>
        {session ? <Link href="/dashboard">Dashboard</Link> : null}
      </nav>
    </header>
  );
}
