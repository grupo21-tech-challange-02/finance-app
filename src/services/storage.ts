"use client";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { auth, storage } from "./firebase";

export type AttachmentInfo = {
  path: string;
  url: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
};

function requireUid(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Usuário não autenticado.");
  return uid;
}

function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split(".").pop() || "";
  const baseName = originalName.replace(/\.[^/.]+$/, "").substring(0, 50);
  return `${baseName}_${timestamp}_${randomStr}.${extension}`;
}

export async function uploadTransactionAttachment(
  transactionId: string,
  file: File
): Promise<AttachmentInfo> {
  const uid = requireUid();
  const fileName = generateFileName(file.name);
  const filePath = `users/${uid}/transactions/${transactionId}/${fileName}`;
  const storageRef = ref(storage, filePath);

  await uploadBytes(storageRef, file, {
    contentType: file.type,
  });

  const url = await getDownloadURL(storageRef);

  return {
    path: filePath,
    url,
    name: file.name,
    type: file.type,
    size: file.size,
    uploadedAt: new Date(),
  };
}

export async function deleteTransactionAttachment(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

export async function getAttachmentUrl(path: string): Promise<string> {
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
}
