"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createWorkout } from "../../../../../data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1, "Workout name is required"),
  startedAt: z.coerce.date(),
});

export async function createWorkoutAction(data: {
  name: string;
  startedAt: Date;
}) {
  const parsed = createWorkoutSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid input");

  const workout = await createWorkout(parsed.data);
  redirect(`/dashboard`);
}
