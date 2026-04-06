"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import { useTeacherAuth } from "@/lib/teacherAuth";
import { BlurText, SpotlightCard } from "@/components/ui";

export default function TeacherLoginPage() {
  const { login } = useTeacherAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const result = login(email, password);
    if (!result.ok) {
      setError(result.error ?? "Login failed.");
      return;
    }

    startTransition(() => {
      router.replace("/teacher/dashboard");
    });
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bs-page">
      {/* Standard white BioSpark header */}
      <div className="border-b border-[rgba(0,0,0,0.06)] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-bs-teal-dark text-sm font-bold text-white">
              ⚡
            </div>
            <div>
              <div className="text-sm font-semibold text-bs-ink">
                Bio<span className="text-bs-teal">Spark</span>
              </div>
              <div className="text-xs text-bs-text-sub">
                STAAR Biology • Practice &amp; Mastery
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Centred login card */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <BlurText
              text="Teacher Sign In"
              className="text-3xl font-semibold tracking-tight text-bs-ink"
              delay={80}
              animateBy="words"
            />
            <p className="mt-2 text-bs-text-sub">
              Access your dashboard, item bank, and AI grading tools.
            </p>
          </div>

          <SpotlightCard
            className="rounded-3xl border border-[rgba(0,0,0,0.06)] bg-white p-8 shadow-sm"
            spotlightColor="rgba(0,196,154,0.10)"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <FormControl error={!!error}>
                <FormLabel
                  sx={{ color: "#0a1a14", fontWeight: 600 }}
                >
                  Email address
                </FormLabel>
                <Input
                  type="email"
                  placeholder="teacher@biospark.app"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  size="md"
                  sx={{ borderRadius: "14px" }}
                />
              </FormControl>

              <FormControl error={!!error}>
                <FormLabel
                  sx={{ color: "#0a1a14", fontWeight: 600 }}
                >
                  Password
                </FormLabel>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  size="md"
                  sx={{ borderRadius: "14px" }}
                />
                {error && (
                  <FormHelperText sx={{ color: "#b91c1c", fontWeight: 500 }}>
                    {error}
                  </FormHelperText>
                )}
              </FormControl>

              <Button
                type="submit"
                variant="solid"
                color="primary"
                size="lg"
                loading={isPending}
                fullWidth
                sx={{
                  borderRadius: "14px",
                  background: "var(--bs-teal-dark)",
                  fontWeight: 700,
                  mt: 1,
                  "&:hover": {
                    background: "var(--bs-teal-deep)",
                  },
                }}
              >
                Sign in to BioSpark
              </Button>
            </form>

            {/* Demo credentials hint */}
            <div className="mt-6 rounded-2xl border border-[rgba(0,0,0,0.06)] bg-bs-teal-soft/40 p-4 text-sm">
              <div className="font-semibold text-bs-teal-dark">
                Demo credentials
              </div>
              <div className="mt-1 text-bs-ink/80">
                <span className="font-medium">Email:</span> teacher@biospark.app
              </div>
              <div className="text-bs-ink/80">
                <span className="font-medium">Password:</span> biospark
              </div>
            </div>
          </SpotlightCard>

          <p className="mt-6 text-center text-sm text-bs-text-sub">
            Student?{" "}
            <Link
              href="/auth/student/login"
              className="font-semibold text-bs-teal-dark hover:underline"
            >
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
