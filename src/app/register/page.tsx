"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { seedUsersIfMissing } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, loading } = useAuth();

  const [form, setForm] = useState<RegisterForm>({
    name: "",
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
    await register(form);
    router.replace("/dashboard");
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unable to register.";
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
          <h2>Register</h2>

          <p className="authHint">Create a local dashboard user.</p>

          {error ? <div className="authError">{error}</div> : null}

          <label>
            Name
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

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

          <button type="submit">Register</button>

          <div className="authFooter">
            Already have an account? <Link href="/login">Login</Link>
          </div>
        </form>
      </section>
    </main>
  );
}