export class Enemy {
  /**
   * JSONデータから敵を作る
   * @param {Object} enemyData - JSONからの敵データ
   */
  constructor(enemyData) {
    this.id = enemyData.id;                // 'slime' など
    this.name = enemyData.name;            // 'スライム' など
    this.maxHp = enemyData.hp;             // 最大HP
    this.hp = this.maxHp;                  // 現在のHP
    this.baseAttack = enemyData.attack;    // 基本攻撃力
    this.description = enemyData.description; // 説明
    
    // 敵もシールドを持つ（後々必要になるため）
    this.block = 0;
  }

  // =====================
  //   ダメージ関連
  // =====================

  /**
   * 敵がダメージを受ける
   * @param {number} amount
   */
  takeDamage(amount) {
    console.log(`${this.name}は ${amount} ダメージ受けた！`);
    
    // もし敵もブロック（シールド）を持っていた場合の処理
    const damageAfterBlock = Math.max(0, amount - this.block);
    this.block = Math.max(0, this.block - amount);
    
    // HPが0以下にならないようにする
    this.hp = Math.max(0, this.hp - damageAfterBlock);
    
    console.log(`${this.name}の残りHP: ${this.hp}/${this.maxHp}`);
  }

  // =====================
  //   行動関連
  // =====================

  /**
   * 敵のターン開始時の処理
   * 今はシンプルに毎ターン「基本攻撃力で攻撃する」だけにする
   * @param {Player} targetPlayer - 攻撃対象のプレイヤー
   */
  takeTurn(targetPlayer) {
    if (this.isDead()) return;

    console.log(`-- ${this.name}のターン --`);
    
    // シールドを毎ターンリセット（一応）
    this.block = 0;
    
    // シンプルな攻撃
    console.log(`${this.name}の攻撃！ ${this.baseAttack} ダメージ`);
    targetPlayer.takeDamage(this.baseAttack);
    console.log(`プレイヤーの残りHP: ${targetPlayer.hp}/${targetPlayer.maxHp} (シールド: ${targetPlayer.block})`);
  }

  // =====================
  //   状態確認
  // =====================

  /**
   * 敵が死んだかどうか
   * @returns {boolean}
   */
  isDead() {
    return this.hp <= 0;
  }
}
