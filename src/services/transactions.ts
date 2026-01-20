"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  Timestamp,
  updateDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
  type QuerySnapshot,
} from "firebase/firestore";
import { auth, db } from "./firebase";

export type TransactionType = "deposito" | "saque" | "transferencia";
export type TransactionCategory =
  | "salario"
  | "moradia"
  | "alimentacao"
  | "saude"
  | "investimento"
  | "utilidades";

export type AttachmentData = {
  path: string;
  url: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
};

export type TransactionInput = {
  type: TransactionType;
  value: number;
  description: string;
  category: TransactionCategory;
  date?: Date;
  attachment?: AttachmentData | null;
};

export type Transaction = TransactionInput & {
  id: string;
  uid: string;
  date: Date;
  createdAt?: Date;
  attachment?: AttachmentData | null;
};

type AttachmentDoc = {
  path: string;
  url: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Timestamp;
};

type TransactionDoc = {
  uid: string;
  type: TransactionType;
  value: number;
  description: string;
  category: TransactionCategory;
  date: Timestamp;
  createdAt?: Timestamp;
  attachment?: AttachmentDoc | null;
};

function requireUid(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Usuário não autenticado.");
  return uid;
}

function colRef(uid: string) {
  return collection(db, "users", uid, "transactions");
}

function mapAttachment(att?: AttachmentDoc | null): AttachmentData | null {
  if (!att) return null;
  return {
    path: att.path,
    url: att.url,
    name: att.name,
    type: att.type,
    size: att.size,
    uploadedAt: att.uploadedAt.toDate(),
  };
}

function mapDocToTransaction(
  d: QueryDocumentSnapshot<DocumentData>
): Transaction {
  const data = d.data() as TransactionDoc;

  return {
    id: d.id,
    uid: data.uid,
    type: data.type,
    value: data.value,
    description: data.description,
    category: data.category,
    date: data.date.toDate(),
    createdAt: data.createdAt ? data.createdAt.toDate() : undefined,
    attachment: mapAttachment(data.attachment),
  };
}

export async function addTransaction(input: TransactionInput): Promise<string> {
  const uid = requireUid();

  const payload: TransactionDoc = {
    uid,
    type: input.type,
    value: input.value,
    description: input.description,
    category: input.category,
    date: Timestamp.fromDate(input.date ?? new Date()),
    createdAt: Timestamp.now(),
    attachment: input.attachment
      ? {
          path: input.attachment.path,
          url: input.attachment.url,
          name: input.attachment.name,
          type: input.attachment.type,
          size: input.attachment.size,
          uploadedAt: Timestamp.fromDate(input.attachment.uploadedAt),
        }
      : null,
  };

  const ref = await addDoc(colRef(uid), payload);
  return ref.id;
}

export async function updateTransaction(
  id: string,
  patch: Partial<Omit<TransactionInput, "date">> & { date?: Date }
): Promise<void> {
  const uid = requireUid();

  const updatePayload: Partial<TransactionDoc> = {
    ...(patch.type !== undefined ? { type: patch.type } : {}),
    ...(patch.value !== undefined ? { value: patch.value } : {}),
    ...(patch.description !== undefined
      ? { description: patch.description }
      : {}),
    ...(patch.category !== undefined ? { category: patch.category } : {}),
    ...(patch.date ? { date: Timestamp.fromDate(patch.date) } : {}),
    ...(patch.attachment !== undefined
      ? {
          attachment: patch.attachment
            ? {
                path: patch.attachment.path,
                url: patch.attachment.url,
                name: patch.attachment.name,
                type: patch.attachment.type,
                size: patch.attachment.size,
                uploadedAt: Timestamp.fromDate(patch.attachment.uploadedAt),
              }
            : null,
        }
      : {}),
  };

  await updateDoc(doc(db, "users", uid, "transactions", id), updatePayload);
}

export async function deleteTransaction(id: string): Promise<void> {
  const uid = requireUid();
  await deleteDoc(doc(db, "users", uid, "transactions", id));
}

export async function getTransaction(id: string): Promise<Transaction | null> {
  const uid = requireUid();
  const snap = await getDoc(doc(db, "users", uid, "transactions", id));
  if (!snap.exists()) return null;

  const data = snap.data() as TransactionDoc;

  return {
    id: snap.id,
    uid: data.uid,
    type: data.type,
    value: data.value,
    description: data.description,
    category: data.category,
    date: data.date.toDate(),
    createdAt: data.createdAt ? data.createdAt.toDate() : undefined,
    attachment: mapAttachment(data.attachment),
  };
}

