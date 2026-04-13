import { notFound } from "next/navigation";
import { getWorkoutById } from "../../../../../data/workouts";
import { EditWorkoutForm } from "./edit-workout-form";

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = await params;
  const id = Number(workoutId);

  if (Number.isNaN(id)) notFound();

  const workout = await getWorkoutById(id);

  if (!workout) notFound();

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Workout</h1>
      <EditWorkoutForm
        workout={{
          id: workout.id,
          name: workout.name,
          startedAt: workout.startedAt,
        }}
      />
    </div>
  );
}
