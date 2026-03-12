export class Battle {
  /**
   * 戦闘を初期化する
   * @param {Player} player - 戦うプレイヤー
   * @param {Enemy} enemy - 戦う敵
   */
  constructor(player, enemy) {
    this.player = player;
    this.enemy = enemy;
    this.turn = 1;         // 現在のターン数
    this.isOver = false;   // 戦闘が終了したかフラグ
  }

  // =====================
  //   戦闘の流れの管理
  // =====================

  /**
   * 戦闘を開始する（最初のターンの準備）
   */
  start() {
    console.log(`⚔️ 戦闘開始！ ${this.enemy.name} が現れた！`);
    // プレイヤーの最初のターンを開始する
    this.startPlayerTurn();
  }

  /**
   * プレイヤーのターンを開始する
   */
  startPlayerTurn() {
    if (this.checkGameOver()) return; // すでにどちらかが死んでいたら終了

    console.log(`\n--- ターン ${this.turn}：プレイヤーのターン ---`);
    console.log(`HP: ${this.player.hp}/${this.player.maxHp}`);
    
    // Playerクラスで作った「ターン開始処理（マナ回復、カードドロー）」を呼ぶ
    this.player.startTurn();
    
    console.log(`マナ: ${this.player.mana}/${this.player.maxMana}`);
    console.log(`手札 (${this.player.hand.length}枚): `);
    // 引いた手札の名前をコンソールに表示する
    this.player.hand.forEach((card, index) => {
      console.log(`  [${index}]: ${card.name} (コスト: ${card.cost}) - ${card.description}`);
    });
  }

  /**
   * プレイヤーがカードを使う操作をする
   * @param {number} handIndex - 手札の何番目を使うか
   */
  playCard(handIndex) {
    if (this.isOver) {
      console.log("この戦闘はすでに終わっています。");
      return;
    }

    const card = this.player.hand[handIndex];
    if (!card) {
      console.log("その番号のカードはありません！");
      return;
    }

    // Playerクラスの関数を使って、マナ消費して手札からカードを捨てる
    const playedCard = this.player.playCard(handIndex);

    // ちゃんとマナがあって使える場合
    if (playedCard) {
      // Cardクラスの関数を使って、効果を発動する（敵にダメージを与えたりなど）
      playedCard.play(this.player, this.enemy);

      // カードを使ったことで敵が死んだかチェック
      this.checkGameOver();
      
      console.log(`  残りマナ: ${this.player.mana}`);
    }
  }

  /**
   * プレイヤーがターンを終了する（＝敵のターンが始まる）
   */
  endPlayerTurn() {
    if (this.checkGameOver()) return; // 敵がすでに死んでいたら敵のターンは来ない

    console.log("【プレイヤーはターンを終了した】");
    // Playerクラスに書いた「手札を全て捨てる処理」
    this.player.endTurn();

    // 次は敵のターン！
    this.startEnemyTurn();
  }

  /**
   * 敵のターンを開始する
   */
  startEnemyTurn() {
    if (this.checkGameOver()) return; // すでに終了していたら何もしない

    // Enemyクラスの行動プログラムを呼ぶ
    this.enemy.takeTurn(this.player);

    // 敵の攻撃でプレイヤーが死んだかチェック
    if (!this.checkGameOver()) {
      // 死んでいなかったら、次のターンへ（ターン数を増やしてプレイヤーのターン開始）
      this.turn++;
      this.startPlayerTurn();
    }
  }

  // =====================
  //   勝敗判定
  // =====================

  /**
   * どちらかのHPが0になっていないかチェックする
   * @returns {boolean} - 戦闘が終了したなら true
   */
  checkGameOver() {
    if (this.isOver) return true;

    if (this.enemy.isDead()) {
      console.log(`\n🎉 勝利！ ${this.enemy.name} を倒した！`);
      this.isOver = true;
      return true;
    }

    if (this.player.isDead()) {
      console.log(`\n☠️ 敗北... プレイヤーは倒れた...`);
      this.isOver = true;
      return true;
    }

    return false;
  }
}
