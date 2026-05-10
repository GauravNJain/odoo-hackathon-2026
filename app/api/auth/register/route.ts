import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName } = await req.json();

    const { data: existing } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existing) {
      return NextResponse.json({ success: false, message: "User exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { data: user, error: insertError } = await supabase
      .from('users')
      .insert({
        id: crypto.randomUUID(),
        email,
        password: hashedPassword,
        name: `${firstName} ${lastName}`.trim(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json({ success: false, message: "Failed to create user" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        token: `mock-jwt-${user.id}`,
        user: {
          id: user.id,
          email: user.email,
          firstName,
          lastName,
          role: "user",
        },
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
