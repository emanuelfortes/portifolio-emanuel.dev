"use client";
import { useEffect, useState } from "react";
import { Button } from "@/demos/lexcursos/components/ui/button";
import { Input, Textarea } from "@/demos/lexcursos/components/ui/input";
import { Select } from "@/demos/lexcursos/components/ui/select";
import { Dialog, DialogFooter } from "@/demos/lexcursos/components/ui/dialog";
import { useToast } from "@/demos/lexcursos/components/ui/toast";
import { MediaUploader } from "@/demos/lexcursos/components/upload/media-uploader";
import { createLesson, updateLesson } from "@/demos/lexcursos/lib/store";
import type { LessonType } from "@/demos/lexcursos/lib/types";

// Réplica do formulário de aula. O envio de vídeo (Bunny) e de PDF (Cloudinary) é simulado;
// o construtor de quiz e os PDFs anexos do original ficam de fora.

const TYPE_OPTIONS: { value: LessonType; label: string }[] = [
  { value: "video", label: "Vídeo" },
  { value: "text", label: "Texto" },
  { value: "pdf", label: "PDF" },
  { value: "audio", label: "Áudio" },
  { value: "download", label: "Download" },
  { value: "quiz", label: "Quiz" },
  { value: "exercise", label: "Exercício" },
];

const COMPLETION_OPTIONS = [
  { value: "watch_100", label: "Assistir 100%" },
  { value: "watch_80", label: "Assistir 80%" },
  { value: "complete_quiz", label: "Completar quiz" },
  { value: "manual", label: "Marcar manualmente" },
];

export interface LessonFormValue {
  id?: string;
  title: string;
  type: LessonType;
  description: string;
  videoUrl: string;
  videoPublicId: string;
  pdfUrl: string;
  duration: string;
  isFree: boolean;
  isPreview: boolean;
  completionCriteria: string;
  materials?: { id: string; title: string }[];
}

const EMPTY: LessonFormValue = {
  title: "", type: "video", description: "", videoUrl: "", videoPublicId: "", pdfUrl: "",
  duration: "", isFree: false, isPreview: false, completionCriteria: "watch_100", materials: [],
};

interface LessonFormDialogProps {
  open: boolean;
  onClose: () => void;
  moduleId: string;
  initial?: LessonFormValue | null;
}

export function LessonFormDialog({ open, onClose, moduleId, initial }: LessonFormDialogProps) {
  const { success, error } = useToast();
  const [form, setForm] = useState<LessonFormValue>(initial ?? EMPTY);

  useEffect(() => {
    if (open) setForm(initial ?? EMPTY);
  }, [open, initial]);

  function handleSubmit() {
    if (!form.title) {
      error("Dê um título para a aula.");
      return;
    }
    const input = {
      title: form.title,
      type: form.type,
      description: form.description || null,
      isFree: form.isFree,
      isPreview: form.isPreview,
      completionCriteria: form.completionCriteria,
      videoUrl: form.videoUrl || null,
      pdfUrl: form.pdfUrl || null,
      duration: form.duration ? Number(form.duration) : null,
      materials: form.materials,
    };
    if (form.id) {
      updateLesson(form.id, input);
      success("Aula atualizada.");
    } else {
      createLesson(moduleId, input);
      success("Aula criada.");
    }
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title={form.id ? "Editar aula" : "Nova aula"} size="lg">
      <div className="space-y-4">
        <Input label="Título" placeholder="Ex: Introdução ao Direito Constitucional" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
        <Select label="Tipo" options={TYPE_OPTIONS} value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as LessonType }))} />
        <Textarea label="Descrição" placeholder="Do que se trata essa aula (opcional)" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />

        {(form.type === "video" || form.videoPublicId) && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Vídeo</label>
            <MediaUploader
              resourceType="video"
              value={form.videoPublicId}
              onUploaded={(r) => setForm((f) => ({ ...f, videoUrl: "demo", videoPublicId: r.name, duration: f.duration || String(600 + Math.round(Math.random() * 1800)) }))}
              onRemove={() => setForm((f) => ({ ...f, videoUrl: "", videoPublicId: "" }))}
            />
          </div>
        )}

        {(form.type === "pdf" || form.pdfUrl) && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">PDF da aula</label>
            <MediaUploader resourceType="raw" value={form.pdfUrl} onUploaded={(r) => setForm((f) => ({ ...f, pdfUrl: r.url }))} onRemove={() => setForm((f) => ({ ...f, pdfUrl: "" }))} />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Input label="Duração (segundos)" type="number" min="0" placeholder="preenchido ao enviar o vídeo" value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} />
          <Select label="Critério de conclusão" options={COMPLETION_OPTIONS} value={form.completionCriteria} onChange={(e) => setForm((f) => ({ ...f, completionCriteria: e.target.value }))} />
        </div>

        <p className="rounded-lg border border-dashed border-border bg-muted/20 p-4 text-center text-xs text-foreground-muted">
          Quer um quiz nesta aula? <strong className="text-foreground">Crie a aula primeiro</strong> e depois abra em Editar.
        </p>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit}>{form.id ? "Salvar" : "Criar aula"}</Button>
      </DialogFooter>
    </Dialog>
  );
}
