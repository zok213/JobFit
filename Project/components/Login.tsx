"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { EyeIcon, EyeOffIcon, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Alert, AlertDescription } from "./ui/alert";
import { Logo } from "./ui/logo";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Login = () => {
  const { login, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Social login options
  const socialLogins = [
    {
      id: "facebook",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z"
            stroke="#0866FF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      alt: "Facebook login",
    },
    {
      id: "google",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.255H17.92C17.655 15.63 16.89 16.795 15.725 17.525V20.335H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z"
            fill="#4285F4"
          />
          <path
            d="M12 23C14.97 23 17.46 22.015 19.28 20.335L15.725 17.525C14.74 18.195 13.48 18.58 12 18.58C9.235 18.58 6.895 16.715 6.025 14.25H2.36V17.14C4.16 20.655 7.8 23 12 23Z"
            fill="#34A853"
          />
          <path
            d="M6.025 14.25C5.79 13.57 5.655 12.835 5.655 12C5.655 11.165 5.79 10.43 6.025 9.75V6.86H2.36C1.605 8.43 1.16 10.16 1.16 12C1.16 13.84 1.605 15.57 2.36 17.14L6.025 14.25Z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.42C13.525 5.42 14.9 5.955 15.975 6.975L19.12 3.83C17.455 2.265 14.965 1.27 12 1.27C7.8 1.27 4.16 3.615 2.36 7.13L6.025 10.02C6.895 7.555 9.235 5.42 12 5.42Z"
            fill="#EA4335"
          />
        </svg>
      ),
      alt: "Google login",
    },
    {
      id: "apple",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.624 5.57C15.73 5.684 14.609 6.282 13.96 6.973C13.391 7.578 12.968 8.498 12.968 9.44C12.968 9.564 12.979 9.687 12.993 9.779C13.008 9.864 13.023 9.936 13.023 9.994C13.023 10.023 13.015 10.036 13 10.036C12.97 10.036 12.669 10.019 12.332 9.936C11.842 9.812 11.056 9.485 10.502 8.995C9.957 8.514 9.367 7.64 9.367 6.3C9.367 5.508 9.535 4.892 9.788 4.407C10.058 3.89 10.393 3.514 10.745 3.221C11.421 2.652 12.376 2.193 13.188 2.058C13.308 2.038 13.399 2.029 13.45 2.029C13.473 2.029 13.489 2.032 13.5 2.038C13.526 2.05 13.534 2.073 13.534 2.102C13.534 2.154 13.5 2.249 13.5 2.367C13.5 2.9 13.673 3.631 14.047 4.26C14.429 4.901 15.066 5.425 16.053 5.5C16.188 5.508 16.331 5.522 16.466 5.541C16.556 5.552 16.624 5.564 16.669 5.564C16.699 5.564 16.714 5.57 16.714 5.584C16.714 5.593 16.699 5.602 16.669 5.61C16.654 5.619 16.639 5.57 16.624 5.57Z"
            fill="black"
          />
          <path
            d="M18.985 17.927C18.985 17.979 18.97 18.018 18.933 18.047C18.767 18.162 18.158 18.465 17.513 18.465C16.519 18.465 15.953 17.868 15.075 17.868C14.76 17.868 14.535 17.909 14.173 17.997C13.984 18.042 13.82 18.082 13.729 18.082C13.669 18.082 13.632 18.068 13.602 18.038C13.587 18.024 13.58 18.009 13.58 18.097C13.58 17.974 13.595 17.944 13.624 17.909C13.707 17.803 13.834 17.651 13.976 17.465C14.237 17.133 14.46 16.747 14.624 16.326C14.789 15.897 14.894 15.448 14.894 15.005C14.894 14.981 14.887 14.952 14.887 14.922C14.887 14.893 14.887 14.87 14.887 14.84C14.887 14.81 14.902 14.796 14.924 14.796C14.939 14.796 14.962 14.802 14.992 14.814C15.105 14.855 15.34 14.911 15.699 14.911C16.053 14.911 16.579 14.814 17.105 14.593C17.651 14.364 18.173 13.97 18.722 13.356C19.271 12.741 19.722 11.892 19.722 10.658C19.722 10.059 19.611 9.606 19.444 9.262C19.271 8.912 19.02 8.657 18.722 8.477C18.173 8.123 17.338 7.969 16.414 7.969C15.879 7.969 15.368 8.017 14.917 8.123C14.466 8.225 14.084 8.365 13.774 8.536C13.645 8.607 13.535 8.677 13.436 8.753C13.338 8.829 13.256 8.9 13.188 8.971C13.02 9.147 12.895 9.341 12.8 9.541C12.702 9.73 12.635 9.93 12.572 10.111C12.451 10.453 12.376 10.747 12.346 10.975C12.331 11.087 12.324 11.176 12.324 11.24C12.324 11.281 12.324 11.316 12.331 11.34C12.339 11.363 12.339 11.387 12.339 11.404C12.339 11.434 12.324 11.45 12.301 11.45C12.271 11.45 12.196 11.416 12.09 11.346C11.917 11.229 11.66 11.028 11.428 10.746C11.193 10.464 10.985 10.118 10.835 9.737C10.684 9.348 10.601 8.927 10.601 8.494C10.601 7.765 10.745 7.126 11.01 6.6C11.271 6.089 11.63 5.672 12.075 5.356C12.293 5.199 12.53 5.067 12.794 4.954C13.06 4.835 13.338 4.736 13.632 4.654C14.241 4.489 14.917 4.398 15.639 4.377C15.759 4.371 15.879 4.368 15.993 4.368C16.113 4.368 16.222 4.371 16.331 4.374C17.158 4.392 17.861 4.489 18.43 4.642C18.985 4.789 19.414 5.002 19.745 5.25C20.39 5.734 20.789 6.395 21.023 7.056C21.249 7.698 21.346 8.342 21.346 8.953C21.346 9.13 21.338 9.3 21.33 9.471C21.323 9.635 21.308 9.791 21.293 9.947C21.256 10.329 21.196 10.687 21.106 11.021C21.016 11.346 20.902 11.657 20.759 11.944C20.564 12.334 20.301 12.69 19.985 13.007C19.669 13.323 19.301 13.604 18.895 13.849C18.533 14.066 18.135 14.244 17.717 14.392C17.301 14.534 16.879 14.64 16.481 14.723C16.263 14.769 16.046 14.802 15.841 14.828C15.635 14.855 15.442 14.87 15.271 14.87C15.237 14.87 15.204 14.87 15.177 14.87C15.151 14.87 15.123 14.87 15.098 14.87C15.083 14.878 15.075 14.893 15.075 14.922C15.075 14.981 15.09 15.071 15.122 15.071C15.204 15.301 15.368 15.646 15.639 15.983C15.91 16.323 16.308 16.668 16.879 16.929C17.02 16.997 17.195 17.071 17.384 17.139C17.579 17.207 17.774 17.269 17.968 17.316C18.143 17.357 18.286 17.39 18.399 17.41C18.511 17.43 18.593 17.442 18.639 17.447C18.67 17.447 18.692 17.453 18.714 17.459C18.737 17.465 18.752 17.471 18.767 17.471C18.805 17.471 18.827 17.471 18.842 17.486C18.857 17.501 18.872 17.53 18.888 17.577C18.917 17.671 18.947 17.776 18.97 17.88C18.977 17.904 18.985 17.918 18.985 17.927Z"
            fill="black"
          />
        </svg>
      ),
      alt: "Apple login",
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Enhanced logging for debugging
    console.log("Login attempt with:", { email: formData.email });

    // Add test account for easy login
    if (
      (formData.email === "test@jobfit.ai" &&
        formData.password === "test123") ||
      (formData.email === "test@example.com" &&
        formData.password === "password123")
    ) {
      // Mock the login for test account
      console.log("Using test account login");

      try {
        setIsSubmitting(true);

        // Create and store a mock user in localStorage
        const mockUser = {
          id:
            formData.email === "test@example.com"
              ? "example-user-id"
              : "test-user-id",
          email: formData.email,
          username:
            formData.email === "test@example.com"
              ? "Example User"
              : "Test User",
          role: "employee",
          avatarUrl: null,
        };

        // Store mock user data in localStorage
        localStorage.setItem("jobfit_user", JSON.stringify(mockUser));
        localStorage.setItem("supabase_auth_token", "mock-auth-token");

        // Wait a moment to simulate API call
        setTimeout(() => {
          setIsSubmitting(false);
          // Sử dụng window.location thay vì router.push vì có thể có vấn đề với router
          window.location.href = "/dashboard";
        }, 1000);
      } catch (err) {
        console.error("Error in test login:", err);
        setIsSubmitting(false);
        setError("Failed to perform test login. Please try again.");
      }
      return;
    }

    try {
      setIsSubmitting(true);
      await login(formData.email, formData.password);
      // Redirect will be handled by the auth state change
    } catch (err: any) {
      console.error("Login error details:", err);

      // More user-friendly error messages
      let errorMessage = "Failed to sign in. Please check your credentials.";

      if (err.message) {
        if (err.message.includes("credentials")) {
          errorMessage = "Invalid email or password. Please try again.";
        } else if (err.message.includes("network")) {
          errorMessage = "Network error. Please check your connection.";
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-lime-300 to-lime-400 p-4">
      <div className="absolute inset-0 bg-[url('/img/bg-pattern.svg')] bg-cover bg-center opacity-20" />

      {/* Background elements for visual interest */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-lime-200 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-lime-500 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2 opacity-20"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-lime-300 via-lime-400 to-lime-300"></div>

          <CardHeader className="text-center pt-8 pb-4">
            <div className="mx-auto mb-6">
              <Logo size="lg" />
            </div>
            <CardTitle className="text-2xl font-bold text-zinc-900">
              Sign In
            </CardTitle>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email or username"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-12 bg-zinc-50 border-zinc-200 rounded-lg focus:ring-2 focus:ring-lime-300 focus:border-lime-300 transition-all duration-200"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-12 bg-zinc-50 border-zinc-200 rounded-lg focus:ring-2 focus:ring-lime-300 focus:border-lime-300 transition-all duration-200 pr-10"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-800 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOffIcon size={20} />
                  ) : (
                    <EyeIcon size={20} />
                  )}
                </button>
              </div>

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-lime-600 hover:text-lime-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 mt-6 bg-black text-lime-300 hover:bg-zinc-800 transition-all duration-200 rounded-lg font-medium flex items-center justify-center"
                disabled={authLoading || isSubmitting}
              >
                {authLoading || isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="text-center mt-6">
                <span className="text-zinc-600">Don't have an account? </span>
                <Link
                  href="/register"
                  className="text-lime-600 font-semibold hover:text-lime-700 transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-4 text-sm text-white/80">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-white">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-white">
            Privacy Policy
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
