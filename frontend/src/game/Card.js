export class Card {
  /**
   * JSONデータから新しいカードを作る
   * @param {Object} cardData - jsonから読み込んだカードのデータ
   */
  constructor(cardData) {
    this.id = cardData.id;                 // 'strike' など
    this.name = cardData.name;             // 'ストライク'
    this.type = cardData.type;             // 'attack' や 'skill'
    this.cost = cardData.cost;             // 消費マナ
    this.description = cardData.description; // 説明文
    
    // アタックカードならダメージ量を持つ
    if (this.type === 'attack') {
      this.damage = cardData.damage;
    }
    
    // スキルカードならシールド量を持つ (今はガード効果を想定)
    if (this.type === 'skill') {
      this.block = cardData.block;
    }
  }

  /**
   * カードを使った時の効果を実行する
   * @param {Player} player - 使うプレイヤー
   * @param {Enemy} target - ターゲットの敵（スキルの場合は使わない場合も）
   */
  play(player, target) {
    console.log(`${player.name || 'プレイヤー'}は「${this.name}」を使った！`);

    // --- 効果の処理 ---
    if (this.type === 'attack') {
      // 敵にダメージを与える
      console.log(`敵に ${this.damage} ダメージ！`);
      if (target) {
        target.takeDamage(this.damage);
      }
    } else if (this.type === 'skill') {
      // プレイヤーがシールドを得る
      if (this.block) {
        console.log(`シールドを ${this.block} 得た！`);
        player.addBlock(this.block);
      }
    }
  }
}
