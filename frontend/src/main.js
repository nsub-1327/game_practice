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
    </ul>
  </div>
`
