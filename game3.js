// --- ステージ 3（AI決戦ステージ）初期化関数 ---
function initStage() {
    gameActive = true;
    gameCleared = false;
    gamePaused = false;
    cameraX = 0;
    
    player.x = 80; player.y = 350; player.vx = 0; player.vy = 0; player.grounded = false;
    item.active = false;

    // 三面の不気味なサイバーAI背景（怪しい紫色）
    canvas.style.background = "#1a0033";
    missile = null;

    // --- 機械学習AIモララーを1体配置 ---
    enemies = [
        { 
            x: 1000, y: 368, 
            width: 32, height: 32, 
            speed: 4.0, 
            alive: true, 
            type: 'ml_boss', 
            vy: 0, 
            grounded: true, 
            baseY: 368
        }
    ];

    // 三面のブロックマップ（AIと戦うための平坦かつ罠のあるステージ）
    blocks = [
        { x: 0, y: 400, width: 1800, height: 50, type: 'floor' },
        
        { x: 500, y: 275, width: 32, height: 32, type: 'brick' },
        { x: 532, y: 275, width: 32, height: 32, type: 'brick' },
        { x: 564, y: 275, width: 32, height: 32, type: 'brick' },
        { x: 596, y: 275, width: 32, height: 32, type: 'brick' },
        { x: 628, y: 275, width: 32, height: 32, type: 'brick' },
        { x: 660, y: 275, width: 32, height: 32, type: 'brick' },
        { x: 692, y: 275, width: 32, height: 32, type: 'brick' },
        { x: 724, y: 243, width: 32, height: 32, type: 'brick' },
        { x: 596, y: 243, width: 32, height: 32, type: 'spike' },

        // 隠しトゲ
        { x: 600, y: 282, width: 32, height: 32, type: 'hiddenSpike', triggered: false },

        { x: 900, y: 320, width: 48, height: 80, type: 'pipe' },

        { x: 1100, y: 368, width: 32, height: 32, type: 'spike' },

        { x: 1232, y: 272, width: 32, height: 32, type: 'brick' },
        { x: 1264, y: 272, width: 32, height: 32, type: 'brick' },
        { x: 1296, y: 272, width: 32, height: 32, type: 'brick' },
        { x: 1328, y: 272, width: 32, height: 32, type: 'brick' },
        { x: 1360, y: 272, width: 32, height: 32, type: 'brick' },
        { x: 1392, y: 272, width: 32, height: 32, type: 'brick' },
        { x: 1424, y: 272, width: 32, height: 32, type: 'brick' },
        { x: 1456, y: 272, width: 32, height: 32, type: 'brick' },
        { x: 1488, y: 272, width: 32, height: 32, type: 'brick' },
        { x: 1488, y: 240, width: 32, height: 32, type: 'spike' },
        { x: 1520, y: 272, width: 32, height: 32, type: 'brick' },
        { x: 1552, y: 272, width: 32, height: 32, type: 'brick' },
        { x: 1584, y: 272, width: 32, height: 32, type: 'brick' },
        { x: 1584, y: 304, width: 32, height: 32, type: 'brick' },

        { x: 1584, y: 368, width: 32, height: 32, type: 'brick' },

        { x: 1758, y: 300, width: 32, height: 32, type: 'hidden', triggered: false },

        { x: 1970, y: 400, width: 32, height: 50, type: 'floor' },
        { x: 2002, y: 400, width: 160, height: 50, type: 'disappearFloor', triggered: false },
        { x: 2162, y: 400, width: 300, height: 50, type: 'floor' },

        // 本物のゴール
        { x: 2300, y: 150, width: 8, height: 250, type: 'realGoal' } 
    ];

    if (startTime === 0) {
        startTime = Date.now();
    } else {
        startTime = Date.now() - elapsedTime;
    }
}