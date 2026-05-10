import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const { data: trips, error } = await supabase
      .from('trips')
      .select('*, stops(*, activities(*))');

    if (error) {
      console.error("Supabase GET trips error:", error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    const formattedTrips = trips.map(trip => ({
      ...trip,
      coverPhoto: trip.cover_image,
      destination: trip.destination || trip.name,
      status: trip.status || "upcoming",
      stopsCount: trip.stops?.length || 0,
      totalBudget: 0, // Placeholder
      currency: "INR",
    }));

    return NextResponse.json({ success: true, data: formattedTrips });
  } catch (error) {
    console.error("GET /api/trips error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const authHeader = req.headers.get("authorization");
    let userId = "dummy-user-id";

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      if (token.startsWith("mock-jwt-")) {
        userId = token.substring(9);
      }
    }

    // Verify user exists to avoid foreign key constraint error
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!user) {
      console.error("Trip creation failed: User not found", userId);
      return NextResponse.json({ success: false, message: "User not found" }, { status: 401 });
    }

    const { data: trip, error: insertError } = await supabase
      .from('trips')
      .insert({
        id: crypto.randomUUID(),
        user_id: userId,
        name: body.name || body.destination || "Untitled Trip",
        destination: body.destination || body.name || "",
        description: body.description || "",
        start_date: new Date(body.startDate || new Date()).toISOString(),
        end_date: new Date(body.endDate || new Date()).toISOString(),
        cover_image: body.coverPhoto || body.coverImage || "",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Supabase POST trip error:", insertError);
      return NextResponse.json({ success: false, message: insertError.message }, { status: 500 });
    }

    const formattedTrip = {
      ...trip,
      coverPhoto: trip.cover_image,
      destination: trip.destination || trip.name,
      status: trip.status || "upcoming",
      stopsCount: 0,
      totalBudget: 0,
      currency: "INR",
    };

    return NextResponse.json({ success: true, data: formattedTrip });
  } catch (error: any) {
    console.error("POST /api/trips error:", error);
    return NextResponse.json({ success: false, message: error.message || "Server error" }, { status: 500 });
  }
}
