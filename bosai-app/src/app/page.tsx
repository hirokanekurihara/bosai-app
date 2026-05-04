"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

// 型：防災グッズ1件の情報
type Item = {
  id: string;
  name: string;
  quantity: number;
};

const itemsCollection = collection(db, "items");

// ユーザーごとにデータを取得
async function fetchItems(userId: string): Promise<Item[]> {
  const q = query(itemsCollection, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data() as any;
    return {
      id: doc.id,
      name: data.name ?? "",
      quantity: data.quantity ?? 0,
    };
  });
}

// グッズ追加（userIdを保存）
async function addItemToFirestore(name: string, quantity: number, userId: string) {
  await addDoc(itemsCollection, {
    name,
    quantity,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// 数量変更
async function updateItemQuantityInFirestore(id: string, quantity: number) {
  const ref = doc(itemsCollection, id);
  await updateDoc(ref, {
    quantity,
    updatedAt: serverTimestamp(),
  });
}

// 削除
async function deleteItemFromFirestore(id: string) {
  const ref = doc(itemsCollection, id);
  await deleteDoc(ref);
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [items, setItems] = useState<Item[]>([]);
  const [newName, setNewName] = useState("");
  const [newQuantity, setNewQuantity] = useState(1);
  const [saving, setSaving] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        setItemsLoading(true);
        const data = await fetchItems(currentUser.uid);
        setItems(data);
        setItemsLoading(false);
      } else {
        setItems([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !user) return;
    try {
      setSaving(true);
      await addItemToFirestore(newName.trim(), newQuantity, user.uid);
      setNewName("");
      setNewQuantity(1);
      const data = await fetchItems(user.uid);
      setItems(data);
    } finally {
      setSaving(false);
    }
  };

  // 数量変更ボタン
  const handleQuantityChange = async (item: Item, delta: number) => {
    if (!user) return;
    const next = Math.max(1, item.quantity + delta);
    await updateItemQuantityInFirestore(item.id, next);
    const data = await fetchItems(user.uid);
    setItems(data);
  };

  // 削除ボタン
  const handleDelete = async (item: Item) => {
    if (!user) return;
    if (!window.confirm(`「${item.name}」を削除しますか？`)) return;
    await deleteItemFromFirestore(item.id);
    const data = await fetchItems(user.uid);
    setItems(data);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-gray-600 text-lg">読み込み中...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full">
          <div className="text-5xl mb-4">🛡️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            防災グッズ管理アプリ
          </h1>
          <p className="text-gray-600 mb-8">
            いざという時のために、備蓄品をしっかり管理しましょう。
          </p>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            ログイン / 新規登録へ進む
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🛡️</span>
            <h1 className="text-xl font-bold text-gray-800">防災グッズ管理</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 mt-8 space-y-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            グッズを登録する
          </h3>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row md:items-end gap-4"
          >
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                グッズ名
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="例）ペットボトル水（2L）"
                className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-full md:w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                数量
              </label>
              <input
                type="number"
                min={1}
                value={newQuantity}
                onChange={(e) =>
                  setNewQuantity(Number(e.target.value) || 1)
                }
                className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={saving}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold px-6 py-2.5 rounded-lg shadow-md transition-colors"
              >
                {saving ? "登録中..." : "＋ 登録する"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            登録済みの防災グッズ
          </h3>
          {itemsLoading ? (
            <p className="text-gray-600">読み込み中...</p>
          ) : items.length === 0 ? (
            <p className="text-gray-500">
              まだ登録されているグッズはありません。最初の1件を登録してみましょう。
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="py-3 flex items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <button
                      type="button"
                      onClick={async () => {
                        await handleQuantityChange(item, -1);
                      }}
                      className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="w-10 text-center">{item.quantity} 個</span>
                    <button
                      type="button"
                      onClick={async () => {
                        await handleQuantityChange(item, +1);
                      }}
                      className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-100"
                    >
                      ＋
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="text-xs text-red-600 hover:text-red-800 font-medium"
                  >
                    削除
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}