const express = require('express');
const cors = require('cors');

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

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
