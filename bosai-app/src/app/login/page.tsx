"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("パスワードは6文字以上で入力してください");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push("/");
    } catch (err: any) {
      console.error("認証エラー:", err);
      
      if (err.code === "auth/email-already-in-use") {
        setError("このメールアドレスは既に登録されています");
      } else if (err.code === "auth/invalid-email") {
        setError("メールアドレスの形式が正しくありません");
      } else if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("メールアドレスまたはパスワードが間違っています");
      } else if (err.code === "auth/invalid-credential") {
        setError("メールアドレスまたはパスワードが間違っています");
      } else if (err.code === "auth/weak-password") {
        setError("パスワードが弱すぎます。より強力なパスワードを設定してください");
      } else {
        setError(`認証エラー: ${err.code || err.message || "不明なエラー"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🛡️</div>
          <h1 className="text-2xl font-bold text-gray-800">防災グッズ管理</h1>
          <p className="text-gray-500 mt-1">
            {isLogin ? "アカウントにログイン" : "新規アカウント作成"}
          </p>
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-6 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* ログイン/登録フォーム */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* メールアドレス入力 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* パスワード入力 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              パスワード（6文字以上）
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
          >
            {loading 
              ? (isLogin ? "ログイン中..." : "登録中...") 
              : (isLogin ? "ログイン" : "アカウントを作成")
            }
          </button>
        </form>

        {/* ログイン/新規登録の切り替え */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-blue-600 hover:underline text-sm font-medium"
            disabled={loading}
          >
            {isLogin
              ? "アカウントをお持ちでない方は新規登録"
              : "既にアカウントをお持ちの方はログイン"}
          </button>
        </div>
        
        {/* トップページに戻るリンク */}
        <div className="mt-4 text-center">
          <a
            href="/"
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← トップページに戻る
          </a>
        </div>
      </div>
    </div>
  );
}
