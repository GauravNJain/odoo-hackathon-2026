"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").regex(/^\d+$/, "Phone must contain only numbers"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  additionalInfo: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      await authApi.register(data);
      toast.success("Registration successful! Please sign in.");
      router.push("/login");
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left hero — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80')" }} />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/80 via-brand-800/60 to-brand-600/40" />
        <div className="relative z-10 flex flex-col justify-end p-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">🌍</span>
            <span className="font-display text-3xl font-bold text-white">Traveloop</span>
          </div>
          <h2 className="font-display text-5xl font-bold text-white leading-tight">
            Your adventure<br />starts here
          </h2>
          <p className="mt-4 max-w-md text-lg text-white/80">
            Join thousands of travelers who plan smarter, spend wiser, and explore further with Traveloop.
          </p>
        </div>
      </div>

      {/* Right — register form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <span className="text-4xl">🌍</span>
            <h1 className="mt-2 font-display text-2xl font-bold text-ink-primary">Traveloop</h1>
          </div>

          <div className="rounded-lg border border-border-default bg-surface p-8 shadow-card">
            <h2 className="font-display text-2xl font-semibold text-ink-primary">Create your account</h2>
            <p className="mt-1 text-sm text-ink-secondary">Start planning your next adventure</p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" {...register("firstName")} className={errors.firstName ? "border-error" : ""} />
                  {errors.firstName && <p className="text-xs text-error">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" {...register("lastName")} className={errors.lastName ? "border-error" : ""} />
                  {errors.lastName && <p className="text-xs text-error">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-email">Email Address *</Label>
                <Input id="reg-email" type="email" autoComplete="email" {...register("email")} className={errors.email ? "border-error" : ""} />
                {errors.email && <p className="text-xs text-error">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-password">Password *</Label>
                <Input id="reg-password" type="password" autoComplete="new-password" placeholder="Minimum 8 characters" {...register("password")} className={errors.password ? "border-error" : ""} />
                {errors.password && <p className="text-xs text-error">{errors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" type="tel" {...register("phone")} className={errors.phone ? "border-error" : ""} />
                {errors.phone && <p className="text-xs text-error">{errors.phone.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" {...register("city")} className={errors.city ? "border-error" : ""} />
                  {errors.city && <p className="text-xs text-error">{errors.city.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input id="country" {...register("country")} className={errors.country ? "border-error" : ""} />
                  {errors.country && <p className="text-xs text-error">{errors.country.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea id="additionalInfo" placeholder="Tell us about your travel preferences..." rows={3} {...register("additionalInfo")} />
              </div>

              <Button type="submit" className="w-full bg-brand-500 hover:bg-brand-600 text-white" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account...</> : "Create Account"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-ink-secondary">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-brand-500 hover:text-brand-600">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
