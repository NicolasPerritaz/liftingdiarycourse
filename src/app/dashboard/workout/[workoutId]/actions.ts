"use server";

import { z } from "zod";
import { updateWorkout } from "../../../../../data/workouts";

const updateWorkoutSchema = z.object({
  name: z.string().min(1, "Workout name is required"),
  startedAt: z.coerce.date(),
});

export async function updateWorkoutAction(
  workoutId: number,
  data: { name: string; startedAt: Date }
) {
  const parsed = updateWorkoutSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid input");

  return updateWorkout(workoutId, parsed.data);
}
