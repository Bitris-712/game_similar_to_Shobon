class LearningAI {
    constructor() {
        this.qTable = {};
        this.actions = ['left', 'right', 'jump', 'stay', 'dash_left', 'dash_right'];
        this.learningRate = 0.25; 
        this.discountFactor = 0.85; 
        this.epsilon = 0.15; 
        
        this.lastState = null;
        this.lastAction = null;

        // 🧠 クラウドから同期を開始するお
        this.loadBrain();
    }

    // 💡 記憶の読み込みルーチン（自動リトライ搭載版）
    loadBrain() {
        // もしFirebaseの初期化がまだなら、1秒（1000ms）待ってからもう一度自分を呼び出すお！
        if (typeof database === 'undefined') {
            console.log("🤖 AI: Firebaseの初期化を待っているお... 1秒後に再接続を試みるお。");
            setTimeout(() => this.loadBrain(), 1000); 
            return;
        }
        
        database.ref('ai_brain').once('value').then((snapshot) => {
            if (snapshot.exists()) {
                this.qTable = snapshot.val();
                console.log("🤖 AI: クラウドから同期大成功だお！！ パターン数:", Object.keys(this.qTable).length);
            } else {
                console.log("🤖 AI: クラウドにまだ脳みそがないから、新規学習（赤ちゃん状態）でスタートするお。");
            }
        }).catch(e => {
            console.log("🤖 AI: クラウドからのロードに失敗したお。ローカルで新規学習します:", e);
        });
    }

    // 💡 クラウド（Firebase）へ自動バックアップ
    saveBrainToCloud() {
        if (typeof database === 'undefined') return;
        
        database.ref('ai_brain').set(this.qTable)
            .then(() => console.log("🤖 AI: 最新の脳みそをクラウドに自動更新（バックアップ）したお！"))
            .catch(e => console.log("🤖 AI: クラウドへの保存に失敗したお:", e));
    }

    // 周囲のブロックセンサー
    checkObstacles(enemy, blocks) {
        let sensor = { top: false, bottom: false, left: false, right: false };
        let range = 8;

        blocks.forEach(b => {
            if ((b.type === 'hidden' || b.type === 'hiddenSpike' || b.type === 'disappearFloor') && !b.triggered) return;
            
            if (enemy.y < b.y + b.height && enemy.y + enemy.height > b.y) {
                if (enemy.x + enemy.width <= b.x && enemy.x + enemy.width + range >= b.x) sensor.right = true;
                if (enemy.x >= b.x + b.width && enemy.x - range <= b.x + b.width) sensor.left = true;
            }
            if (enemy.x < b.x + b.width && enemy.x + enemy.width > b.x) {
                if (enemy.y >= b.y + b.height && enemy.y - range <= b.y + b.height) sensor.top = true;
                if (enemy.y + enemy.height <= b.y && enemy.y + enemy.height + range >= b.y) sensor.bottom = true;
            }
        });
        return sensor;
    }

    // 状態の取得
    getState(enemy, player, blocks) {
        let relX = player.x > enemy.x ? 'R' : 'L';
        let relY = player.y < enemy.y - 16 ? 'A' : (player.y > enemy.y + 32 ? 'B' : 'L');
        let pAir = !player.grounded ? 'air' : 'gnd';
        
        let sensor = this.checkObstacles(enemy, blocks);
        let blockFlag = (sensor.top ? 'T' : '') + (sensor.left ? 'L' : '') + (sensor.right ? 'R' : '');
        if (blockFlag === '') blockFlag = 'N';

        return `${relX}_${relY}_${pAir}_${blockFlag}`;
    }

    chooseAction(state) {
        if (!this.qTable[state]) {
            this.qTable[state] = {};
            this.actions.forEach(a => this.qTable[state][a] = 0);
        }

        if (Math.random() < this.epsilon) {
            return this.actions[Math.floor(Math.random() * this.actions.length)];
        } else {
            let rewards = this.qTable[state];
            return Object.keys(rewards).reduce((a, b) => rewards[a] > rewards[b] ? a : b);
        }
    }

    learn(enemy, player, blocks) {
        let currentState = this.getState(enemy, player, blocks);
        
        if (this.lastState && this.lastAction) {
            let reward = 0;
            let currentDist = Math.abs(player.x - enemy.x);
            
            if (enemy.lastDist && currentDist < enemy.lastDist) reward += 2;
            if (enemy.lastDist && currentDist > enemy.lastDist) reward -= 1.5;
            
            let sensor = this.checkObstacles(enemy, blocks);

            // ブロックの下でスタックされているときの脱出誘導
            if (sensor.top && !enemy.grounded) {
                if (this.lastAction === 'jump' || this.lastAction === 'stay') {
                    reward -= 20;
                }
                if (this.lastAction === 'left' || this.lastAction === 'right' || this.lastAction === 'dash_left' || this.lastAction === 'dash_right') {
                    reward += 30;
                }
            }

            // 横壁スタック誘導
            let isStuck = enemy.x === enemy.lastX && (this.lastAction === 'left' || this.lastAction === 'right' || this.lastAction === 'dash_left' || this.lastAction === 'dash_right');
            if (isStuck && enemy.alive) {
                if (!sensor.top) {
                    reward -= 15; 
                    if (player.y < enemy.y && this.lastAction === 'jump') reward += 40;
                } else {
                    reward -= 10;
                }
            }

            // 天井自爆ペナルティ
            if (player.y < enemy.y && sensor.top && this.lastAction === 'jump') {
                reward -= 15;
            }

            if (currentDist < 32 && Math.abs(player.y - enemy.y) < 32) reward += 100;

            let oldQ = this.qTable[this.lastState][this.lastAction];
            let maxNextQ = Math.max(...Object.values(this.qTable[currentState] || { 'left': 0, 'right': 0, 'jump': 0, 'stay': 0, 'dash_left': 0, 'dash_right': 0 }));
            
            this.qTable[this.lastState][this.lastAction] = oldQ + this.learningRate * (reward + this.discountFactor * maxNextQ - oldQ);
            
            // 1%の確率で自動保存（※ロード成功時のみ保存が走る安全設計）
            if (typeof database !== 'undefined' && Math.random() < 0.01) { 
                this.saveBrainToCloud();
            }
        }

        let action = this.chooseAction(currentState);
        
        enemy.lastDist = Math.abs(player.x - enemy.x);
        enemy.lastX = enemy.x;
        
        this.lastState = currentState;
        this.lastAction = action;

        return action;
    }

    exportBrain() {
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.qTable, null, 2));
        let downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "ai_brain.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        console.log("🤖 AI: 脳みそファイルをダウンロードしたお！");
    }
}

