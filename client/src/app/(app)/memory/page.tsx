"use client";

import { useState } from "react";

import MemoryCard from "@/components/memory/MemoryCard";
import MemoryForm from "@/components/memory/MemoryForm";
import MemoryModal from "@/components/memory/MemoryModal";
import MemoryEditForm from "@/components/memory/MemoryEditForm";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

import { type Memory, type MemoryCategory } from "@/lib/api/memory.api";

import { useDeleteMemory, useMemories } from "@/hooks/useMemories";

const categories: {
  label: string;
  value?: MemoryCategory;
}[] = [
  { label: "All" },
  { label: "Working style", value: "working_style" },
  { label: "Projects", value: "project" },
  { label: "Focus", value: "focus" },
  { label: "Preferences", value: "preference" },
];

function formatCategory(category: MemoryCategory) {
  const labels: Record<MemoryCategory, string> = {
    working_style: "Working style",
    project: "Project",
    focus: "Focus",
    preference: "Preference",
  };

  return labels[category];
}

function formatSource(source: string) {
  const labels: Record<string, string> = {
    conversation: "Conversation",
    checkin: "Check-ins",
    goal: "Goals",
    task: "Tasks",
    manual: "Manual",
  };

  return labels[source] ?? source;
}

function formatUpdatedAt(date: string) {
  const value = new Date(date);
  const now = new Date();

  const isToday =
    value.getFullYear() === now.getFullYear() &&
    value.getMonth() === now.getMonth() &&
    value.getDate() === now.getDate();

  if (isToday) {
    return "Today";
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    value.getFullYear() === yesterday.getFullYear() &&
    value.getMonth() === yesterday.getMonth() &&
    value.getDate() === yesterday.getDate();

  if (isYesterday) {
    return "Yesterday";
  }

  return value.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function MemoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    MemoryCategory | undefined
  >(undefined);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [memoryToDelete, setMemoryToDelete] = useState<Memory | null>(null);
  const [memoryToEdit, setMemoryToEdit] = useState<Memory | null>(null);
  const memoriesQuery = useMemories(
    selectedCategory ? { category: selectedCategory } : undefined,
  );

  const deleteMemoryMutation = useDeleteMemory();

  async function handleDelete() {
    if (!memoryToDelete) {
      return;
    }

    try {
      await deleteMemoryMutation.mutateAsync(memoryToDelete._id);

      setMemoryToDelete(null);
    } catch {
      // Mutation error is handled by the mutation state.
    }
  }

  return (
    <div className="space-y-8 py-6">
      {/* Header */}

      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-foreground-secondary">Context</p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Memory
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-secondary">
            Important context that helps Companion understand you over time.
          </p>
        </div>

        <Button type="button" onClick={() => setIsCreateOpen(true)}>
          Add memory
        </Button>
      </section>

      {/* Memory explanation */}

      <Card className="bg-surface-elevated p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-foreground-secondary">
          About memory
        </p>

        <h2 className="mt-3 text-lg font-semibold">
          You stay in control of what Companion remembers.
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-secondary">
          Memories can come from conversations, check-ins, goals and other
          interactions. You can review, edit or remove them whenever you want.
        </p>
      </Card>

      {/* Filters */}

      <div className="flex items-center gap-1 overflow-x-auto border-b border-border">
        {categories.map((item) => {
          const isActive = selectedCategory === item.value;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setSelectedCategory(item.value)}
              className={[
                "shrink-0 px-3 py-3 text-sm",
                isActive
                  ? "border-b-2 border-foreground font-medium text-foreground"
                  : "text-foreground-secondary",
              ].join(" ")}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Memory list */}

      {memoriesQuery.isLoading && (
        <section className="grid gap-5 lg:grid-cols-2">
          <Card className="p-6">
            <p className="text-sm text-foreground-secondary">Loading memories...</p>
          </Card>
        </section>
      )}

      {memoriesQuery.isError && (
        <section className="grid gap-5 lg:grid-cols-2">
          <Card className="p-6">
            <p className="text-sm text-red-600">
              Unable to load memories. Please try again.
            </p>
          </Card>
        </section>
      )}

      {!memoriesQuery.isLoading &&
        !memoriesQuery.isError &&
        memoriesQuery.data?.length === 0 && (
          <section className="grid gap-5 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="font-semibold">No memories found</h3>

              <p className="mt-2 text-sm leading-6 text-foreground-secondary">
                Add something you want Companion to remember.
              </p>
            </Card>
          </section>
        )}

      {!memoriesQuery.isLoading &&
        !memoriesQuery.isError &&
        memoriesQuery.data &&
        memoriesQuery.data.length > 0 && (
          <section className="grid gap-5 lg:grid-cols-2">
            {memoriesQuery.data.map((memory) => (
              <MemoryCard
                key={memory._id}
                title={memory.title}
                content={memory.content}
                category={formatCategory(memory.category)}
                updatedAt={formatUpdatedAt(memory.updatedAt)}
                source={formatSource(memory.source)}
                onEdit={() => setMemoryToEdit(memory)}
                onDelete={() => setMemoryToDelete(memory)}
                deleting={
                  deleteMemoryMutation.isPending &&
                  deleteMemoryMutation.variables === memory._id
                }
              />
            ))}
          </section>
        )}

      {/* Privacy / control */}

      <section className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium">Memory controls</p>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-foreground-secondary">
              Manage what Companion can remember and how your context is used.
            </p>
          </div>

          <Button variant="secondary">Manage settings</Button>
        </div>
      </section>

      {/* Create Memory */}

      <MemoryModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
        <MemoryForm
          onSuccess={() => setIsCreateOpen(false)}
          onCancel={() => setIsCreateOpen(false)}
        />
      </MemoryModal>

      {/* Delete Memory */}

      <ConfirmDialog
        open={Boolean(memoryToDelete)}
        onClose={() => {
          if (!deleteMemoryMutation.isPending) {
            setMemoryToDelete(null);
          }
        }}
        onConfirm={handleDelete}
        title="Delete memory?"
        description="This memory will be permanently removed from your Companion context."
        confirmLabel={
          deleteMemoryMutation.isPending ? "Deleting..." : "Delete memory"
        }
        destructive
      />
      {/* Edit Memory */}
      <MemoryModal
        open={Boolean(memoryToEdit)}
        onClose={() => setMemoryToEdit(null)}
      >
        {memoryToEdit && (
          <MemoryEditForm
            memory={memoryToEdit}
            onSuccess={() => setMemoryToEdit(null)}
            onCancel={() => setMemoryToEdit(null)}
          />
        )}
      </MemoryModal>
    </div>
  );
}
