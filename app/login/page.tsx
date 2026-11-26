
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  loginUser,
  registerVolunteer,
  isCoordinator,
} from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegistering) {
        await registerVolunteer(email, password);
      }

      const user = isRegistering
        ? await loginUser(email, password)
        : await loginUser(email, password);

      router.push(isCoordinator(user) ? "/coordinator" : "/volunteer");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Authentication failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080F1D] px-5 py-12 text-white">
      <div className="w-full max-w-md">
        <a href="/" className="text-xl font-bold">
          Relief<span className="text-blue-400">Relay</span>
        </a>

        <div className="mt-9 rounded-3xl border border-white/10 bg-[#111D31] p-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            NAMMA IDEA
          </p>

          <h1 className="mt-4 text-3xl font-bold">
            {isRegistering ? "Join ReliefRelay" : "Welcome back"}
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            {isRegistering
              ? "Create your volunteer account to share resources and support."
              : "Sign in to continue to your ReliefRelay account."}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm text-slate-300">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-[#0B1424] px-4 py-3 outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm text-slate-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete={isRegistering ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-xl border border-white/10 bg-[#0B1424] px-4 py-3 outline-none focus:border-blue-400"
              />
            </div>

            {error && (
              <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-500 py-3.5 font-semibold transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : isRegistering
                  ? "Create volunteer account"
                  : "Sign in"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-400">
            {isRegistering
              ? "Already have an account?"
              : "New to ReliefRelay?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError("");
              }}
              className="font-semibold text-blue-400 hover:text-blue-300"
            >
              {isRegistering ? "Sign in" : "Create account"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
