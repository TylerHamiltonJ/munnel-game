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

    add([
        text("Melbourne Metro Tunnel", { size: 12 }),
        pos(center().x, 115),
        anchor("center"),
        color(200, 200, 200),
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

    // Draw mini train (simplified)
    const trainY = 340;
    // Silver passenger section
    add([
        rect(50, 20),
        pos(center().x - 15, trainY),
        anchor("center"),
        color(...CONFIG.COLORS.TRAIN_SILVER),
    ]);
    // Blue door
    add([
        rect(8, 16),
        pos(center().x - 15, trainY),
        anchor("center"),
        color(...CONFIG.COLORS.TRAIN_BLUE_LIGHT),
    ]);
    // Driver cab sprite (stretched for mini train, positioned to connect)
    add([
        sprite("driverCab"),
        pos(center().x + 10, trainY - 10),
        scale(vec2(20 / 476, 20 / 438)),  // Stretch to ~20x20 for mini train
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
        initAudio();
        // Randomly decide station direction (50% chance each way)
        stationsReversed = Math.random() < 0.5;
        go("game", { station: 0, totalScore: 0 });
    };

    onKeyPress("space", startGame);
    onClick(startGame);
});
