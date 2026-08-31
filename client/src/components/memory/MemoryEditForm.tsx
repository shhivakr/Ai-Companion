"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import Button from "@/components/ui/Button";
import { useUpdateMemory } from "@/hooks/useMemories";
import type { Memory, MemoryCategory } from "@/lib/api/memory.api";
import {
  memoryFormSchema,
  type MemoryFormValues,
} from "@/lib/validation/memory.schema";

interface MemoryEditFormProps {
  memory: Memory;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const inputClassName =
  "mt-2 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100";

export default function MemoryEditForm({
  memory,
  onSuccess,
  onCancel,
}: MemoryEditFormProps) {
  const updateMemoryMutation = useUpdateMemory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MemoryFormValues>({
    resolver: zodResolver(memoryFormSchema),

    defaultValues: {
      title: memory.title,
      content: memory.content,
      category: memory.category,
      importance: memory.importance,
    },
  });

  useEffect(() => {
    reset({
      title: memory.title,
      content: memory.content,
      category: memory.category,
      importance: memory.importance,
    });
  }, [memory, reset]);

  async function onSubmit(values: MemoryFormValues) {
    try {
      await updateMemoryMutation.mutateAsync({
        id: memory._id,

        payload: {
          title: values.title.trim(),
          content: values.content.trim(),
          category: values.category,
          importance: values.importance,
        },
      });

      toast.success("Memory updated.");
      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update memory.",
      );
    }
  }

  const isSubmitting = updateMemoryMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label
          htmlFor="memory-edit-title"
          className="text-sm font-medium text-neutral-900"
        >
          Memory title
        </label>

        <input
          id="memory-edit-title"
          {...register("title")}
          placeholder="What should Companion remember?"
          maxLength={200}
          disabled={isSubmitting}
          className={inputClassName}
        />

        {errors.title && (
          <p className="mt-1.5 text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="memory-edit-content"
          className="text-sm font-medium text-neutral-900"
        >
          Content
        </label>

        <textarea
          id="memory-edit-content"
          {...register("content")}
          rows={4}
          placeholder="Add the context you want Companion to remember..."
          maxLength={2000}
          disabled={isSubmitting}
          className={`${inputClassName} resize-none`}
        />

        {errors.content && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.content.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="memory-edit-category"
          className="text-sm font-medium text-neutral-900"
        >
          Category
        </label>

        <select
          id="memory-edit-category"
          {...register("category")}
          disabled={isSubmitting}
          className={inputClassName}
        >
          <option value="working_style">Working style</option>
          <option value="project">Project</option>
          <option value="focus">Focus</option>
          <option value="preference">Preference</option>
        </select>

        {errors.category && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.category.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="memory-edit-importance"
          className="text-sm font-medium text-neutral-900"
        >
          Importance
        </label>

        <select
          id="memory-edit-importance"
          {...register("importance", {
            setValueAs: (value) => Number(value),
          })}
          disabled={isSubmitting}
          className={inputClassName}
        >
          <option value={1}>1 — Low</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5 — High</option>
        </select>

        {errors.importance && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.importance.message}
          </p>
        )}
      </div>

      {updateMemoryMutation.isError && (
        <p className="text-sm text-red-600">
          {updateMemoryMutation.error instanceof Error
            ? updateMemoryMutation.error.message
            : "Unable to update memory."}
        </p>
      )}

      <div className="flex justify-end gap-3 border-t border-neutral-100 pt-5">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update memory"}
        </Button>
      </div>
    </form>
  );
}
