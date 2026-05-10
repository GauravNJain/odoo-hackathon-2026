'use server'

import { supabase } from '@/lib/supabase'
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

    const { data: trip, error } = await supabase
      .from('trips')
      .insert({
        id: crypto.randomUUID(),
        user_id: validated.userId,
        name: validated.name,
        description: validated.description,
        start_date: validated.startDate.toISOString(),
        end_date: validated.endDate.toISOString(),
      })
      .select('*, stops(*)')
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return { success: false, error: error.message }
    }

    revalidatePath('/dashboard')
    return { success: true, data: trip }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create trip" }
  }
}
