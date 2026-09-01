"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import Button from "@/components/ui/Button";
import { useCreateMemory } from "@/hooks/useMemories";
import {
  memoryFormSchema,
  type MemoryFormValues,
} from "@/lib/validation/memory.schema";

interface MemoryFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const inputClassName =
  "mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-foreground-muted focus:border-foreground-muted focus:ring-2 focus:ring-foreground-muted/20";

export default function MemoryForm({ onSuccess, onCancel }: MemoryFormProps) {
  const createMemoryMutation = useCreateMemory();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<MemoryFormValues>({
    resolver: zodResolver(memoryFormSchema),

    defaultValues: {
      title: "",
      content: "",
      category: "working_style",
      importance: 3,
    },
  });

  async function onSubmit(values: MemoryFormValues) {
    try {
      await createMemoryMutation.mutateAsync({
        title: values.title.trim(),
        content: values.content.trim(),
        category: values.category,
        source: "manual",
        importance: values.importance,
      });

      reset();
      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to create memory.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label
          htmlFor="memory-title"
          className="text-sm font-medium text-foreground"
        >
          Memory title
        </label>

        <input
          id="memory-title"
          {...register("title")}
          placeholder="What should Companion remember?"
          className={inputClassName}
        />

        {errors.title && (
          <p className="mt-1.5 text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="memory-content"
          className="text-sm font-medium text-foreground"
        >
          Content
        </label>

        <textarea
          id="memory-content"
          {...register("content")}
          rows={4}
          placeholder="Add the context you want Companion to remember..."
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
          htmlFor="memory-category"
          className="text-sm font-medium text-foreground"
        >
          Category
        </label>

        <select
          id="memory-category"
          {...register("category")}
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
          htmlFor="memory-importance"
          className="text-sm font-medium text-foreground"
        >
          Importance
        </label>

        <select
          id="memory-importance"
          {...register("importance", {
            setValueAs: (value) => Number(value),
          })}
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

      {createMemoryMutation.isError && (
        <p className="text-sm text-red-600">
          {createMemoryMutation.error instanceof Error
            ? createMemoryMutation.error.message
            : "Unable to create memory."}
        </p>
      )}

      <div className="flex justify-end gap-3 border-t border-border pt-5">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting || createMemoryMutation.isPending}
          >
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          disabled={isSubmitting || createMemoryMutation.isPending}
        >
          {createMemoryMutation.isPending ? "Creating..." : "Create memory"}
        </Button>
      </div>
    </form>
  );
}
