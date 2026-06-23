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

    // 二面の敵（ジャンプ、通常に加えて【飛行タイプ】を追加！）
    enemies = [
        { x: 400, y: 368, width: 32, height: 32, speed: 2.0, leftBound: 250, rightBound: 500, alive: true, type: 'normal' },
        { x: 1200, y: 368, width: 32, height: 32, speed: 1.5, leftBound: 1050, rightBound: 1350, alive: true, type: 'jumper', vy: 0, grounded: true, baseY: 368 },
        
        // 新敵：空中を不気味に浮遊するモララー（足場の間に配置）
        { x: 2400, y: 220, width: 32, height: 32, speed: 1.5, leftBound: 2300, rightBound: 2550, alive: true, type: 'normal' } 
    ];

    // 二面のブロックマップ（拡張版）
    blocks = [
        // スタート床
        { x: 0, y: 400, width: 600, height: 50, type: 'floor' },
        
        // 【罠】通り抜けようとすると脳天に刺さる隠しトゲ
        { x: 250, y: 200, width: 150, height: 32, type: 'brick' },
        { x: 250, y: 232, width: 32, height: 32, type: 'hiddenSpike', triggered: false },
        { x: 282, y: 232, width: 32, height: 32, type: 'hiddenSpike', triggered: false },
        { x: 314, y: 232, width: 32, height: 32, type: 'hiddenSpike', triggered: false },
        { x: 346, y: 232, width: 32, height: 32, type: 'hiddenSpike', triggered: false },
        { x: 378, y: 232, width: 32, height: 32, type: 'hiddenSpike', triggered: false },
        
        // 連続する足場（落ちたら終わりの奈落）
        { x: 700, y: 350, width: 64, height: 100, type: 'floor' },
        { x: 730, y: 240, width: 32, height: 32, type: 'hidden', triggered: false }, // 飛び越えを邪魔する隠しブロック

        { x: 800, y: 232, width: 32, height: 32, type: 'hiddenSpike', triggered: false },
        
        { x: 900, y: 300, width: 64, height: 150, type: 'floor' },
        { x: 1050, y: 400, width: 750, height: 50, type: 'floor' }, 
        
        // ハテナトラップ（毒キノコ）
        { x: 1600, y: 280, width: 32, height: 32, type: 'brick', triggered: false },
        { x: 1632, y: 280, width: 32, height: 32, type: 'question_poison', triggered: false },
        { x: 1664, y: 280, width: 32, height: 32, type: 'brick', triggered: false },

        // トゲトゲ地帯
        { x: 1800, y: 400, width: 500, height: 50, type: 'floor' },
        { x: 1868, y: 260, width: 32, height: 32, type: 'hidden', triggered: false },
        { x: 1900, y: 368, width: 32, height: 32, type: 'spike' },
        { x: 1932, y: 368, width: 32, height: 32, type: 'spike' },
        { x: 1964, y: 368, width: 32, height: 32, type: 'spike' },

        // ーーー ここから新エリア ーーー

        // 難所1：【新ギミック】乗ると落ちる崩壊床地帯（落ちる前にジャンプ！）
        { x: 2350, y: 320, width: 48, height: 16, type: 'dropFloor', vy: 0, triggered: false },
        { x: 2450, y: 260, width: 48, height: 16, type: 'dropFloor', vy: 0, triggered: false },
        { x: 2550, y: 320, width: 48, height: 16, type: 'dropFloor', vy: 0, triggered: false },
        { x: 2300, y: 400, width: 400, height: 50, type: 'floor' },

        // 難所2：1マスのスパイクが地面に埋まっている
        { x: 2700, y: 432, width: 682, height: 50, type: 'floor' },
        { x: 2700, y: 400, width: 32, height: 32, type: 'spike' },
        { x: 2732, y: 400, width: 64, height: 32, type: 'floor' },
        { x: 2796, y: 400, width: 32, height: 32, type: 'spike' },
        { x: 2828, y: 400, width: 32, height: 32, type: 'spike' },
        { x: 2860, y: 400, width: 32, height: 32, type: 'floor' },
        { x: 2892, y: 400, width: 32, height: 32, type: 'spike' },
        { x: 2924, y: 400, width: 32, height: 32, type: 'spike' },
        { x: 2956, y: 400, width: 32, height: 32, type: 'floor' },
        { x: 2988, y: 400, width: 32, height: 32, type: 'spike' },
        { x: 3020, y: 400, width: 64, height: 32, type: 'floor' },
        { x: 3084, y: 400, width: 32, height: 32, type: 'spike' },
        { x: 3116, y: 400, width: 96, height: 32, type: 'floor' },
        { x: 3180, y: 300, width: 32, height: 32, type: 'hidden', triggered: false },
        { x: 3212, y: 400, width: 32, height: 32, type: 'spike' },
        { x: 3244, y: 400, width: 32, height: 32, type: 'spike' },
        { x: 3276, y: 400, width: 32, height: 32, type: 'spike' },
        { x: 3308, y: 400, width: 32, height: 32, type: 'spike' },
        { x: 3340, y: 400, width: 32, height: 32, type: 'spike' },
        { x: 3372, y: 400, width: 32, height: 32, type: 'spike' },


        // 本物のゴール（位置を右にずらしたお）
        { x: 3372, y: 400, width: 200, height: 50, type: 'floor' },
        { x: 3400, y: 150, width: 8, height: 250, type: 'realGoal' } 
    ];

    // タイマー用
    if (startTime === 0) {
        startTime = Date.now();
    } else {
        startTime = Date.now() - elapsedTime;
    }
}