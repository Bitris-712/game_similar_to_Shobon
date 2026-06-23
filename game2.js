// --- ステージ 2 初期化関数 ---
function initStage() {
    gameActive = true;
    gameCleared = false;
    gamePaused = false;
    cameraX = 0;
    
    player.x = 80; player.y = 350; player.vx = 0; player.vy = 0; player.grounded = false;
    item.active = false;

    // 二面の暗い地下背景
    canvas.style.background = "#332222";

    // 二面はミサイルなし
    missile = null;

    // 二面の敵（ここにもジャンプAIモララーを配置）
    enemies = [
        { x: 400, y: 368, width: 32, height: 32, speed: 2.0, leftBound: 250, rightBound: 550, alive: true, type: 'normal' },
        { x: 1200, y: 368, width: 32, height: 32, speed: 1.5, leftBound: 1050, rightBound: 1350, alive: true, type: 'jumper', vy: 0, grounded: true, baseY: 368 }
    ];

    // 二面のブロックマップ
    blocks = [
        // スタート床
        { x: 0, y: 400, width: 600, height: 50, type: 'floor' },
        
        // 【罠】通り抜けようとすると脳天に刺さる隠しトゲ
        { x: 250, y: 200, width: 150, height: 32, type: 'brick' },
        { x: 282, y: 232, width: 32, height: 32, type: 'hiddenSpike', triggered: false },
        
        // 連続する足場（落ちたら終わりの奈落）
        { x: 700, y: 350, width: 64, height: 100, type: 'floor' },
        { x: 700, y: 230, width: 32, height: 32, type: 'hidden', triggered: false }, // 飛び越えを邪魔する隠しブロック
        
        { x: 900, y: 300, width: 64, height: 150, type: 'floor' },
        { x: 1050, y: 400, width: 750, height: 50, type: 'floor' }, 
        
        // ハテナトラップ（毒キノコ）
        { x: 1600, y: 280, width: 32, height: 32, type: 'brick', triggered: false },
        { x: 1632, y: 280, width: 32, height: 32, type: 'question_poison', triggered: false },

        // トゲトゲ地帯
        { x: 1800, y: 400, width: 500, height: 50, type: 'floor' },
        { x: 1900, y: 368, width: 32, height: 32, type: 'spike' },
        { x: 1932, y: 368, width: 32, height: 32, type: 'spike' },
        { x: 1964, y: 368, width: 32, height: 32, type: 'spike' },

        // ラストスパートと本物のゴール
        { x: 2450, y: 400, width: 600, height: 50, type: 'floor' },
        { x: 2600, y: 368, width: 32, height: 32, type: 'spike' },
        { x: 2800, y: 150, width: 8, height: 250, type: 'realGoal' } 
    ];

    // タイマー用
    if (startTime === 0) {
        startTime = Date.now();
    } else {
        startTime = Date.now() - elapsedTime;
    }
}