"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { seedUsersIfMissing } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading } = useAuth();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string>("");

  useEffect(() => {
    seedUsersIfMissing();
  }, []);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [loading, isAuthenticated, router]);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
  event.preventDefault();
  setError("");

  try {
    await login(form);

    const params = new URLSearchParams(window.location.search);
    const next = params.get("next") || "/dashboard";

    router.replace(next);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to login.";
    setError(message);
  }
}

  return (
    <main className="authPage">
      <section className="authCard">
        <div className="authBrand">
          <div>
            <div className="authlogo"><img src="../logo.png" alt="logo" width={150} height={60}/></div>
            <p>Unified Platform Dashboard</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="authForm">
          <h2>Login</h2>

          <p className="authHint">
            Use a valid user or register a new user.
          </p>

          {error ? <div className="authError">{error}</div> : null}

          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit">Login</button>

          <div className="authFooter">
            No account? <Link href="/register">Register</Link>
          </div>
        </form>
      </section>
    </main>
  );
}