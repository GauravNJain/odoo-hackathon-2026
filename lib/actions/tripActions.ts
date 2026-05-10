'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

// Validation Schema
const CreateTripSchema = z.object({
  userId: z.string(),
  name: z.string().min(3, "Trip name must be at least 3 characters"),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
}).refine((data) => data.endDate > data.startDate, {
  message: "End date must be after start date",
})

export async function createTrip(formData: FormData | any) {
  try {
    const validated = CreateTripSchema.parse(formData)

    const trip = await prisma.trip.create({
      data: {
        userId: validated.userId,
        name: validated.name,
        description: validated.description,
        startDate: validated.startDate,
        endDate: validated.endDate,
      },
      include: {
        stops: true,
      }
    })

    revalidatePath('/dashboard')
    return { success: true, data: trip }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create trip" }
  }
}
