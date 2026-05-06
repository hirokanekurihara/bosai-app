export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー部分 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🛡️ 防災グッズ管理アプリ
          </h1>
          <p className="text-xl text-gray-600">
            いざという時のために、備蓄品をしっかり管理しましょう
          </p>
        </div>

        {/* メインコンテンツ */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            開発状況
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Next.js 環境構築完了</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-700">Firebase 連携設定中...</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              <span className="text-gray-400">認証機能（未実装）</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              <span className="text-gray-400">データ管理機能（未実装）</span>
            </div>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md">
            Firebase 設定を開始
          </button>
        </div>
      </div>
    </main>
  );
}
