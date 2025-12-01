// ============================================
// GAME OVER SCENE
// ============================================
scene("gameover", ({ finalScore, station }) => {
    playGameOver();

    const isNewHigh = isHighScore(finalScore);
    if (finalScore > 0) {
        saveHighScore(finalScore);
    }

    // Game Over text
    add([
        text("GAME OVER", { size: 28 }),
        pos(center().x, 80),
        anchor("center"),
        color(231, 76, 60),
    ]);

    // Stations reached
    add([
        text(`Stations: ${station}`, { size: 14 }),
        pos(center().x, 130),
        anchor("center"),
        color(200, 200, 200),
    ]);

    // Final score
    add([
        text(`FINAL SCORE`, { size: 12 }),
        pos(center().x, 180),
        anchor("center"),
        color(150, 150, 150),
    ]);

    add([
        text(`${finalScore}`, { size: 32 }),
        pos(center().x, 220),
        anchor("center"),
        color(255, 200, 0),
    ]);

    // New high score celebration
    if (isNewHigh && finalScore > 0) {
        const newHighText = add([
            text("NEW HIGH SCORE!", { size: 16 }),
            pos(center().x, 265),
            anchor("center"),
            color(46, 204, 113),
        ]);

        // Flash effect
        let visible = true;
        loop(0.3, () => {
            visible = !visible;
            newHighText.opacity = visible ? 1 : 0.5;
        });
    }

    // Share footer
    const shareY = isNewHigh && finalScore > 0 ? 295 : 265;
    const shareText = `I reached station ${station} with a score of ${finalScore} in Munneler! Can you beat my score? 🚇`;
    const shareTextWithHashtag = `${shareText} #Munneler`;
    const gameUrl = 'https://munneler.fun';

    add([
        text("SHARE", { size: 10 }),
        pos(center().x, shareY - 5),
        anchor("center"),
        color(150, 150, 150),
    ]);

    const buttonSize = 36;
    const buttonSpacing = 44;
    const startX = center().x - buttonSpacing;
    const buttonY = shareY + 20;

    // Facebook button
    const fbButton = add([
        rect(buttonSize, buttonSize, { radius: 4 }),
        pos(startX, buttonY),
        anchor("center"),
        color(24, 119, 242),
        area(),
    ]);
    add([
        text("f", { size: 18 }),
        pos(startX, buttonY),
        anchor("center"),
        color(255, 255, 255),
    ]);
    fbButton.onClick(() => {
        vibrateButton();
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(gameUrl)}&quote=${encodeURIComponent(shareText)}`;
        window.location.href = fbUrl;
    });

    // Bluesky button
    const bskyButton = add([
        rect(buttonSize, buttonSize, { radius: 4 }),
        pos(startX + buttonSpacing, buttonY),
        anchor("center"),
        color(0, 133, 255),
        area(),
    ]);
    add([
        text("🦋", { size: 16 }),
        pos(startX + buttonSpacing, buttonY),
        anchor("center"),
    ]);
    bskyButton.onClick(() => {
        vibrateButton();
        const bskyUrl = `https://bsky.app/intent/compose?text=${encodeURIComponent(shareTextWithHashtag + ' ' + gameUrl)}`;
        window.location.href = bskyUrl;
    });

    // Twitter/X button
    const xButton = add([
        rect(buttonSize, buttonSize, { radius: 4 }),
        pos(startX + buttonSpacing * 2, buttonY),
        anchor("center"),
        color(0, 0, 0),
        area(),
    ]);
    add([
        text("X", { size: 16 }),
        pos(startX + buttonSpacing * 2, buttonY),
        anchor("center"),
        color(255, 255, 255),
    ]);
    xButton.onClick(() => {
        vibrateButton();
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTextWithHashtag)}&url=${encodeURIComponent(gameUrl)}`;
        window.location.href = tweetUrl;
    });


    // High scores list
    const scores = getHighScores();
    const highScoreStartY = isNewHigh && finalScore > 0 ? 355 : 325;
    if (scores.length > 0) {
        add([
            text("HIGH SCORES", { size: 10 }),
            pos(center().x, highScoreStartY),
            anchor("center"),
            color(150, 150, 150),
        ]);

        scores.slice(0, 5).forEach((score, i) => {
            const isCurrentScore = score === finalScore && isNewHigh;
            add([
                text(`${i + 1}. ${score}`, { size: 10 }),
                pos(center().x, highScoreStartY + 20 + i * 16),
                anchor("center"),
                color(isCurrentScore ? 46 : 200, isCurrentScore ? 204 : 200, isCurrentScore ? 113 : 200),
            ]);
        });
    }

    // Restart prompt
    add([
        text("TAP TO RETRY", { size: 14 }),
        pos(center().x, CONFIG.HEIGHT - 55),
        anchor("center"),
        color(255, 255, 255),
    ]);

    // Ko-fi / Buy me a coffee button at the bottom
    const kofiButton = add([
        rect(140, 24, { radius: 4 }),
        pos(center().x, CONFIG.HEIGHT - 20),
        anchor("center"),
        color(255, 94, 91),
        area(),
    ]);
    add([
        text("☕ Buy me a coffee", { size: 10 }),
        pos(center().x, CONFIG.HEIGHT - 20),
        anchor("center"),
        color(255, 255, 255),
    ]);
    kofiButton.onClick(() => {
        vibrateButton();
        window.location.href = 'https://ko-fi.com/abrahamilton';
    });

    // Input
    const restart = () => {
        vibrateButton();
        go("title");
    };

    onKeyPress("space", restart);
    onClick(restart);
});
