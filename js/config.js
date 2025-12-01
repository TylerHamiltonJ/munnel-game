// ============================================
// CONFIGURATION
// ============================================
// Game state - direction randomized each game
let stationsReversed = false;

const CONFIG = {
    WIDTH: 320,
    HEIGHT: 480,

    BASE_SPEED: 150,
    SPEED_INCREASE: 0.1,
    BRAKE_DECEL: 400,

    TARGET_X: 220,  // Right side of screen
    TRAIN_START: -620,  // 6 passenger carriages (90px each) + driver cab (40px) = 580px, plus 40px buffer
    TRAIN_WIDTH: 580,  // 6 passenger carriages (90px each) + driver cab sprite (~40px)
    TRAIN_HEIGHT: 40,
    CARRIAGE_WIDTH: 90,
    NUM_CARRIAGES: 6,  // 5 passenger + 1 driver
    CORRECTION_SPEED: 80,
    POINT_DRAIN_RATE: 1,

    MISS_THRESHOLD: 100,

    ZONES: {
        PERFECT: 3,   // Tighter precision required for perfect
        GREAT: 15,
        GOOD: 30,
        OK: 50
    },

    STATIONS: ['Arden', 'Parkville', 'State Library', 'Town Hall', 'Anzac'],
    STATIONS_REVERSED: ['Anzac', 'Town Hall', 'State Library', 'Parkville', 'Arden'],

    COLORS: {
        BG: [26, 26, 46],
        PLATFORM: [74, 74, 106],
        PLATFORM_EDGE: [255, 200, 0],
        // HCMT Train colors
        TRAIN_SILVER: [168, 170, 170],  // #a8aaaa
        TRAIN_BLUE_LIGHT: [0, 156, 220],  // #009cdc
        TRAIN_BLUE_DARK: [30, 80, 140],
        TRAIN_CHARCOAL: [50, 55, 65],
        TRAIN_YELLOW: [255, 200, 0],
        TRAIN_WINDOW: [26, 26, 46],
        TRAIN_DOOR: [255, 200, 0],
        TARGET: [255, 200, 0],
        SCREEN_DOOR: [40, 40, 60],
        SCREEN_DOOR_FRAME: [60, 60, 80],
        TEXT: [255, 255, 255],
        PERFECT: [46, 204, 113],
        GREAT: [52, 152, 219],
        GOOD: [241, 196, 15],
        OK: [230, 126, 34],
        MISS: [231, 76, 60]
    }
};
