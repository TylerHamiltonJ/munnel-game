// ============================================
// KAPLAY INITIALIZATION
// ============================================
kaplay({
    width: CONFIG.WIDTH,
    height: CONFIG.HEIGHT,
    scale: 2,
    crisp: true,
    letterbox: true,
    background: CONFIG.COLORS.BG,
    font: "monospace",
});

// Load driver cab sprite
loadSprite("driverCab", "driver.png");
