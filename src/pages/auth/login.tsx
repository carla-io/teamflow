import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { loginSchema, type LoginFormValues } from "../../lib/validation";
import { AuthLayout } from "../../lib/AuthLayout";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { justRegistered?: boolean } };
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
  setServerError(null);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (error) {
    setServerError(
      error.message.toLowerCase().includes("invalid")
        ? "Incorrect email or password"
        : error.message,
    );
    return;
  }

  console.log("User ID:", data.user.id);

const { data: sessionData } = await supabase.auth.getSession();
console.log("Session:", sessionData.session);

  // Ensure a profile row exists for this user (created on first login after email confirmation).
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!existingProfile) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      username: data.user.user_metadata.username,
      full_name: data.user.user_metadata.full_name,
      avatar_url: null,
    });

    if (profileError) {
      console.error("Failed to create profile:", profileError);
      // Optional: show a non-blocking error, but still let them into the app
    }
  }

  navigate("/");
};

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in"
      subtitle="Sign in to pick up where your team left off."
      footer={
        <>
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {location.state?.justRegistered && !serverError && (
          <p className="banner-success">Account created. Sign in to continue.</p>
        )}
        {serverError && <p className="banner-error">{serverError}</p>}

        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="form-input"
            aria-invalid={!!errors.email}
            placeholder="you@company.com"
            {...register("email")}
          />
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="form-input"
            aria-invalid={!!errors.password}
            placeholder="Your password"
            {...register("password")}
          />
          {errors.password && <p className="field-error">{errors.password.message}</p>}
        </div>

        <button className="submit-btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  );
}