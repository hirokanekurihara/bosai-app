import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { Item } from "@/types/item";

export const addItem = async (name: string, quantity: number) => {
  await addDoc(collection(db, "items"), {
    name,
    quantity,
    createdAt: serverTimestamp(),
  });
};

export const getItems = async (): Promise<Item[]> => {
  const snapshot = await getDocs(collection(db, "items"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
    quantity: doc.data().quantity,
  }));
};