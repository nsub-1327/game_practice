import './style.css'
import { Player } from './game/Player.js'
import { Card } from './game/Card.js'
import { Enemy } from './game/Enemy.js'
import { Battle } from './game/Battle.js'

// data/ のjsonもimport可能
import cardsData from './data/cards.json'
import enemiesData from './data/enemies.json'

// ===== コンソールで遊べるゲームの準備 =====

console.log("🎮 DungeonSpire Console Edition 🎮")
console.log("コンソール（F12）の `battle` オブジェクトを使って遊べます！")

// 1. JSONデータからデッキ用のカードを作る（例: ストライク3枚、ディフェンド2枚）
const strikeCard = new Card(cardsData.find(c => c.id === 'strike'))
const defendCard = new Card(cardsData.find(c => c.id === 'defend'))
// 配列にしてデッキを作る
const initialDeck = [
  new Card(strikeCard), new Card(strikeCard), new Card(strikeCard),
  new Card(defendCard), new Card(defendCard)
];

// 2. プレイヤーと敵を作る
const player = new Player(initialDeck)
const slime = new Enemy(enemiesData[0]) // JSONの最初の敵「スライム」

// 3. 戦闘を作る
const currentBattle = new Battle(player, slime)

// === グローバル変数（ブラウザの開発者ツールで直接いじれるように） ===
window.battle = currentBattle;

// UIに案内だけ出す
document.querySelector('#app').innerHTML = `
  <div style="text-align: center; margin-top: 50px;">
    <h1>⚔️ DungeonSpire ⚔️</h1>
    <p>=== 開発用コンソールエディション ===</p>
    <p>ブラウザの開発者ツール (F12) の「Console」タブを開いてください。</p>
    <hr>
    <h3>【遊び方】（コンソールに入力してEnter）</h3>
    <ul>
      <li><code>battle.start()</code> - 戦闘開始</li>
      <li><code>battle.playCard(0)</code> - 手札の0番目のカードを使う</li>
      <li><code>battle.endPlayerTurn()</code> - ターン終了（敵のターンへ）</li>
      <li><code style="color: blue;">saveGame()</code> - <b>現在状態のセーブ(API呼出)</b></li>
    </ul>
  </div>
`

// ===== APIとの通信 (セーブ機能) =====

/**
 * 現在のゲームの状態をまとめたJSONを作り、バックエンドサーバーに送って保存する
 */
const saveGame = async () => {
  // 保存したいデータを準備
  const saveData = {
    playerId: "player_one", // とりあえず固定の名前で保存
    timestamp: new Date().toISOString(),
    player: {
      hp: currentBattle.player.hp,
      maxHp: currentBattle.player.maxHp,
      mana: currentBattle.player.mana,
      maxMana: currentBattle.player.maxMana,
      block: currentBattle.player.block,
      deckCount: currentBattle.player.deck.length
    },
    enemy: {
      id: currentBattle.enemy.id,
      hp: currentBattle.enemy.hp,
      maxHp: currentBattle.enemy.maxHp
    },
    turn: currentBattle.turn
  };

  try {
    console.log("セーブ中...");
    
    // fetch() はブラウザに元々備わっている「外部と通信する魔法」
    // (引数1: 通信先URL, 引数2: 通信の設定情報)
    const response = await fetch('http://localhost:3000/api/game/save', {
      method: 'POST', // データ送信はPOST
      headers: {
        'Content-Type': 'application/json' // JSONとして送るよ！と宣言
      },
      body: JSON.stringify(saveData) // saveDataというオブジェクトを長い1行の文字列に変換
    });

    // サーバーから返ってきた返事を解析
    const result = await response.json();

    if (response.ok) {
      console.log("✅ セーブ成功！", result);
    } else {
      console.error("❌ セーブ失敗...", result);
    }
  } catch (error) {
    console.error("📛 通信エラー！(サーバーが立ち上がっていないかも？)", error);
  }
};

// コンソールから手動で呼び出せるようにする
window.saveGame = saveGame;

