import { auth } from "@clerk/nextjs/server";
import { and, eq, gte, lte } from "drizzle-orm";
import { db } from "@/db";
import { exercises, workoutExercises, workouts } from "@/db/schema";

export async function createWorkout(data: { name: string; startedAt: Date }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [workout] = await db
    .insert(workouts)
    .values({ ...data, userId })
    .returning({ id: workouts.id });

  return workout;
}

export async function getWorkoutsForDate(date: Date) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const rows = await db
    .select({
      workoutId: workouts.id,
      workoutName: workouts.name,
      exerciseName: exercises.name,
      exerciseOrder: workoutExercises.order,
    })
    .from(workouts)
    .leftJoin(workoutExercises, eq(workoutExercises.workoutId, workouts.id))
    .leftJoin(exercises, eq(exercises.id, workoutExercises.exerciseId))
    .where(
      and(
        eq(workouts.userId, userId),
        gte(workouts.createdAt, start),
        lte(workouts.createdAt, end)
      )
    )
    .orderBy(workouts.id, workoutExercises.order);

  const workoutMap = new Map<
    number,
    { id: number; name: string | null; exercises: string[] }
  >();

  for (const row of rows) {
    if (!workoutMap.has(row.workoutId)) {
      workoutMap.set(row.workoutId, {
        id: row.workoutId,
        name: row.workoutName,
        exercises: [],
      });
    }
    if (row.exerciseName) {
      workoutMap.get(row.workoutId)!.exercises.push(row.exerciseName);
    }
  }

  return Array.from(workoutMap.values());
}