function monthRange(year: number, month1to12: number) {
  const start = new Date(year, month1to12 - 1, 1);
  const end = new Date(year, month1to12, 1);
  return { start, end };
}

export async function listTransactionsByMonth(
  year: number,
  month1to12: number
): Promise<Transaction[]> {
  const uid = requireUid();
  const { start, end } = monthRange(year, month1to12);

  const q = query(
    colRef(uid),
    where("date", ">=", Timestamp.fromDate(start)),
    where("date", "<", Timestamp.fromDate(end)),
    orderBy("date", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => mapDocToTransaction(d));
}

export function onTransationsByMonth(
  year: number,
  month1to12: number,
  cb: (items: Transaction[]) => void
) {
  const uid = requireUid();
  const { start, end } = monthRange(year, month1to12);

  const q = query(
    colRef(uid),
    where("date", ">=", Timestamp.fromDate(start)),
    where("date", "<", Timestamp.fromDate(end)),
    orderBy("date", "desc")
  );

  return onSnapshot(q, (snap: QuerySnapshot<DocumentData>) => {
    const list = snap.docs.map((d) =>
      mapDocToTransaction(d as QueryDocumentSnapshot<DocumentData>)
    );
    cb(list);
  });
}

export async function listTransactionsByMonthPage(
  year: number,
  month1to12: number,
  pageSize = 20,
  cursor?: QueryDocumentSnapshot<DocumentData> | null
): Promise<{
  items: Transaction[];
  nextCursor: QueryDocumentSnapshot<DocumentData> | null;
}> {
  const uid = requireUid();
  const { start, end } = monthRange(year, month1to12);

  const base = query(
    colRef(uid),
    where("date", ">=", Timestamp.fromDate(start)),
    where("date", "<", Timestamp.fromDate(end)),
    orderBy("date", "desc")
  );

  const q = cursor
    ? query(base, startAfter(cursor), limit(pageSize))
    : query(base, limit(pageSize));

  const snap = await getDocs(q);

  const items = snap.docs.map((d) => mapDocToTransaction(d));
  const nextCursor =
    snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null;

  return { items, nextCursor };
}

export async function getMonthySummary(year: number, month1to12: number) {
  const items = await listTransactionsByMonth(year, month1to12);

  const income = items
    .filter((t) => t.type === "deposito")
    .reduce((s, t) => s + t.value, 0);

  const expenses = items
    .filter((t) => t.type !== "deposito")
    .reduce((s, t) => s + Math.abs(t.value), 0);

  const balance = items.reduce((s, t) => s + t.value, 0);

  return { income, expenses, balance, count: items.length };
}

export function onAllTransactions(cb: (items: Transaction[]) => void) {
  const uid = requireUid();
  const q = query(colRef(uid), orderBy("date", "desc"));

  return onSnapshot(q, (snap: QuerySnapshot<DocumentData>) => {
    const list = snap.docs.map((d) =>
      mapDocToTransaction(d as QueryDocumentSnapshot<DocumentData>)
    );
    cb(list);
  });
}

export type TxCursor = QueryDocumentSnapshot<DocumentData>;

function mapTxDoc(d: QueryDocumentSnapshot<DocumentData>): Transaction {
  const data = d.data() as TransactionDoc;

  return {
    id: d.id,
    uid: data.uid,
    type: data.type,
    value: data.value,
    description: data.description,
    category: data.category,
    date: data.date.toDate(),
    createdAt: data.createdAt ? data.createdAt.toDate() : undefined,
    attachment: mapAttachment(data.attachment),
  };
}

export async function listAllTransactionsPage(
  pageSize = 20,
  cursor?: TxCursor
): Promise<{ items: Transaction[]; nextCursor: TxCursor | null }> {
  const uid = requireUid();

  const base = query(colRef(uid), orderBy("date", "desc"), limit(pageSize));

  const q = cursor
    ? query(
        colRef(uid),
        orderBy("date", "desc"),
        startAfter(cursor),
        limit(pageSize)
      )
    : base;

  const snap = await getDocs(q);

  const items = snap.docs.map((d) => mapTxDoc(d as TxCursor));
  const nextCursor = snap.docs.length
    ? (snap.docs[snap.docs.length - 1] as TxCursor)
    : null;

  return { items, nextCursor };
}
