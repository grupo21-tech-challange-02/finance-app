"use client";

export type AttachmentInfo = {
  data: string; // base64 data URL
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
};

const MAX_FILE_SIZE = 700 * 1024; // 700KB limit for Firestore

export function validateFileSize(file: File): boolean {
  return file.size <= MAX_FILE_SIZE;
}

export function getMaxFileSizeKB(): number {
  return MAX_FILE_SIZE / 1024;
}

export async function fileToAttachment(file: File): Promise<AttachmentInfo> {
  if (!validateFileSize(file)) {
    throw new Error(`Arquivo muito grande. Máximo: ${getMaxFileSizeKB()}KB`);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const data = reader.result as string;
      resolve({
        data,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date(),
      });
    };

    reader.onerror = () => {
      reject(new Error("Erro ao ler arquivo"));
    };

    reader.readAsDataURL(file);
  });
}
