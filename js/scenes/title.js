// ============================================
// TITLE SCENE
// ============================================
scene("title", () => {
    // Title
    add([
        text("MUNNELER", { size: 32 }),
        pos(center().x, 80),
        anchor("center"),
        color(255, 200, 0),
    ]);


    // Instructions
    add([
        text("Stop the train at\nthe platform doors", { size: 10 }),
        pos(center().x, 180),
        anchor("center"),
        color(150, 150, 150),
    ]);

    add([
        text("TAP or SPACE to brake", { size: 10 }),
        pos(center().x, 220),
        anchor("center"),
        color(150, 150, 150),
    ]);

    // High score
    const highScores = getHighScores();
    if (highScores.length > 0) {
        add([
            text(`HIGH SCORE: ${highScores[0]}`, { size: 14 }),
            pos(center().x, 280),
            anchor("center"),
            color(46, 204, 113),
        ]);
    }

    // Draw mini train (v2 - matching game train style)
    const trainY = 340;
    const carriageW = 50;  // Width of each carriage
    const carriageH = 24;  // Height of train
    const cabW = 22;       // Driver cab width
    const totalWidth = carriageW * 3 + cabW;  // 3 carriages + cab
    const startX = center().x - totalWidth / 2;

    // Silver body for all 3 carriages
    add([
        rect(carriageW * 3, carriageH),
        pos(startX, trainY),
        color(...CONFIG.COLORS.TRAIN_SILVER),
    ]);

    // Carriage 0
    add([rect(7, 6), pos(startX + 5, trainY + 5), color(20, 20, 30)]);  // Window L
    add([rect(7, 6), pos(startX + 38, trainY + 5), color(20, 20, 30)]); // Window R
    add([rect(5, 18), pos(startX + 19, trainY + 3), color(100, 100, 110)]); // Door L outline
    add([rect(4, 16), pos(startX + 19.5, trainY + 4), color(...CONFIG.COLORS.TRAIN_BLUE_LIGHT)]); // Door L
    add([rect(5, 18), pos(startX + 24, trainY + 3), color(100, 100, 110)]); // Door R outline
    add([rect(4, 16), pos(startX + 24.5, trainY + 4), color(...CONFIG.COLORS.TRAIN_BLUE_LIGHT)]); // Door R

    // Separator 1
    add([rect(2, carriageH), pos(startX + carriageW, trainY), color(100, 100, 110)]);

    // Carriage 1
    const c1 = startX + carriageW;
    add([rect(7, 6), pos(c1 + 5, trainY + 5), color(20, 20, 30)]);  // Window L
    add([rect(7, 6), pos(c1 + 38, trainY + 5), color(20, 20, 30)]); // Window R
    add([rect(5, 18), pos(c1 + 19, trainY + 3), color(100, 100, 110)]); // Door L outline
    add([rect(4, 16), pos(c1 + 19.5, trainY + 4), color(...CONFIG.COLORS.TRAIN_BLUE_LIGHT)]); // Door L
    add([rect(5, 18), pos(c1 + 24, trainY + 3), color(100, 100, 110)]); // Door R outline
    add([rect(4, 16), pos(c1 + 24.5, trainY + 4), color(...CONFIG.COLORS.TRAIN_BLUE_LIGHT)]); // Door R

    // Separator 2
    add([rect(2, carriageH), pos(startX + carriageW * 2, trainY), color(100, 100, 110)]);

    // Carriage 2
    const c2 = startX + carriageW * 2;
    add([rect(7, 6), pos(c2 + 5, trainY + 5), color(20, 20, 30)]);  // Window L
    add([rect(7, 6), pos(c2 + 38, trainY + 5), color(20, 20, 30)]); // Window R
    add([rect(5, 18), pos(c2 + 19, trainY + 3), color(100, 100, 110)]); // Door L outline
    add([rect(4, 16), pos(c2 + 19.5, trainY + 4), color(...CONFIG.COLORS.TRAIN_BLUE_LIGHT)]); // Door L
    add([rect(5, 18), pos(c2 + 24, trainY + 3), color(100, 100, 110)]); // Door R outline
    add([rect(4, 16), pos(c2 + 24.5, trainY + 4), color(...CONFIG.COLORS.TRAIN_BLUE_LIGHT)]); // Door R

    // Driver cab sprite
    add([
        sprite("driverCab"),
        pos(startX + carriageW * 3, trainY),
        scale(vec2(cabW / 476, carriageH / 438)),
    ]);

    // Start prompt
    const startText = add([
        text("TAP TO START", { size: 14 }),
        pos(center().x, 420),
        anchor("center"),
        color(255, 255, 255),
    ]);

    // Blink
    let visible = true;
    loop(0.5, () => {
        visible = !visible;
        startText.opacity = visible ? 1 : 0;
    });

    // Input
    const startGame = () => {
        vibrateButton();
        initAudio();
        // Randomly decide station direction (50% chance each way)
        stationsReversed = Math.random() < 0.5;
        go("game", { station: 0, totalScore: 0 });
    };

    onKeyPress("space", startGame);
    onClick(startGame);
});
