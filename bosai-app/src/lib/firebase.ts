// Firebase SDK のインポート
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 環境変数から設定情報を読み込み
const firebaseConfig = {
  apiKey: "AIzaSyAWmYRuseJHJclGYrDgVVdwErnhtFe3Qno",
  authDomain: "bosai-app-3e951.firebaseapp.com",
  projectId: "bosai-app-3e951",
  storageBucket: "bosai-app-3e951.firebasestorage.app",
  messagingSenderId: "62509682919",
  appId: "1:62509682919:web:bc031d00cdb28b1999d242"
};

// Firebase アプリの初期化（重複初期化を防ぐ）
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// 認証とデータベースのみエクスポート
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
