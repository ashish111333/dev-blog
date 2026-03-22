import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { getAdminSession } from "@/lib/auth";

export default async function DashboardLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <section className="section" style={{ width: "min(520px, 100%)", margin: "0 auto" }}>
      <div className="section-head">
        <div className="stack">
          <span className="eyebrow">Admin only</span>
          <h1 className="section-title">Private dashboard access</h1>
          <p className="muted">Only your credentials can open the writing area.</p>
        </div>
      </div>

      <LoginForm />
    </section>
  );
}
