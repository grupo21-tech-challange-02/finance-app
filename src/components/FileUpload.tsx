"use client";

import { useRef, useState } from "react";
import { FiUpload, FiX, FiFile, FiImage } from "react-icons/fi";
import { cn } from "@/lib/utils";

export type FileUploadData = {
  file: File;
  preview?: string;
};

type Props = {
  value?: FileUploadData | null;
  existingUrl?: string | null;
  existingName?: string | null;
  onChange: (data: FileUploadData | null) => void;
  onRemoveExisting?: () => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  error?: string;
  disabled?: boolean;
};

const nfBytes = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 2,
});

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${nfBytes.format(bytes / 1024)} KB`;
  return `${nfBytes.format(bytes / (1024 * 1024))} MB`;
}

function isImageFile(type: string): boolean {
  return type.startsWith("image/");
}

export default function FileUpload({
  value,
  existingUrl,
  existingName,
  onChange,
  onRemoveExisting,
  accept = "image/*,.pdf,.doc,.docx",
  maxSizeMB = 5,
  label = "Anexo",
  error,
  disabled = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  function handleFile(file: File) {
    setLocalError(null);

    if (file.size > maxSizeBytes) {
      setLocalError(`Arquivo muito grande. Máximo: ${maxSizeMB}MB`);
      return;
    }

    const isImage = isImageFile(file.type);
    let preview: string | undefined;

    if (isImage) {
      preview = URL.createObjectURL(file);
    }

    onChange({ file, preview });
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  }

  function handleRemove() {
    if (value?.preview) {
      URL.revokeObjectURL(value.preview);
    }
    onChange(null);
    setLocalError(null);
  }

  function handleRemoveExisting() {
    onRemoveExisting?.();
  }

  const displayError = error || localError;
  const hasNewFile = !!value;
  const hasExisting = !!existingUrl && !hasNewFile;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>

      {!hasNewFile && !hasExisting && (
        <div
          className={cn(
            "relative rounded-lg border-2 border-dashed p-4 text-center transition-colors",
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-slate-300 hover:border-slate-400",
            disabled && "cursor-not-allowed opacity-50"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleInputChange}
            disabled={disabled}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <div className="flex flex-col items-center gap-2">
            <FiUpload className="h-8 w-8 text-slate-400" />
            <div className="text-sm text-slate-600">
              <span className="font-medium text-blue-600">Clique para enviar</span>{" "}
              ou arraste um arquivo
            </div>
            <p className="text-xs text-slate-500">
              Imagens, PDF ou documentos (máx. {maxSizeMB}MB)
            </p>
          </div>
        </div>
      )}

      {hasNewFile && value && (
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
          {value.preview ? (
            <img
              src={value.preview}
              alt="Preview"
              className="h-12 w-12 rounded object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded bg-slate-200">
              <FiFile className="h-6 w-6 text-slate-500" />
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-slate-700">
              {value.file.name}
            </p>
            <p className="text-xs text-slate-500">
              {formatFileSize(value.file.size)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
            aria-label="Remover arquivo"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
      )}

      {hasExisting && (
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
          {existingUrl && isImageFile(existingName || "") ? (
            <img
              src={existingUrl}
              alt="Anexo"
              className="h-12 w-12 rounded object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded bg-slate-200">
              {existingName?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <FiImage className="h-6 w-6 text-slate-500" />
              ) : (
                <FiFile className="h-6 w-6 text-slate-500" />
              )}
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-slate-700">
              {existingName || "Anexo"}
            </p>
            <a
              href={existingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
              Visualizar
            </a>
          </div>
          {onRemoveExisting && (
            <button
              type="button"
              onClick={handleRemoveExisting}
              disabled={disabled}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
              aria-label="Remover anexo"
            >
              <FiX className="h-5 w-5" />
            </button>
          )}
        </div>
      )}

      {displayError && (
        <p className="text-sm text-red-600">{displayError}</p>
      )}
    </div>
  );
}