const enemyAI = new LearningAI();

const AI_TUNING = {
    normalSpeedMultiplier: 1.0,  // 通常時の歩くスピード
    dashSpeedMultiplier: 1.6,    // ダッシュの時のスピード
    airAssistMultiplier: 0.4,    // 空中でプレイヤーを自動追従する強さ
    ceilingPushPower: 10          // 天井ハメされた時に横に脱出する瞬発力
};

// --- 地形衝突付き・AIアップデート関数（バランス調整版） ---
function updateLearningAI(enemy, player, gravity, blocks) {
    if (!enemy.alive) return;

    let action = enemyAI.learn(enemy, player, blocks);
    let sensor = enemyAI.checkObstacles(enemy, blocks);

    // 空中アシスト（頭上のブロックにぶつかっていないときだけ追従）
    if (!enemy.grounded && !sensor.top) {
        if (player.x > enemy.x) {
            enemy.x += (enemy.speed * AI_TUNING.airAssistMultiplier);
        } else {
            enemy.x -= (enemy.speed * AI_TUNING.airAssistMultiplier);
        }
    }

    // AIの行動反映（調整用の倍率をかけるようにしたお！）
    if (action === 'left') {
        enemy.x -= (enemy.speed * AI_TUNING.normalSpeedMultiplier);
    } else if (action === 'right') {
        enemy.x += (enemy.speed * AI_TUNING.normalSpeedMultiplier);
    } else if (action === 'dash_left') {
        enemy.x -= (enemy.speed * AI_TUNING.dashSpeedMultiplier); 
    } else if (action === 'dash_right') {
        enemy.x += (enemy.speed * AI_TUNING.dashSpeedMultiplier);
    }

    if (action === 'jump' && enemy.grounded) {
        enemy.vy = -12; 
        enemy.grounded = false;
    }

    enemy.vy += gravity;
    enemy.y += enemy.vy;
    
    enemy.grounded = false;

    // ブロック判定
    blocks.forEach(b => {
        if ((b.type === 'hidden' || b.type === 'hiddenSpike' || b.type === 'disappearFloor') && !b.triggered) return;

        if (enemy.x < b.x + b.width && enemy.x + enemy.width > b.x && enemy.y < b.y + b.height && enemy.y + enemy.height > b.y) {
            if (enemy.vy > 0 && enemy.y + enemy.height - enemy.vy <= b.y) {
                enemy.y = b.y - enemy.height;
                enemy.vy = 0;
                enemy.grounded = true;
            }
            // 天井にぶつかった時の処理
            else if (enemy.vy < 0 && enemy.y - enemy.vy >= b.y + b.height) {
                enemy.y = b.y + b.height;
                enemy.vy = 0;
                
                // 頭をぶつけている間は、スタック回避用の力を加えるお
                if (action === 'dash_right' || action === 'right') enemy.x += AI_TUNING.ceilingPushPower;
                if (action === 'dash_left' || action === 'left') enemy.x -= AI_TUNING.ceilingPushPower;
            }
            else if (action === 'right' || action === 'dash_right') {
                enemy.x = b.x - enemy.width;
            }
            else if (action === 'left' || action === 'dash_left') {
                enemy.x = b.x + b.width;
            }
        }
    });

    if (enemy.y > 450) {
        enemy.y = enemy.baseY;
        enemy.vy = 0;
        enemy.grounded = true;
    }
}