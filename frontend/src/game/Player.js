export class Player {
  /**
   * プレイヤーを初期化する
   * @param {Array} initialDeck - 最初に持つカードの配列
   */
  constructor(initialDeck = []) {
    // --- ステータス ---
    this.maxHp = 80;          // 最大HP
    this.hp = this.maxHp;     // 現在HP (最初は最大値)
    this.maxMana = 3;         // 1ターンに使えるマナの最大値
    this.mana = 0;            // 現在のマナ (ターン開始時にリセット)
    this.block = 0;           // 現在のシールド (ターン終了時にリセット)

    // --- デッキ管理 ---
    // デッキのコピーを作る ([...配列] はコピーを作る書き方)
    this.deck = [...initialDeck];    // 山札 (引くカードの束)
    this.hand = [];                   // 手札 (今使えるカード)
    this.discardPile = [];            // 捨て札 (使ったカード)
  }

  // =====================
  //   ターン管理
  // =====================

  /**
   * ターン開始時の処理
   * マナを回復して、カードを5枚引く
   */
  startTurn() {
    this.mana = this.maxMana;  // マナを最大値に回復
    this.block = 0;             // シールドをリセット
    this.drawCards(5);          // カードを5枚ドロー
  }

  /**
   * ターン終了時の処理
   * 手札を全部捨て札に移す
   */
  endTurn() {
    // 手札を全部捨て札に移す
    // pushとspreadで「手札の全カードを捨て札に追加」
    this.discardPile.push(...this.hand);
    this.hand = [];  // 手札を空にする
  }

  // =====================
  //   デッキ操作
  // =====================

  /**
   * 山札からカードをn枚引く
   * 山札が足りなくなったら捨て札をシャッフルして山札に戻す
   * @param {number} count - 引く枚数
   */
  drawCards(count) {
    for (let i = 0; i < count; i++) {
      // 山札が空になったら捨て札を山札に戻す
      if (this.deck.length === 0) {
        this.reshuffleDeck();
      }

      // それでも山札が空なら引けない (捨て札もなかった場合)
      if (this.deck.length === 0) break;

      // 山札の一番上 (配列の末尾) からカードを1枚取って手札に追加
      const card = this.deck.pop();
      this.hand.push(card);
    }
  }

  /**
   * 捨て札をシャッフルして山札に戻す
   * (山札が空になった時に呼ばれる)
   */
  reshuffleDeck() {
    this.deck = this.discardPile;  // 捨て札を山札に
    this.discardPile = [];          // 捨て札を空に

    // Fisher-Yatesアルゴリズムでシャッフル
    // (配列をランダムな順番に並び替える定番の方法)
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  /**
   * 手札のカードを使う (手札から捨て札に移す)
   * @param {number} handIndex - 手札の何番目のカードか
   * @returns {Object|null} - 使ったカード (マナ不足ならnull)
   */
  playCard(handIndex) {
    const card = this.hand[handIndex];

    // マナが足りない場合は使えない
    if (this.mana < card.cost) {
      console.log('マナが足りません！');
      return null;
    }

    this.mana -= card.cost;                       // マナを消費
    this.hand.splice(handIndex, 1);               // 手札からカードを取り除く
    this.discardPile.push(card);                  // 捨て札に追加
    return card;                                  // 使ったカードを返す
  }

  // =====================
  //   ダメージ・回復
  // =====================

  /**
   * ダメージを受ける
   * シールドで軽減し、残りが直接HPに入る
   * @param {number} amount - 受けるダメージ量
   */
  takeDamage(amount) {
    // まずシールドでダメージを軽減
    const damageAfterBlock = Math.max(0, amount - this.block);
    this.block = Math.max(0, this.block - amount);  // シールドも減少
    this.hp = Math.max(0, this.hp - damageAfterBlock);  // HPが0未満にならないよう
  }

  /**
   * シールドを得る
   * @param {number} amount - 得るシールド量
   */
  addBlock(amount) {
    this.block += amount;
  }

  /**
   * HPを回復する
   * @param {number} amount - 回復量
   */
  heal(amount) {
    // 最大HPを超えないように回復
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }

  // =====================
  //   状態確認
  // =====================

  /**
   * プレイヤーが死んでいるか確認
   * @returns {boolean}
   */
  isDead() {
    return this.hp <= 0;
  }
}
