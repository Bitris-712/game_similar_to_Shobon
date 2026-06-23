// --- ステージ 1 初期化関数 ---
function initStage() {
    gameActive = true;
    gameCleared = false;
    gamePaused = false;
    cameraX = 0;
    
    player.x = 80; player.y = 350; player.vx = 0; player.vy = 0; player.grounded = false;
    item.active = false;

    // 一面の青空背景
    canvas.style.background = "#6699ff";

    // 一面専用ミサイル（おにぎり）
    missile = { x: 1900, y: 320, width: 34, height: 34, speed: 9, triggered: false };

    // 一面の敵データ
    enemies = [
        { x: 420, y: 368, width: 32, height: 32, speed: 1.5, leftBound: 200, rightBound: 540, alive: true, type: 'normal' },
        { x: 1350, y: 368, width: 32, height: 32, speed: 1.5, leftBound: 1200, rightBound: 1500, alive: true, type: 'normal' },
        { x: 3650, y: 368, width: 32, height: 32, speed: 1.5, leftBound: 3600, rightBound: 4000, alive: true, type: 'jumper', vy: 0, grounded: true, baseY: 368 }
    ];

    // 一面のブロックマップ
    blocks = [
        { x: 0, y: 400, width: 650, height: 50, type: 'floor' },
        { x: 240, y: 260, width: 32, height: 32, type: 'brick' },
        { x: 272, y: 260, width: 32, height: 32, type: 'question_poison', triggered: false }, 
        { x: 304, y: 260, width: 32, height: 32, type: 'brick_broken' }, 
        { x: 336, y: 260, width: 32, height: 32, type: 'brick' },
        { x: 610, y: 250, width: 32, height: 32, type: 'hidden', triggered: false },
        { x: 770, y: 320, width: 120, height: 24, type: 'dropFloor', vy: 0, triggered: false },
        { x: 1000, y: 400, width: 600, height: 50, type: 'floor' },
        { x: 1168, y: 300, width: 32, height: 32, type: 'hiddenSpike', triggered: false },
        { x: 1200, y: 336, width: 48, height: 64, type: 'pipe' },
        { x: 1418, y: 368, width: 32, height: 32, type: 'spike' },
        { x: 1450, y: 304, width: 48, height: 96, type: 'pipe' }, 
        { x: 1680, y: 400, width: 200, height: 50, type: 'floor' },
        { x: 1738, y: 240, width: 32, height: 32, type: 'hiddenSpike', triggered: false },
        { x: 1740, y: 368, width: 32, height: 32, type: 'spike' },
        { x: 1980, y: 400, width: 150, height: 50, type: 'floor' },
        { x: 1980, y: -150, width: 150, height: 150, type: 'fallingCeiling', vy: 0, triggered: false },
        { x: 2250, y: 400, width: 1100, height: 50, type: 'floor' },
        { x: 2700, y: 368, width: 32, height: 32, type: 'brick' },
        { x: 2732, y: 368, width: 32, height: 32, type: 'brick' },
        { x: 2732, y: 336, width: 32, height: 32, type: 'brick' },
        { x: 2764, y: 368, width: 32, height: 32, type: 'brick' },
        { x: 2764, y: 336, width: 32, height: 32, type: 'brick' },
        { x: 2764, y: 304, width: 32, height: 32, type: 'brick' },
        { x: 2796, y: 368, width: 32, height: 32, type: 'brick' },
        { x: 2796, y: 336, width: 32, height: 32, type: 'brick' },
        { x: 2796, y: 304, width: 32, height: 32, type: 'brick' },
        { x: 2796, y: 272, width: 32, height: 32, type: 'brick' },
        { x: 2828, y: 368, width: 32, height: 32, type: 'brick' },
        { x: 2828, y: 336, width: 32, height: 32, type: 'brick' },
        { x: 2828, y: 304, width: 32, height: 32, type: 'brick' },
        { x: 2828, y: 272, width: 32, height: 32, type: 'brick' },
        { x: 2828, y: 240, width: 32, height: 32, type: 'brick' },
        { x: 2920, y: 150, width: 8, height: 250, type: 'fakeGoal' },
        { x: 3310, y: 250, width: 32, height: 32, type: 'hidden', triggered: false },
        { x: 3450, y: 400, width: 32, height: 50, type: 'floor' },
        { x: 3450, y: 400, width: 128, height: 50, type: 'disappearFloor', triggered: false },
        { x: 3578, y: 400, width: 1000, height: 50, type: 'floor' },
        { x: 4250, y: 150, width: 8, height: 250, type: 'realGoal' }
    ];

    // タイマー用
    if (startTime === 0) {
        startTime = Date.now();
    } else {
        startTime = Date.now() - elapsedTime;
    }
}