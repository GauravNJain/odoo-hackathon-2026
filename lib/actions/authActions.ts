"use server";

import { supabase } from "@/lib/supabase";
import { z } from "zod";
import bcrypt from "bcryptjs";

const SignUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function signUp(values: z.infer<typeof SignUpSchema>) {
  try {
    const validated = SignUpSchema.parse(values);

    const { name, email, password } = validated;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return { success: false, error: "User already exists with this email" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const { data: user, error: insertError } = await supabase
      .from('users')
      .insert({
        id: crypto.randomUUID(),
        name,
        email,
        password: hashedPassword,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return { success: false, error: "Failed to create user" };
    }

    return { success: true, user: { id: user.id, email: user.email, name: user.name } };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Something went wrong during sign up" };
  }
}
