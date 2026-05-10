import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        stops: {
          include: { activities: true }
        }
      }
    });
    return NextResponse.json({ success: true, data: trips });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Simplified creation
    const trip = await prisma.trip.create({
      data: {
        userId: "dummy-user-id", // Hardcoded for this simplified version, should extract from token
        name: body.name || body.destination,
        description: "",
        startDate: new Date(body.startDate || new Date()),
        endDate: new Date(body.endDate || new Date()),
        coverImage: body.coverImage || "",
      }
    });
    return NextResponse.json({ success: true, data: trip });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
