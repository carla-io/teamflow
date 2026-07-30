import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { registerSchema, type RegisterFormValues } from "../../lib/validation";
import { AuthLayout } from "../../lib/AuthLayout";

export function RegisterPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

 const onSubmit = async (values: RegisterFormValues) => {
  setServerError(null);

  const { data, error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: {
        username: values.username,
        full_name: values.fullName,
      },
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      setError("email", { message: "An account with this email already exists" });
    } else {
      setServerError(error.message);
    }
    return;
  }

  if (!data.user) {
    setServerError("Something went wrong creating your account. Please try again.");
    return;
  }

  // No session yet — user must confirm their email before we can create their profile.
  navigate("/login", { state: { justRegistered: true } });
};

  return (
    <AuthLayout
      eyebrow="Get started"
      title="Create your account"
      subtitle="Set up your TeamFlow account to start collaborating with your team."
      footer={
        <>
          Already have an account? <Link to="/login">Sign in</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {serverError && <p className="banner-error">{serverError}</p>}

        <div className="form-group">
          <label className="form-label" htmlFor="fullName">
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            className="form-input"
            aria-invalid={!!errors.fullName}
            placeholder="Jordan Reyes"
            {...register("fullName")}
          />
          {errors.fullName && <p className="field-error">{errors.fullName.message}</p>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            className="form-input"
            aria-invalid={!!errors.username}
            placeholder="jordanreyes"
            {...register("username")}
          />
          {errors.username && <p className="field-error">{errors.username.message}</p>}
        </div>

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

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              className="form-input"
              aria-invalid={!!errors.password}
              placeholder="8+ characters"
              {...register("password")}
            />
            {errors.password && <p className="field-error">{errors.password.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className="form-input"
              aria-invalid={!!errors.confirmPassword}
              placeholder="Re-enter password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="field-error">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <label className="checkbox-row">
          <input type="checkbox" {...register("agreeToTerms")} />
          <span>
            I agree to the <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>
          </span>
        </label>
        {errors.agreeToTerms && <p className="field-error">{errors.agreeToTerms.message}</p>}

        <button className="submit-btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}