// ============================================
// GAME SCENE
// ============================================
scene("game", ({ station, totalScore }) => {
    // Game state
    let phase = "approaching";
    const effectiveStation = Math.min(station, 17);  // Cap speed increase at station 17
    let velocity = CONFIG.BASE_SPEED * (1 + effectiveStation * CONFIG.SPEED_INCREASE);
    let scoreThisRound = 0;
    let rating = "";
    let ratingColor = CONFIG.COLORS.TEXT;
    let correctionTarget = CONFIG.TARGET_X;
    let correctionSoundTimer = 0;
    let doorsOpenAmount = 0;  // 0 = closed, 1 = fully open

    const stations = stationsReversed ? CONFIG.STATIONS_REVERSED : CONFIG.STATIONS;
    const stationName = stations[station % stations.length];
    const stationNumber = station + 1;

    // Platform
    add([
        rect(CONFIG.WIDTH, 60),
        pos(0, CONFIG.HEIGHT - 60),
        color(...CONFIG.COLORS.PLATFORM),
    ]);

    // Platform edge (yellow safety line)
    add([
        rect(CONFIG.WIDTH, 4),
        pos(0, CONFIG.HEIGHT - 60),
        color(...CONFIG.COLORS.PLATFORM_EDGE),
    ]);

    // Station-specific door frame colors and secondary colors (mapped by station name)
    const stationColorMap = {
        'Arden': [180, 100, 60],        // brown (brick)
        'Parkville': [60, 140, 90],     // green
        'State Library': [255, 120, 0], // orange
        'Town Hall': [255, 120, 0],     // orange
        'Anzac': [60, 140, 90],         // green
    };
    const doorFrameColor = stationColorMap[stationName] || [255, 120, 0];

    // Station-specific background decorations
    const decorY = CONFIG.HEIGHT - 180;  // Above the train area

    if (stationName === 'Parkville') {
        // Parkville: 5 squares going across the screen
        const squareColor = [60, 140, 90];  // Green
        const squareSize = 20;
        const spacing = CONFIG.WIDTH / 5;
        for (let i = 0; i < 5; i++) {
            const squareX = spacing / 2 + i * spacing;
            add([
                rect(squareSize, squareSize),
                pos(squareX, decorY),
                anchor("center"),
                color(...squareColor),
                opacity(0.1),
            ]);
        }
    } else if (stationName === 'State Library') {
        // State Library: 5 upside down arches going across the screen
        const archColor = [255, 120, 0];  // Orange
        const spacing = CONFIG.WIDTH / 5;
        for (let i = 0; i < 5; i++) {
            const archCenterX = spacing / 2 + i * spacing;
            // Upside down arch (curves downward)
            add([rect(4, 18), pos(archCenterX - 18, decorY - 12), color(...archColor), opacity(0.1), rotate(30), anchor("top")]);
            add([rect(4, 14), pos(archCenterX - 10, decorY - 2), color(...archColor), opacity(0.1), rotate(15), anchor("top")]);
            add([rect(4, 12), pos(archCenterX, decorY), color(...archColor), opacity(0.1), rotate(0), anchor("top")]);
            add([rect(4, 14), pos(archCenterX + 10, decorY - 2), color(...archColor), opacity(0.1), rotate(-15), anchor("top")]);
            add([rect(4, 18), pos(archCenterX + 18, decorY - 12), color(...archColor), opacity(0.1), rotate(-30), anchor("top")]);
        }
    } else if (stationName === 'Town Hall') {
        // Town Hall: 4 skinnier arches going across the screen
        const archColor = [255, 120, 0];  // Orange
        const spacing = CONFIG.WIDTH / 4;
        for (let i = 0; i < 4; i++) {
            const archCenterX = spacing / 2 + i * spacing;
            // Skinny arch (narrower segments, tighter curve)
            add([rect(3, 22), pos(archCenterX - 14, decorY + 18), color(...archColor), opacity(0.1), rotate(-25), anchor("bot")]);
            add([rect(3, 18), pos(archCenterX - 8, decorY + 8), color(...archColor), opacity(0.1), rotate(-12), anchor("bot")]);
            add([rect(3, 16), pos(archCenterX, decorY + 4), color(...archColor), opacity(0.1), rotate(0), anchor("bot")]);
            add([rect(3, 18), pos(archCenterX + 8, decorY + 8), color(...archColor), opacity(0.1), rotate(12), anchor("bot")]);
            add([rect(3, 22), pos(archCenterX + 14, decorY + 18), color(...archColor), opacity(0.1), rotate(25), anchor("bot")]);
        }
    } else if (stationName === 'Anzac') {
        // Anzac: 5 diamonds (rotated squares) going across the screen
        const diamondColor = [60, 140, 90];  // Green
        const diamondSize = 20;
        const spacing = CONFIG.WIDTH / 5;
        for (let i = 0; i < 5; i++) {
            const diamondX = spacing / 2 + i * spacing;
            add([
                rect(diamondSize, diamondSize),
                pos(diamondX, decorY),
                anchor("center"),
                color(...diamondColor),
                opacity(0.1),
                rotate(45),
            ]);
        }
    } else {
        // Arden (default): Orange arched ceiling structures
        const archColor = [255, 120, 0];
        const archY = CONFIG.HEIGHT - 210;
        for (let i = 0; i < 2; i++) {
            const archCenterX = 80 + i * 160;
            add([rect(6, 30), pos(archCenterX - 55, archY + 35), color(...archColor), opacity(0.1), rotate(-30), anchor("bot")]);
            add([rect(6, 25), pos(archCenterX - 35, archY + 18), color(...archColor), opacity(0.1), rotate(-18), anchor("bot")]);
            add([rect(6, 20), pos(archCenterX - 10, archY + 8), color(...archColor), opacity(0.1), rotate(-5), anchor("bot")]);
            add([rect(6, 20), pos(archCenterX + 10, archY + 8), color(...archColor), opacity(0.1), rotate(5), anchor("bot")]);
            add([rect(6, 25), pos(archCenterX + 35, archY + 18), color(...archColor), opacity(0.1), rotate(18), anchor("bot")]);
            add([rect(6, 30), pos(archCenterX + 55, archY + 35), color(...archColor), opacity(0.1), rotate(30), anchor("bot")]);
        }
    }

    // Random people waiting on the platform (changes each station)
    const waitingColors = [
        [70, 130, 180],   // Steel blue
        [178, 102, 255],  // Purple
        [255, 127, 80],   // Coral
        [60, 179, 113],   // Medium sea green
        [255, 182, 193],  // Light pink
        [135, 206, 235],  // Sky blue
        [255, 215, 0],    // Gold
        [147, 112, 219],  // Medium purple
    ];
    const numWaiting = 3 + Math.floor(Math.random() * 6);  // 3-8 people waiting
    for (let i = 0; i < numWaiting; i++) {
        // Random position on platform (avoid the door area around TARGET_X)
        let waitX;
        const doorZone = 40;  // Keep clear of door area
        if (Math.random() < 0.5) {
            // Left side of door
            waitX = 20 + Math.random() * (CONFIG.TARGET_X - doorZone - 30);
        } else {
            // Right side of door
            waitX = CONFIG.TARGET_X + doorZone + Math.random() * (CONFIG.WIDTH - CONFIG.TARGET_X - doorZone - 20);
        }
        const waitY = CONFIG.HEIGHT - 20 - Math.random() * 30;  // Scattered on platform
        const personColor = waitingColors[Math.floor(Math.random() * waitingColors.length)];
        const waitZ = waitY;  // Z based on Y position

        // Body
        add([
            rect(6, 12),
            pos(waitX, waitY),
            anchor("bot"),
            color(...personColor),
            z(waitZ),
            "waitingPerson"
        ]);
        // Head
        add([
            rect(5, 5),
            pos(waitX, waitY - 12),
            anchor("bot"),
            color(...personColor),
            z(waitZ + 0.1),
            "waitingPerson"
        ]);
    }

    // Screen door width (train door should fit between these)
    const DOOR_WIDTH = 30;
    const SCREEN_DOOR_PANEL_WIDTH = 15;  // Each panel is half the door width

    // Select which carriage door is the target (1-5, carriage 0 is never a target, carriage 6 is driver)
    // Train comes from left, so carriage 5 appears first on screen, then 4, 3, 2, 1, 0
    // Station 0 (level 1): carriage 5 (appears first - easy to see coming)
    // Station 1 (level 2): carriage 4
    // Station 2-14: random from 1-5 (never 0)
    // Station 15+: random from 1-4 (never 0 or 5, carriage 5 appears too fast at high speed)
    let targetDoorCarriage;
    if (station === 0) {
        targetDoorCarriage = 5;  // Carriage 5 (appears first)
    } else if (station === 1) {
        targetDoorCarriage = 4;  // Carriage 4
    } else if (station >= 15) {
        targetDoorCarriage = 1 + Math.floor(Math.random() * 4);  // Random 1-4 (exclude 0 and 5)
    } else {
        targetDoorCarriage = 1 + Math.floor(Math.random() * 5);  // Random 1-5 (exclude 0)
    }
    const targetDoorOffsetX = targetDoorCarriage * CONFIG.CARRIAGE_WIDTH + 45;  // Center of door

    // Single screen door at target position (mobile optimized)
    const screenDoorX = CONFIG.TARGET_X;

    // Train structure:
    // [carriage0][carriage1][carriage2][carriage3][carriage4][carriage5][driver cab]
    // Carriages 0-5: 90px each, silver with windows and blue door
    // Driver cab (index 6): 40px, blue with triangular shapes, NO doors/windows

    const trainParts = [];
    const PASSENGER_CARRIAGES = 6;
    const DRIVER_CAB_WIDTH = 40;  // Matches scaled sprite width (508 * 40/500)
    const PASSENGER_WIDTH = PASSENGER_CARRIAGES * CONFIG.CARRIAGE_WIDTH;  // 450px
    const TOTAL_TRAIN_WIDTH = PASSENGER_WIDTH + DRIVER_CAB_WIDTH;  // 470px
    const TRAIN_DOOR_WIDTH = 18;
    const TRAIN_DOOR_HALF = TRAIN_DOOR_WIDTH / 2;

    const trainY = CONFIG.HEIGHT - 100;

    // Main train body (silver - passenger carriages only)
    const train = add([
        rect(PASSENGER_WIDTH, CONFIG.TRAIN_HEIGHT),
        pos(CONFIG.TRAIN_START, trainY),
        color(...CONFIG.COLORS.TRAIN_SILVER),
        "train"
    ]);

    // Track the target door parts for animation
    let targetDoorLeft = null;
    let targetDoorRight = null;
    let targetDoorLeftOffsetX = 0;
    let targetDoorRightOffsetX = 0;

    // Build passenger carriages (0-4)
    for (let c = 0; c < PASSENGER_CARRIAGES; c++) {
        const carriageX = c * CONFIG.CARRIAGE_WIDTH;

        // Separator between carriages
        if (c > 0) {
            const sep = add([
                rect(2, CONFIG.TRAIN_HEIGHT),
                pos(CONFIG.TRAIN_START + carriageX, trainY),
                color(120, 120, 130),
                "trainPart"
            ]);
            trainParts.push({ part: sep, offsetX: carriageX });
        }

        // Two windows per carriage
        const win1 = add([
            rect(14, 10),
            pos(CONFIG.TRAIN_START + carriageX + 10, trainY + 8),
            color(...CONFIG.COLORS.TRAIN_WINDOW),
            "trainPart"
        ]);
        trainParts.push({ part: win1, offsetX: carriageX + 10 });

        const win2 = add([
            rect(14, 10),
            pos(CONFIG.TRAIN_START + carriageX + 66, trainY + 8),
            color(...CONFIG.COLORS.TRAIN_WINDOW),
            "trainPart"
        ]);
        trainParts.push({ part: win2, offsetX: carriageX + 66 });

        // Blue door - split into left and right halves for target carriage
        const doorX = carriageX + 36;
        const doorY = trainY + 3;
        const doorH = CONFIG.TRAIN_HEIGHT - 6;

        if (c === targetDoorCarriage) {
            // Target door - create as two halves for sliding animation
            // Door opening (dark background behind the sliding doors)
            const doorOpening = add([
                rect(TRAIN_DOOR_WIDTH, doorH),
                pos(CONFIG.TRAIN_START + doorX, doorY),
                color(...CONFIG.COLORS.TRAIN_WINDOW),  // Dark like windows
                "trainPart"
            ]);
            trainParts.push({ part: doorOpening, offsetX: doorX });

            // Left half of door - dark grey outline first
            const leftOutline = add([
                rect(TRAIN_DOOR_HALF + 1, doorH),
                pos(CONFIG.TRAIN_START + doorX - 0.5, doorY),
                color(100, 100, 110),
                "trainPart",
                "trainDoor"
            ]);
            trainParts.push({ part: leftOutline, offsetX: doorX - 0.5, isTargetDoorLeft: true });

            // Left half of door
            targetDoorLeft = add([
                rect(TRAIN_DOOR_HALF - 1, doorH - 2),
                pos(CONFIG.TRAIN_START + doorX + 0.5, doorY + 1),
                color(...CONFIG.COLORS.TRAIN_BLUE_LIGHT),
                "trainPart",
                "trainDoor"
            ]);
            targetDoorLeftOffsetX = doorX + 0.5;
            trainParts.push({ part: targetDoorLeft, offsetX: targetDoorLeftOffsetX, isTargetDoorLeft: true });

            // Right half of door - dark grey outline first
            const rightOutline = add([
                rect(TRAIN_DOOR_HALF + 1, doorH),
                pos(CONFIG.TRAIN_START + doorX + TRAIN_DOOR_HALF - 0.5, doorY),
                color(100, 100, 110),
                "trainPart",
                "trainDoor"
            ]);
            trainParts.push({ part: rightOutline, offsetX: doorX + TRAIN_DOOR_HALF - 0.5, isTargetDoorRight: true });

            // Right half of door
            targetDoorRight = add([
                rect(TRAIN_DOOR_HALF - 1, doorH - 2),
                pos(CONFIG.TRAIN_START + doorX + TRAIN_DOOR_HALF + 0.5, doorY + 1),
                color(...CONFIG.COLORS.TRAIN_BLUE_LIGHT),
                "trainPart",
                "trainDoor"
            ]);
            targetDoorRightOffsetX = doorX + TRAIN_DOOR_HALF + 0.5;
            trainParts.push({ part: targetDoorRight, offsetX: targetDoorRightOffsetX, isTargetDoorRight: true });
        } else {
            // Non-target door - also double doors with outline
            // Left half outline
            const leftOutline = add([
                rect(TRAIN_DOOR_HALF + 1, doorH),
                pos(CONFIG.TRAIN_START + doorX - 0.5, doorY),
                color(100, 100, 110),
                "trainPart"
            ]);
            trainParts.push({ part: leftOutline, offsetX: doorX - 0.5 });

            // Left half fill
            const leftDoor = add([
                rect(TRAIN_DOOR_HALF - 1, doorH - 2),
                pos(CONFIG.TRAIN_START + doorX + 0.5, doorY + 1),
                color(...CONFIG.COLORS.TRAIN_BLUE_LIGHT),
                "trainPart"
            ]);
            trainParts.push({ part: leftDoor, offsetX: doorX + 0.5 });

            // Right half outline
            const rightOutline = add([
                rect(TRAIN_DOOR_HALF + 1, doorH),
                pos(CONFIG.TRAIN_START + doorX + TRAIN_DOOR_HALF - 0.5, doorY),
                color(100, 100, 110),
                "trainPart"
            ]);
            trainParts.push({ part: rightOutline, offsetX: doorX + TRAIN_DOOR_HALF - 0.5 });

            // Right half fill
            const rightDoor = add([
                rect(TRAIN_DOOR_HALF - 1, doorH - 2),
                pos(CONFIG.TRAIN_START + doorX + TRAIN_DOOR_HALF + 0.5, doorY + 1),
                color(...CONFIG.COLORS.TRAIN_BLUE_LIGHT),
                "trainPart"
            ]);
            trainParts.push({ part: rightDoor, offsetX: doorX + TRAIN_DOOR_HALF + 0.5 });
        }
    }

    // Driver cab (carriage 5) - using sprite image
    const cabX = PASSENGER_WIDTH;

    // Driver cab sprite (stretched to fit train dimensions)
    // Image is 476x438, stretch to ~40x40 to match train height
    const driverCab = add([
        sprite("driverCab"),
        pos(CONFIG.TRAIN_START + cabX, trainY),
        scale(vec2(DRIVER_CAB_WIDTH / 476, CONFIG.TRAIN_HEIGHT / 438)),
        "trainPart"
    ]);
    trainParts.push({ part: driverCab, offsetX: cabX });

    // Arrow indicator that follows target door on train (fades out over time)
    // targetDoorOffsetX already points to center of the door (carriageX + 45)
    const arrowOffsetX = targetDoorOffsetX;
    const arrowOffsetY = -25;  // Above the train

    // Arrow body (vertical line) - start off-screen
    const arrowBody = add([
        rect(4, 16),
        pos(-100, -100),
        anchor("center"),
        color(...CONFIG.COLORS.TARGET),
        opacity(1),
        "arrow"
    ]);

    // Arrow head left - start off-screen
    const arrowLeft = add([
        rect(4, 10),
        pos(-100, -100),
        color(...CONFIG.COLORS.TARGET),
        opacity(1),
        rotate(-45),
        anchor("top"),
        "arrow"
    ]);

    // Arrow head right - start off-screen
    const arrowRight = add([
        rect(4, 10),
        pos(-100, -100),
        color(...CONFIG.COLORS.TARGET),
        opacity(1),
        rotate(45),
        anchor("top"),
        "arrow"
    ]);

    // Arrow fade and position tracking
    let arrowOpacity = 1;
    const arrowFadeTime = 4;
    let arrowTime = 0;

    function updateArrow() {
        // Calculate arrow position based on train position
        const arrowX = train.pos.x + arrowOffsetX;
        const arrowY = train.pos.y + arrowOffsetY;

        // Update arrow positions
        arrowBody.pos.x = arrowX;
        arrowBody.pos.y = arrowY;
        arrowLeft.pos.x = arrowX - 6;
        arrowLeft.pos.y = arrowY + 6;
        arrowRight.pos.x = arrowX + 6;
        arrowRight.pos.y = arrowY + 6;

        // Fade out over time
        arrowTime += dt();
        if (arrowTime < arrowFadeTime) {
            // Pulse effect while visible
            const pulse = 0.7 + 0.3 * Math.sin(arrowTime * 6);
            arrowOpacity = Math.max(0, (1 - arrowTime / arrowFadeTime) * pulse);
        } else {
            arrowOpacity = 0;
        }

        arrowBody.opacity = arrowOpacity;
        arrowLeft.opacity = arrowOpacity;
        arrowRight.opacity = arrowOpacity;
    }

    // Position arrow immediately on first frame
    updateArrow();

    // Screen door frame - station-colored outline (2px) - high z-index so people go behind
    // Left edge
    add([
        rect(2, 48),
        pos(screenDoorX - DOOR_WIDTH/2 - 2, CONFIG.HEIGHT - 108),
        color(...doorFrameColor),
        z(200),
    ]);

    // Right edge
    add([
        rect(2, 48),
        pos(screenDoorX + DOOR_WIDTH/2, CONFIG.HEIGHT - 108),
        color(...doorFrameColor),
        z(200),
    ]);

    // Top edge
    add([
        rect(DOOR_WIDTH + 4, 2),
        pos(screenDoorX - DOOR_WIDTH/2 - 2, CONFIG.HEIGHT - 108),
        color(...doorFrameColor),
        z(200),
    ]);

    // Bottom edge
    add([
        rect(DOOR_WIDTH + 4, 2),
        pos(screenDoorX - DOOR_WIDTH/2 - 2, CONFIG.HEIGHT - 62),
        color(...doorFrameColor),
        z(200),
    ]);

    // Screen door panels (glass doors that slide open)
    // Left panel - glass with black outline - high z-index so people go behind
    const screenDoorLeft = add([
        rect(SCREEN_DOOR_PANEL_WIDTH, 45),
        pos(screenDoorX - DOOR_WIDTH/2, CONFIG.HEIGHT - 105),
        color(...CONFIG.COLORS.SCREEN_DOOR_FRAME),
        opacity(0.8),
        outline(1, rgb(0, 0, 0)),
        z(200),
        "screenDoor"
    ]);

    // Right panel - glass with black outline
    const screenDoorRight = add([
        rect(SCREEN_DOOR_PANEL_WIDTH, 45),
        pos(screenDoorX + DOOR_WIDTH/2 - SCREEN_DOOR_PANEL_WIDTH, CONFIG.HEIGHT - 105),
        color(...CONFIG.COLORS.SCREEN_DOOR_FRAME),
        opacity(0.8),
        outline(1, rgb(0, 0, 0)),
        z(200),
        "screenDoor"
    ]);

    // Store original positions for screen doors
    const screenDoorLeftClosedX = screenDoorX - DOOR_WIDTH/2;
    const screenDoorRightClosedX = screenDoorX + DOOR_WIDTH/2 - SCREEN_DOOR_PANEL_WIDTH;

    // Get train door center position (targetDoorOffsetX already points to center)
    function getTrainDoorX() {
        return train.pos.x + targetDoorOffsetX;
    }

    // HUD
    const scoreText = add([
        text(`SCORE: ${totalScore}`, { size: 12 }),
        pos(10, 10),
        color(...CONFIG.COLORS.TEXT),
        fixed(),
    ]);

    add([
        text(`STATION ${stationNumber}`, { size: 10 }),
        pos(10, 30),
        color(150, 150, 150),
        fixed(),
    ]);

    add([
        text(stationName.toUpperCase(), { size: 14 }),
        pos(CONFIG.WIDTH - 10, 10),
        anchor("topright"),
        color(...CONFIG.COLORS.PLATFORM_EDGE),
        fixed(),
    ]);

    const speedText = add([
        text(`${Math.floor(velocity)} px/s`, { size: 10 }),
        pos(CONFIG.WIDTH - 10, 30),
        anchor("topright"),
        color(150, 150, 150),
        fixed(),
    ]);

    // Rating display (appears after stop)
    let ratingText = null;
    let scorePopup = null;

    // Calculate score based on distance
    function calculateScore(distance) {
        if (distance <= CONFIG.ZONES.PERFECT) {
            return { score: 1000, rating: "PERFECT!", color: CONFIG.COLORS.PERFECT };
        } else if (distance <= CONFIG.ZONES.GREAT) {
            return { score: 500, rating: "GREAT!", color: CONFIG.COLORS.GREAT };
        } else if (distance <= CONFIG.ZONES.GOOD) {
            return { score: 200, rating: "GOOD", color: CONFIG.COLORS.GOOD };
        } else if (distance <= CONFIG.ZONES.OK) {
            return { score: 50, rating: "OK", color: CONFIG.COLORS.OK };
        } else {
            return { score: 0, rating: "MISS", color: CONFIG.COLORS.MISS };
        }
    }

    // Update train parts position
    function updateTrainParts() {
        // Update all train parts (windows, doors, cab elements)
        for (const item of trainParts) {
            let offsetX = item.offsetX;

            // Apply door opening offset for target door halves
            if (item.isTargetDoorLeft) {
                offsetX = targetDoorLeftOffsetX - (doorsOpenAmount * TRAIN_DOOR_HALF);
            } else if (item.isTargetDoorRight) {
                offsetX = targetDoorRightOffsetX + (doorsOpenAmount * TRAIN_DOOR_HALF);
            }

            item.part.pos.x = train.pos.x + offsetX;
        }
        // Update arrow indicator
        updateArrow();
    }

    // Update screen doors position based on open amount
    function updateScreenDoors() {
        // Slide doors completely into the frame (15px panel + a bit more to fully clear)
        const openOffset = doorsOpenAmount * (SCREEN_DOOR_PANEL_WIDTH + 2);
        screenDoorLeft.pos.x = screenDoorLeftClosedX - openOffset;
        screenDoorRight.pos.x = screenDoorRightClosedX + openOffset;
    }

    // Create a simple person (head + body) - all one color
    // z-index is based on Y position (further down = higher z = rendered on top)
    function createPerson(startX, startY, walkDirection, walkSpeed, goingForward) {
        const personColors = [
            [70, 130, 180],   // Steel blue
            [178, 102, 255],  // Purple
            [255, 127, 80],   // Coral
            [60, 179, 113],   // Medium sea green
            [255, 182, 193],  // Light pink
            [135, 206, 235],  // Sky blue
        ];
        const personColor = personColors[Math.floor(Math.random() * personColors.length)];

        // If walking down (toward camera/viewer), person walks down the screen
        if (goingForward) {
            const body = add([
                rect(6, 12),
                pos(startX, startY),
                anchor("bot"),
                color(...personColor),
                z(startY),
                "person"
            ]);

            const head = add([
                rect(5, 5),
                pos(startX, startY - 12),
                anchor("bot"),
                color(...personColor),
                z(startY + 0.1),
                "person"
            ]);

            // Walk down the screen (toward viewer)
            let footstepTimer = Math.random() * 0.15;  // Stagger initial footsteps
            const footstepInterval = 0.12 + Math.random() * 0.08;  // 0.12-0.20s between steps

            const walkLoop = onUpdate(() => {
                body.pos.y += walkSpeed * dt();
                head.pos.y = body.pos.y - 12;

                // Update z-index based on Y position
                body.z = body.pos.y;
                head.z = body.pos.y + 0.1;

                // Footstep sounds
                footstepTimer += dt();
                if (footstepTimer >= footstepInterval) {
                    playFootstep();
                    footstepTimer = 0;
                }

                // Remove when off bottom of screen
                if (body.pos.y > CONFIG.HEIGHT + 20) {
                    walkLoop.cancel();
                    destroy(body);
                    destroy(head);
                }
            });

            return { body, head };
        }

        // Body (rectangle)
        const body = add([
            rect(6, 12),
            pos(startX, startY),
            anchor("bot"),
            color(...personColor),
            z(startY),
            "person"
        ]);

        // Head (smaller rectangle) - same color
        const head = add([
            rect(5, 5),
            pos(startX, startY - 12),
            anchor("bot"),
            color(...personColor),
            z(startY + 0.1),
            "person"
        ]);

        // Walk animation (left or right) - first step forward, then turn
        const targetX = walkDirection > 0 ? CONFIG.WIDTH + 20 : -20;
        const stepForwardDistance = 10 + Math.random() * 25;  // Random 10-35 pixels forward
        let distanceStepped = 0;
        let hasTurned = false;
        let footstepTimer = Math.random() * 0.15;  // Stagger initial footsteps
        const footstepInterval = 0.12 + Math.random() * 0.08;  // 0.12-0.20s between steps

        const walkLoop = onUpdate(() => {
            // Footstep sounds
            footstepTimer += dt();
            if (footstepTimer >= footstepInterval) {
                playFootstep();
                footstepTimer = 0;
            }

            if (!hasTurned) {
                // Step forward first (down the screen)
                body.pos.y += walkSpeed * dt();
                head.pos.y = body.pos.y - 12;
                distanceStepped += walkSpeed * dt();

                // Update z-index based on Y position
                body.z = body.pos.y;
                head.z = body.pos.y + 0.1;

                if (distanceStepped >= stepForwardDistance) {
                    hasTurned = true;
                }
            } else {
                // Then walk left or right
                body.pos.x += walkDirection * walkSpeed * dt();
                head.pos.x = body.pos.x;

                // Remove when off screen
                if ((walkDirection > 0 && body.pos.x > targetX) ||
                    (walkDirection < 0 && body.pos.x < targetX)) {
                    walkLoop.cancel();
                    destroy(body);
                    destroy(head);
                }
            }
        });

        return { body, head };
    }

    // Spawn people exiting the train
    function spawnPeople() {
        const doorX = CONFIG.TARGET_X;
        // Spawn just below the door frame (door bottom is at CONFIG.HEIGHT - 62)
        const spawnY = CONFIG.HEIGHT - 60;
        const numPeople = 1 + Math.floor(Math.random() * 10);  // 1-10 people

        // Set crowd sound level based on number of people
        // 1-2 people = level 1, 3-4 = level 2, 5-7 = level 3, 8+ = level 4
        const crowdLevel = numPeople <= 2 ? 1 : numPeople <= 4 ? 2 : numPeople <= 7 ? 3 : 4;
        setCrowdLevel(crowdLevel);

        for (let i = 0; i < numPeople; i++) {
            // Stagger exit times more randomly
            const exitDelay = 0.1 + Math.random() * 0.2;

            wait(exitDelay + i * 0.12, () => {
                const rand = Math.random();
                const walkSpeed = 18 + Math.random() * 22;  // Vary speed (18-40)

                // Random horizontal offset within the door opening (-8 to +8 pixels)
                const xOffset = (Math.random() - 0.5) * 16;
                const startX = doorX + xOffset;

                if (rand < 0.4) {
                    // Go left
                    createPerson(startX, spawnY, -1, walkSpeed, false);
                } else if (rand < 0.8) {
                    // Go right
                    createPerson(startX, spawnY, 1, walkSpeed, false);
                } else {
                    // Go forward (down the screen)
                    createPerson(startX, spawnY, 0, walkSpeed, true);
                }
            });
        }
    }

    // Function to open doors with animation
    function openDoors() {
        phase = "doorsOpening";
        playDoorOpen();
        // Animate doors opening over 0.5 seconds
        let openTime = 0;
        const openDuration = 0.5;

        const openLoop = onUpdate(() => {
            openTime += dt();
            doorsOpenAmount = Math.min(1, openTime / openDuration);
            updateTrainParts();
            updateScreenDoors();

            if (doorsOpenAmount >= 1) {
                openLoop.cancel();
                phase = "doorsOpen";
                // Spawn people exiting the train
                spawnPeople();
                // Wait for people to exit then go to next station
                wait(2, () => {
                    stopCrowdSound();
                    go("game", { station: station + 1, totalScore: totalScore });
                });
            }
        });
    }

    // Main game loop
    onUpdate(() => {
        if (phase === "approaching") {
            train.pos.x += velocity * dt();
            updateTrainParts();

            // Auto game over if train goes way past
            if (train.pos.x > CONFIG.WIDTH + 50) {
                phase = "gameover";
                playMiss();
                wait(1, () => {
                    go("gameover", { finalScore: totalScore, station: stationNumber });
                });
            }
        } else if (phase === "braking") {
            velocity = Math.max(0, velocity - CONFIG.BRAKE_DECEL * dt());
            train.pos.x += velocity * dt();
            updateTrainParts();
            speedText.text = `${Math.floor(velocity)} px/s`;

            if (velocity <= 0) {
                phase = "stopped";
                const distance = Math.abs(getTrainDoorX() - CONFIG.TARGET_X);

                // Check for instant game over
                if (distance > CONFIG.MISS_THRESHOLD) {
                    playMiss();
                    ratingText = add([
                        text("TOO FAR!", { size: 24 }),
                        pos(center().x, center().y - 40),
                        anchor("center"),
                        color(...CONFIG.COLORS.MISS),
                    ]);
                    wait(1.5, () => {
                        go("gameover", { finalScore: totalScore, station: stationNumber });
                    });
                    return;
                }

                const result = calculateScore(distance);
                scoreThisRound = result.score;
                rating = result.rating;
                ratingColor = result.color;
                correctionTarget = CONFIG.TARGET_X;

                // Play sound
                if (result.score === 1000) playPerfect();
                else if (result.score === 500) playGreat();
                else if (result.score === 200) playGood();
                else if (result.score === 50) playOk();
                else playMiss();

                // Show rating
                ratingText = add([
                    text(rating, { size: 24 }),
                    pos(center().x, center().y - 40),
                    anchor("center"),
                    color(...ratingColor),
                ]);

                // Show score popup
                scorePopup = add([
                    text(`+${scoreThisRound}`, { size: 16 }),
                    pos(center().x, center().y - 10),
                    anchor("center"),
                    color(...ratingColor),
                ]);

                totalScore += scoreThisRound;
                scoreText.text = `SCORE: ${totalScore}`;

                // For PERFECT stops, open doors immediately
                if (result.score === 1000) {
                    phase = "waitingForDoors";  // Prevent correction from starting
                    wait(0.5, () => {
                        openDoors();
                    });
                } else {
                    // Start correction after brief pause
                    wait(0.8, () => {
                        if (phase === "stopped") {
                            phase = "correcting";
                        }
                    });
                }
            }
        } else if (phase === "correcting") {
            const currentDoorX = getTrainDoorX();
            const diff = correctionTarget - currentDoorX;

            if (Math.abs(diff) < 1) {
                // Correction complete - position train so target door aligns with platform door
                phase = "correctionComplete";  // Prevent multiple calls
                train.pos.x = CONFIG.TARGET_X - targetDoorOffsetX;
                updateTrainParts();

                // Check if game over due to score
                if (totalScore <= 0) {
                    wait(0.5, () => {
                        go("gameover", { finalScore: 0, station: stationNumber });
                    });
                } else {
                    // Open doors after correction
                    wait(0.3, () => {
                        openDoors();
                    });
                }
            } else {
                // Move toward target
                const moveDir = diff > 0 ? 1 : -1;
                const moveAmount = Math.min(Math.abs(diff), CONFIG.CORRECTION_SPEED * dt());
                train.pos.x += moveDir * moveAmount;
                updateTrainParts();

                // Drain points during correction
                const pointsLost = Math.ceil(moveAmount * CONFIG.POINT_DRAIN_RATE);
                totalScore = Math.max(0, totalScore - pointsLost);
                scoreText.text = `SCORE: ${totalScore}`;

                // Play correction rolling sound regularly while moving
                correctionSoundTimer += dt();
                if (correctionSoundTimer > 0.08) {
                    playCorrection();
                    correctionSoundTimer = 0;
                }
            }
        }
    });

    // Input
    const brake = () => {
        if (phase === "approaching") {
            phase = "braking";
            playBrake();
            shake(3);
        }
    };

    onKeyPress("space", brake);
    onClick(brake);
});
