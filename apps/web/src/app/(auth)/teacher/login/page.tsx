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

  const labelStyles = { color: "#0a1a14", fontWeight: 600, mb: 0.5 } as const;
  const inputStyles = {
    borderRadius: "14px",
    backgroundColor: "#fff",
    color: "#0a1a14",
    border: "1.5px solid rgba(0,0,0,0.18)",
    "& input": { color: "#0a1a14" },
    "& input::placeholder": { color: "#8aada0", opacity: 1 },
    "--Input-focusedHighlight": "#006e55",
    "&:focus-within": {
      borderColor: "#006e55",
      outline: "2px solid rgba(0,110,85,0.25)",
      outlineOffset: "2px",
    },
  } as const;

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
    <div className="flex min-h-dvh flex-col" style={{ background: "#f0f4f2" }}>
      {/* Standard white BioSpark header */}
      <div className="border-b border-[rgba(0,0,0,0.06)]" style={{ background: "white", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-xl text-sm font-bold" style={{ background: "#006e55", color: "white" }}>
              ⚡
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: "#0a1a14" }}>
                Bio<span className="text-bs-teal">Spark</span>
              </div>
              <div className="text-xs" style={{ color: "#5a7d72" }}>
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
              className="text-3xl font-semibold tracking-tight" style={{ color: "#0a1a14" }}
              delay={80}
              animateBy="words"
            />
            <p className="mt-2" style={{ color: "#5a7d72" }}>
              Access your dashboard, item bank, and AI grading tools.
            </p>
          </div>

          <SpotlightCard
            className="rounded-2xl p-8 shadow-sm"
            spotlightColor="rgba(0,196,154,0.10)"
            style={{
              background: "white",
              border: "1px solid rgba(0,0,0,0.06)",
              borderRadius: 16,
            }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <FormControl error={!!error}>
                <FormLabel sx={labelStyles}>
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
                  sx={inputStyles}
                />
              </FormControl>

              <FormControl error={!!error}>
                <FormLabel sx={labelStyles}>
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
                  sx={inputStyles}
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
                  background: "#006e55",
                  fontWeight: 700,
                  mt: 1,
                  "&:hover": {
                    background: "#003d2e",
                  },
                }}
              >
                Sign in to BioSpark
              </Button>
            </form>

            {/* Demo credentials hint */}
            <div className="mt-6 rounded-2xl p-4 text-sm" style={{ background: "#e6faf5", border: "1px solid rgba(0,196,154,0.2)", borderRadius: 12 }}>
              <div className="font-semibold" style={{ color: "#006e55" }}>
                Demo credentials
              </div>
              <div className="mt-1" style={{ color: "rgba(10,26,20,0.8)" }}>
                <span className="font-medium">Email:</span> teacher@biospark.app
              </div>
              <div style={{ color: "rgba(10,26,20,0.8)" }}>
                <span className="font-medium">Password:</span> biospark
              </div>
            </div>
          </SpotlightCard>

          <p className="mt-6 text-center text-sm" style={{ color: "#5a7d72" }}>
            Student?{" "}
            <Link
              href="/auth/student/login"
              className="font-semibold hover:underline" style={{ color: "#006e55" }}
            >
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
