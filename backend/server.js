const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// CORSを有効化 (フロントエンドからのアクセスを許可)
app.use(cors());
// JSONのリクエストボディを扱えるようにする
app.use(express.json());

// サーバーが生きているか確認するAPI
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'DungeonSpire API is running!' });
});

// セーブデータを保存するディレクトリのパス
const SAVES_DIR = path.join(__dirname, 'data', 'saves');

// セーブAPI (POST)
app.post('/api/game/save', (req, res) => {
  const saveData = req.body; // フロントエンドから送られてきたデータ

  // playerIdが送られていない場合はエラー
  if (!saveData.playerId) {
    return res.status(400).json({ error: 'playerIdが必要です' });
  }

  // 例: "player1.json" というファイル名にする
  const filePath = path.join(SAVES_DIR, `${saveData.playerId}.json`);

  // ファイルに書き込む (エラーが起きたら500エラーを返す)
  fs.writeFile(filePath, JSON.stringify(saveData, null, 2), (err) => {
    if (err) {
      console.error('セーブ書き込みエラー:', err);
      return res.status(500).json({ error: 'セーブに失敗しました' });
    }
    console.log(`✅ セーブ完了: ${saveData.playerId}`);
    res.json({ success: true, message: 'Game saved successfully!' });
  });
});

// ロードAPI (GET)
app.get('/api/game/load/:playerId', (req, res) => {
  const playerId = req.params.playerId;
  const filePath = path.join(SAVES_DIR, `${playerId}.json`);

  // ファイルが存在するか確認
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'セーブデータが見つかりません' });
  }

  // ファイルを読み込んで返す
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('セーブ読み込みエラー:', err);
      return res.status(500).json({ error: 'ロードに失敗しました' });
    }
    console.log(`📥 ロード完了: ${playerId}`);
    res.json(JSON.parse(data));
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
