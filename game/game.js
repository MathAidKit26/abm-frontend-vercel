const canvas = document.getElementById('mathCanvas');
const ctx = canvas.getContext('2d');

const GRID_UNITS = 20;
let unitPixels = canvas.width / GRID_UNITS;

let currentStage = 0;
let score = 0;

let state = {
    k: 1.0,
    cx: 0,
    cy: 0,
    angle: 90,
    dir: 'cw',
    rcx: 0,
    rcy: 0,
    refType: 'x-axis', 
    refVal: 0,
    tx: 0,
    ty: 0,
    combo1_type: '',
    combo1_tx: 0,
    combo1_ty: 0,
    combo1_angle: 90,
    combo1_dir: 'cw',
    combo1_rcx: 0,
    combo1_rcy: 0,
    combo2_type: '',
    combo2_tx: 0,
    combo2_ty: 0,
    combo2_angle: 90,
    combo2_dir: 'cw',
    combo2_rcx: 0,
    combo2_rcy: 0
};

const P = {
    '.': null,
    'K': '#ffffff',
    'W': '#0033a0',
    'S': '#ffdf00',
    'B': '#ffffff',
    'R': '#ce1126',
    'Y': '#ffdf00',
    'G': '#ffffff',
    'D': '#ce1126',
    'C': '#0033a0',
    'P': '#ce1126',
    'O': '#ffffff',
    'M': '#ffffff',
    'L': '#0033a0',
    'E': '#ce1126',
    'N': '#ffffff',
    'U': '#ffffff',
    'H': '#0033a0',
    'V': '#ffffff',
    'X': '#ce1126'
};

const sprites32x32 = {
    tunku: [
        "................................",
        ".............KKKKKK.............",
        "...........KHHHHHHHHK...........",
        "..........KHHHHHHHHHHK..........",
        "..........KHHHHHHHHHHK..........",
        ".........KHHHNNNNNNHHHK.........",
        ".........KHHNSSSSHNNHHK.........",
        "........KHHNSSSSSSSSNHHK........",
        "........KHHNSSSSSSSSNHHK........",
        "........KKKNSSSSSSSSNKKK........",
        ".......KSSSSSSSSSSSSSSSSK.......",
        ".......KSSSSKSSSSSSKSSSSK.......",
        ".......KSSSSSSSSSSSSSSSSK.......",
        ".......KSSSSKKKKKKKKSSSSK.......",
        "........KSSSSSSSSSSSSSSK........",
        "........KSSSSSSWWSSSSSSK........",
        ".........KKSSSSWWSSSSKK.........",
        "........KUUUKKWWWWKKUUUK........",
        ".......KUUUUUUWWWWUUUUUUK.......",
        "......KUUUUUUUUWWUUUUUUUUK......",
        ".....KUUUUUUUUUWWUUUUUUUUUK.....",
        "....KUUUUUUUUUUWWUUUUUUUUUUK....",
        "...KUUUUUUUUBBBWWBBBBBBBBBBBK...",
        "..KUUUUUUUUBBBBWWBBBBBBBBBBBBK..",
        ".KUUUUUUUUUBBBBWWBBBBBBBBBBBBBK.",
        ".KUUUUUUUUUBBBBWWBBBBBBBBBBBBBK.",
        ".KUUUUUUUUUBBBBWWBBBBBBBBBBBBBK.",
        ".KUUUUUUUUUBBBBWWBBBBBBBBBBBBBK.",
        "KUUUUUUUUUUBBBBWWBBBBBBBBBBBBBBK",
        "KUUUUUUUUUUBBBBWWBBBBBBBBBBBBBBK",
        "KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK",
        "................................"
    ],
    bunga: [
        "................................",
        "..................KK............",
        ".................KYYK...........",
        "................KYYYYK..........",
        "...............KYYYYYK..........",
        "..............KYYYYYK...........",
        ".............KYYYYYK............",
        "....KKK.....KYYYYYK.....KKK.....",
        "..KEEEEK...KYYYYYK...KEEEEKK....",
        ".KEEEEEEEKKKYYYYKKKEEEEEEEEK...",
        ".KEEEEEEEEEEYYYYEEEEEEEEEEEEK...",
        "KEEEEEEEEEEEEYYYEEEEEEEEEEEEEK..",
        "KEEEEEEEEEEEEEYYEEEEEEEEEEEEEK..",
        "KEEEEEEEEEEEEEYYEEEEEEEEEEEEEK..",
        "KEEEEEEEEEEEEEYEEEEEEEEEEEEEEK..",
        ".KEEEEEEEEEEEVVEEEEEEEEEEEEEK...",
        "..KEEEEEEEEEVEVEEEEEEEEEEEEK....",
        "...KEEEEEEEEVEVEVEEEEEEEEEK.....",
        "....KEEEEEVEVEVEVEEEEEEEEK......",
        ".....KEEEVEVEVEVEVEEEEEEEK......",
        "......KEEVEVEVEVEVEEEEEEEKK.....",
        ".....KEEEVEVEVEVEVEEEEEEEEEK....",
        "....KEEEEEEVEVEVEEEEEEEEEEEK....",
        "...KEEEEEEEEEVEEEEEEEEEEEEEEK...",
        "..KEEEEEEEEEEEEEEEEEEEEEEEEEEK..",
        ".KEEEEEEEEEEEEEEEEEEEEEEEEEEEEK.",
        ".KEEEEEEEEEEEEEEEEEEEEEEEEEEEEK.",
        "..KEEEEEEEEEEEEEEEEEEEEEEEEEEK..",
        "...KEEEEEEEEEEEEEEEEEEEEEEEEK...",
        "....KKEEEEEEEEEEEEEEEEEEEEKK....",
        "......KKKEEEEEEEEEEEEEEKKK......",
        ".........KKKKKKKKKKKKKK........."
    ],
    unionjack: [
        "KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK", "KRRWWBBBBBBBBWWWRRWWBBBBBBBBWWRK", "KWRRWWBBBBBBWWWRRRWWBBBBBBWWRRWK",
        "KBWRRWWBBBBWWWRRRRRWWBBBBWWRRWBK", "KBBWRRWWBBWWWRRRRRRRWWBBWWRRWBBK", "KBBBWRRWWWWRRRRRRRRRRWWWWWRRWBK",
        "KBBBBWRRRRRRRRRRRRRRRRRRRRRWBBBK", "KWWWWWRRRRRRRRRRRRRRRRRRRRRWWWWK", "KWWWWWRRRRRRRRRRRRRRRRRRRRRWWWWK",
        "KRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRK", "KRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRK", "KRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRK",
        "KWWWWWRRRRRRRRRRRRRRRRRRRRRWWWWK", "KWWWWWRRRRRRRRRRRRRRRRRRRRRWWWWK", "KBBBBWRRRRRRRRRRRRRRRRRRRRRWBBBK",
        "KBBBWRRWWWWRRRRRRRRRRWWWWWRRWBK", "KBBWRRWWBBWWWRRRRRRRWWBBWWRRWBBK", "KBWRRWWBBBBWWWRRRRRWWBBBBWWRRWBK",
        "KWRRWWBBBBBBWWWRRWWBBBBBBWWRRWK", "KRRWWBBBBBBBBWWWRRWWBBBBBBBBWWRK", "KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK",
        "................................", "................................", "................................",
        "................................", "................................", "................................",
        "................................", "................................", "................................",
        "................................", "................................"
    ],
    jalur: [
        "KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK", "KBBBBBBBBBBBBBBBBRRRRRRRRRRRRRRK", "KBBBBBBBBBBBBBBBBWWWWWWWWWWWWWWK",
        "KBBBBBYYYYYBBBBBBRRRRRRRRRRRRRRK", "KBBBBYYYYYYYYBBBBWWWWWWWWWWWWWWK", "KBBBYYYBBYYYYYBBBRRRRRRRRRRRRRRK",
        "KBBBYYYBBBYYYYBBBWWWWWWWWWWWWWWK", "KBBBYYYBBBBYYYBBBRRRRRRRRRRRRRRK", "KBBBBYYYYYYYYBBBBWWWWWWWWWWWWWWK",
        "KBBBBBYYYYYBBBBBBRRRRRRRRRRRRRRK", "KBBBBBBBBBBBBBBBBWWWWWWWWWWWWWWK", "KRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRK",
        "KWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWK", "KRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRK", "KWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWK",
        "KRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRK", "KWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWK", "KRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRK",
        "KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK", "................................", "................................",
        "................................", "................................", "................................",
        "................................", "................................", "................................",
        "................................", "................................", "................................",
        "................................", "................................"
    ],
    clocktower: [
        "................................", "...............KK...............", "..............KYYK..............",
        ".............KYYYYK.............", "............KYYYYYYK............", "...........KYYYYYYYYK...........",
        "..........KKKKKKKKKKKK..........", "..........KWWWWWWWWWWK..........", "..........KWWKWWWWWKKW..........",
        "..........KWWKWWWWWKKW..........", "..........KWWWWWWWWWWK..........", "..........KKKKKKKKKKKK..........",
        "..........KSSSSSSSSSSK..........", "..........KSSSSSSSSSSK..........", "..........KSSSSSSSSSSK..........",
        "..........KSSSSSSSSSSK..........", "..........KSSSSSSSSSSK..........", "..........KSSSSSSSSSSK..........",
        "..........KSSSSSSSSSSK..........", "..........KSSSSSSSSSSK..........", "..........KSSSSSSSSSSK..........",
        "..........KSSSSSSSSSSK..........", "..........KSSSSSSSSSSK..........", "..........KSSSSSSSSSSK..........",
        "..........KSSSSSSSSSSK..........", "..........KSSSSSSSSSSK..........", "..........KSSSSSSSSSSK..........",
        "..........KSSSSSSSSSSK..........", "..........KSSSSSSSSSSK..........", "..........KSSSSSSSSSSK..........",
        "KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK", "................................"
    ],
    motorcade: [
        "................................", "................................", "................................",
        "................................", "................................", "................................",
        "...............KKKKK............", ".............KKYYYYYK...........", "............KYYYYYYYYK..........",
        "..........KKWWWWWWWWWWKK........", ".........KCCCCCCCCCCCCCCK.......", "........KCCCCCCCCCCCCCCCCK......",
        ".......KCCCCCCCCCCCCCCCCCK......", "......KBBBBBBBBBBBBBBBBBBBK.....", ".....KBBBBBBBBBBBBBBBBBBBBBK....",
        "....KBBBBBBBBBBBBBBBBBBBBBBBK...", "...KBBBBBBBBBBBBBBBBBBBBBBBBBK..", "..KBBBBBBBBBBBBBBBBBBBBBBBBBBBK.",
        ".KBBBBBBBBBBBBBBBBBBBBBBBBBBBBBK", "KBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBK", "KBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBK",
        "KBBBKKKKKBBBBBBBBBBBBBBBKKKKKBBK", "KBBKKKKKKKBBBBBBBBBBBBBKKKKKKKBK", "KBBKKWKWKKBBBBBBBBBBBBBKKWKWKKBK",
        "KBBKKKKKKKBBBBBBBBBBBBBKKKKKKKBK", "KBBBKKKKKBBBBBBBBBBBBBBBKKKKKBBK", "KBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBK",
        "KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK", "................................", "................................",
        "................................", "................................"
    ],
    keris: [
        "................................", "...............KK...............", "..............KYYK..............",
        "..............KYYK..............", ".............KYYK...............", ".............KYYK...............",
        "............KYYK................", "............KYYK................", "...........KYYK.................",
        "...........KYYK.................", "..........KYYK..................", "..........KYYK..................",
        ".........KYYK...................", ".........KYYK...................", "........KYYK....................",
        "........KYYK....................", ".......KYYK.....................", ".......KYYK.....................",
        "......KYYK......................", "......KYYK......................", ".....KKYYKK.....................",
        "....KRRRRRRK....................", "...KRRRRRRRRK...................", "..KRRRRRRRRRRK..................",
        ".KKKKKRRRRKKKK..................", "......KSSK......................", "......KSSK......................",
        "......KSSK......................", "......KSSK......................", ".......KK.......................",
        "................................", "................................"
    ]
};

// Use the original PNG artwork supplied for each historical object.
// Image smoothing is disabled when drawing to preserve pixel-art edges.
const spriteImages = {
    tunku: new Image(),
    bunga: new Image(),
    unionjack: new Image(),
    jalur: new Image(),
    clocktower: new Image(),
    motorcade: new Image(),
    keris: new Image()
};
const spriteOutlineCanvases = {};
spriteImages.tunku.src = '../assets/tar_.png';
spriteImages.bunga.src = '../assets/Bunga%20Raya.png';
spriteImages.unionjack.src = '../assets/union-jack.png';
spriteImages.jalur.src = '../assets/jalur-gemilang.png';
spriteImages.clocktower.src = '../assets/clocktower.png';
spriteImages.motorcade.src = '../assets/motorcade.png';
spriteImages.keris.src = '../assets/keris.png';
Object.values(spriteImages).forEach((image) => {
    image.addEventListener('load', () => {
        if (typeof drawCanvas === 'function') drawCanvas();
    });
});

function getSpriteOutlineCanvas(type, image) {
    if (spriteOutlineCanvases[type]) return spriteOutlineCanvases[type];
    const outline = document.createElement('canvas');
    outline.width = image.naturalWidth;
    outline.height = image.naturalHeight;
    const outlineCtx = outline.getContext('2d');
    outlineCtx.drawImage(image, 0, 0);
    outlineCtx.globalCompositeOperation = 'source-in';
    outlineCtx.fillStyle = '#0033a0';
    outlineCtx.fillRect(0, 0, outline.width, outline.height);
    spriteOutlineCanvases[type] = outline;
    return outline;
}

const stages = [
    {
        stage: 1,
        title: "1956 (Feb): The London Independence Talks",
        type: "enlargement",
        objectType: "tunku",
        historicalFact: "In February 1956, Tunku Abdul Rahman led the Independence Mission to London to negotiate Merdeka with the British Government.",
        objective: "Use enlargement to place Tunku Abdul Rahman on the target.",
        objectPoints: [{x: 1, y: 1}, {x: 3, y: 1}, {x: 3, y: 4}, {x: 1, y: 4}],
        targetK: 2,
        targetCenter: {x: 0, y: 0}
    },
    {
        stage: 2,
        title: "1956 (Feb 20): Announcement at Bandar Hilir, Melaka",
        type: "enlargement_negative",
        objectType: "bunga",
        historicalFact: "Upon returning from London, Tunku officially announced the Merdeka date at Padang Bandar Hilir, Melaka, where crowds welcomed him with flowers.",
        objective: "Use enlargement to place the Bunga Raya on the target.",
        objectPoints: [{x: 2, y: 2}, {x: 5, y: 2}, {x: 5, y: 5}, {x: 2, y: 5}],
        targetK: -1.5,
        targetCenter: {x: 1, y: 0}
    },
    {
        stage: 3,
        title: "1957 (Aug 30, 11:58 PM): Lowering the Union Jack",
        type: "rotation",
        objectType: "unionjack",
        historicalFact: "At Dataran Merdeka at midnight, the British Union Jack was rotated down from its mast for the last time.",
        objective: "Use rotation to place the Union Jack on the target.",
        objectPoints: [{x: -6, y: 2}, {x: -2, y: 2}, {x: -2, y: 5}, {x: -6, y: 5}],
        targetAngle: 90,
        targetDir: "cw",
        targetCenter: {x: -1, y: 1}
    },
    {
        stage: 4,
        title: "1957 (Aug 31, 12:00 AM): Hoisting the Malayan Flag",
        type: "rotation",
        objectType: "jalur",
        historicalFact: "As midnight struck on August 31, 1957, the flag of Malaya was rotated upward to the top of the flagpole.",
        objective: "Use rotation to place the Jalur Gemilang on the target.",
        objectPoints: [{x: 2, y: -6}, {x: 6, y: -6}, {x: 6, y: -3}, {x: 2, y: -3}],
        targetAngle: 180,
        targetDir: "cw",
        targetCenter: {x: 0, y: -1}
    },
    {
        stage: 5,
        title: "1957 (Aug 31): Sultan Abdul Samad Building Symmetry",
        type: "reflection",
        objectType: "clocktower",
        historicalFact: "The historic Sultan Abdul Samad Clock Tower overlooked Dataran Merdeka as thousands gathered to celebrate national sovereignty.",
        objective: "Use reflection to place the Clock Tower on the target.",
        objectPoints: [{x: -5, y: -5}, {x: -2, y: -5}, {x: -2, y: -1}, {x: -5, y: -1}],
        targetRefType: "x_line", 
        targetRefVal: 0
    },
    {
        stage: 6,
        title: "1957 (Aug 31, 8:15 AM): Arrival of the Royal Motorcade",
        type: "reflection",
        objectType: "motorcade",
        historicalFact: "The Royal motorcade carrying Tunku Abdul Rahman moved along the streets of Kuala Lumpur toward the Merdeka celebration venue.",
        objective: "Use reflection to place the motorcade on the target.",
        objectPoints: [{x: -7, y: 3}, {x: -3, y: 3}, {x: -3, y: 6}, {x: -7, y: 6}],
        targetRefType: "y-axis",
        targetRefVal: 0
    },
    {
        stage: 7,
        title: "1957 (Aug 31, 9:30 AM): The 7 Proclamations of MERDEKA!",
        type: "translation",
        objectType: "keris",
        historicalFact: "Tunku raised his hand seven times shouting 'MERDEKA!'. Move the keris to complete this final challenge.",
        objective: "Use translation to place the keris on the target.",
        objectPoints: [{x: -5, y: -2}, {x: -2, y: -2}, {x: -2, y: 2}, {x: -5, y: 2}],
        targetTx: 5,
        targetTy: 3
    }
];

function gridToPixel(gx, gy) {
    return {
        x: canvas.width / 2 + gx * unitPixels,
        y: canvas.height / 2 - gy * unitPixels
    };
}

function pixelToGrid(px, py) {
    return {
        x: Math.round((px - canvas.width / 2) / unitPixels),
        y: Math.round((canvas.height / 2 - py) / unitPixels)
    };
}

function applyEnlargement(pts, k, center) {
    return pts.map(pt => ({
        x: center.x + k * (pt.x - center.x),
        y: center.y + k * (pt.y - center.y)
    }));
}

function applyRotation(pts, angleDeg, dir, center) {
    let rad = (angleDeg * Math.PI) / 180;
    if (dir === 'cw') rad = -rad;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    return pts.map(pt => {
        const dx = pt.x - center.x;
        const dy = pt.y - center.y;
        return {
            x: Math.round((center.x + dx * cos - dy * sin) * 100) / 100,
            y: Math.round((center.y + dx * sin + dy * cos) * 100) / 100
        };
    });
}

function applyReflection(pts, refType, refVal) {
    return pts.map(pt => {
        let rx = pt.x, ry = pt.y;
        if (refType === 'x-axis') { ry = -pt.y; }
        else if (refType === 'y-axis') { rx = -pt.x; }
        else if (refType === 'y=x') { rx = pt.y; ry = pt.x; }
        else if (refType === 'y=-x') { rx = -pt.y; ry = -pt.x; }
        else if (refType === 'x_line') { rx = 2 * refVal - pt.x; }
        else if (refType === 'y_line') { ry = 2 * refVal - pt.y; }
        return { x: rx, y: ry };
    });
}

function applyTranslation(pts, tx, ty) {
    return pts.map(pt => ({ x: pt.x + tx, y: pt.y + ty }));
}

function applyCombinedStep(pts, step) {
    const type = state[`combo${step}_type`];
    if (type === 'translation') {
        return applyTranslation(pts, state[`combo${step}_tx`], state[`combo${step}_ty`]);
    }
    if (type === 'rotation') {
        return applyRotation(pts, state[`combo${step}_angle`], state[`combo${step}_dir`], {
            x: state[`combo${step}_rcx`], y: state[`combo${step}_rcy`]
        });
    }
    return pts;
}

function getBoundingBox(pts) {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    pts.forEach(p => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
    });
    return { minX, maxX, minY, maxY };
}

function draw32x32PixelSprite(ctx, type, box, transform = {}) {
    const { rotationDegrees = 0, flipX = false, flipY = false } = transform;
    const boxPxMin = gridToPixel(box.minX, box.maxY);
    const boxPxMax = gridToPixel(box.maxX, box.minY);

    const rectWidth = Math.abs(boxPxMax.x - boxPxMin.x);
    const rectHeight = Math.abs(boxPxMax.y - boxPxMin.y);

    const image = spriteImages[type];
    if (image && image.complete && image.naturalWidth) {
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        const centerX = boxPxMin.x + rectWidth / 2;
        const centerY = boxPxMin.y + rectHeight / 2;
        const quarterTurn = Math.abs(rotationDegrees) % 180 === 90;
        const imageWidth = quarterTurn ? rectHeight : rectWidth;
        const imageHeight = quarterTurn ? rectWidth : rectHeight;
        ctx.translate(centerX, centerY);
        ctx.rotate(rotationDegrees * Math.PI / 180);
        ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
        const outline = getSpriteOutlineCanvas(type, image);
        const outlineThickness = 2;
        for (const [xOffset, yOffset] of [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]) {
            ctx.drawImage(outline, -imageWidth / 2 + xOffset * outlineThickness, -imageHeight / 2 + yOffset * outlineThickness, imageWidth, imageHeight);
        }
        ctx.drawImage(image, -imageWidth / 2, -imageHeight / 2, imageWidth, imageHeight);
        ctx.restore();
        return;
    }

    const spriteMatrix = sprites32x32[type];
    if (!spriteMatrix) return;

    const pixelSizeX = rectWidth / 32;
    const pixelSizeY = rectHeight / 32;

    ctx.save();
    ctx.translate(boxPxMin.x, boxPxMin.y);

    for (let r = 0; r < 32; r++) {
        const row = spriteMatrix[r];
        for (let c = 0; c < 32; c++) {
            const charCode = row[c];
            const color = P[charCode];
            if (color) {
                ctx.fillStyle = color;
                ctx.fillRect(c * pixelSizeX, r * pixelSizeY, pixelSizeX + 0.4, pixelSizeY + 0.4);
            }
        }
    }
    ctx.restore();
}

function drawShapeOnGrid(points, fillColor, strokeColor, isDashed = false) {
    if (!points || points.length === 0) return;
    ctx.save();
    ctx.beginPath();
    if (isDashed) ctx.setLineDash([4, 4]);

    const startPx = gridToPixel(points[0].x, points[0].y);
    ctx.moveTo(startPx.x, startPx.y);

    for (let i = 1; i < points.length; i++) {
        const px = gridToPixel(points[i].x, points[i].y);
        ctx.lineTo(px.x, px.y);
    }
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
}

function getTransformedPointsForStage(stg, isTarget = false) {
    let pts = stg.objectPoints;

    if (isTarget) {
        if (stg.type === 'enlargement' || stg.type === 'enlargement_negative') {
            return applyEnlargement(pts, stg.targetK, stg.targetCenter);
        } else if (stg.type === 'rotation') {
            return applyRotation(pts, stg.targetAngle, stg.targetDir, stg.targetCenter);
        } else if (stg.type === 'reflection') {
            return applyReflection(pts, stg.targetRefType, stg.targetRefVal);
        } else if (stg.type === 'translation') {
            return applyTranslation(pts, stg.targetTx, stg.targetTy);
        } else if (stg.type === 'combined') {
            let step1 = applyTranslation(pts, stg.targetTx, stg.targetTy);
            return applyRotation(step1, stg.targetAngle, stg.targetDir, stg.targetCenter);
        }
    } else {
        if (stg.type === 'enlargement' || stg.type === 'enlargement_negative') {
            return applyEnlargement(pts, state.k, {x: state.cx, y: state.cy});
        } else if (stg.type === 'rotation') {
            return applyRotation(pts, state.angle, state.dir, {x: state.rcx, y: state.rcy});
        } else if (stg.type === 'reflection') {
            return applyReflection(pts, state.refType, state.refVal);
        } else if (stg.type === 'translation') {
            return applyTranslation(pts, state.tx, state.ty);
        } else if (stg.type === 'combined') {
            return applyCombinedStep(applyCombinedStep(pts, 1), 2);
        }
    }
    return pts;
}

function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const stg = stages[currentStage];

    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#0033a0';
    ctx.setLineDash([1, 4]);
    for (let i = 0; i <= GRID_UNITS; i++) {
        ctx.beginPath(); ctx.moveTo(i * unitPixels, 0); ctx.lineTo(i * unitPixels, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * unitPixels); ctx.lineTo(canvas.width, i * unitPixels); ctx.stroke();
    }
    ctx.restore();

    const originPx = gridToPixel(0, 0);
    ctx.lineWidth = 2; ctx.strokeStyle = '#0033a0';
    ctx.beginPath(); ctx.moveTo(0, originPx.y); ctx.lineTo(canvas.width, originPx.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(originPx.x, 0); ctx.lineTo(originPx.x, canvas.height); ctx.stroke();

    ctx.fillStyle = '#0033a0'; ctx.font = '12px VT323'; ctx.textAlign = 'center';
    for (let g = -10; g <= 10; g += 2) {
        if (g === 0) continue;
        const p = gridToPixel(g, g);
        ctx.fillText(g.toString(), p.x, originPx.y + 14);
        ctx.fillText(g.toString(), originPx.x - 12, p.y + 4);
    }

    const origBox = getBoundingBox(stg.objectPoints);
    drawShapeOnGrid(stg.objectPoints, 'rgba(255, 243, 167, 0.6)', '#ffdf00', false);
    draw32x32PixelSprite(ctx, stg.objectType, origBox);

    const targetShape = getTransformedPointsForStage(stg, true);
    const targetBox = getBoundingBox(targetShape);
    drawShapeOnGrid(targetShape, 'rgba(206, 17, 38, 0.25)', '#ce1126', true);
    draw32x32PixelSprite(ctx, stg.objectType, targetBox, getSpriteTransform(stg, true));

    if (stg.type === 'combined' && state.combo1_type) {
        const stepOneShape = applyCombinedStep(stg.objectPoints, 1);
        const stepOneBox = getBoundingBox(stepOneShape);
        drawShapeOnGrid(stepOneShape, 'rgba(255, 223, 0, 0.22)', '#ffdf00', true);
        draw32x32PixelSprite(ctx, stg.objectType, stepOneBox, getSpriteTransform(stg, false, true));
    }

    const userShape = getTransformedPointsForStage(stg, false);
    const userBox = getBoundingBox(userShape);
    drawShapeOnGrid(userShape, 'rgba(0, 51, 160, 0.35)', '#0033a0', false);
    draw32x32PixelSprite(ctx, stg.objectType, userBox, getSpriteTransform(stg));

    drawTransformationGuides(stg, stg.objectPoints, userShape);

    if (stg.type === 'enlargement' || stg.type === 'enlargement_negative') {
        const cp = gridToPixel(state.cx, state.cy);
        ctx.fillStyle = '#ffdf00';
        ctx.beginPath(); ctx.arc(cp.x, cp.y, 7, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#0033a0'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = '#0033a0'; ctx.font = '14px VT323';
        ctx.fillText(`Center (${state.cx}, ${state.cy})`, cp.x + 10, cp.y - 8);
    } else if (stg.type === 'rotation') {
        const cp = gridToPixel(state.rcx, state.rcy);
        ctx.fillStyle = '#ffdf00';
        ctx.beginPath(); ctx.arc(cp.x, cp.y, 7, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#0033a0'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = '#0033a0'; ctx.font = '14px VT323';
        ctx.fillText(`Pivot (${state.rcx}, ${state.rcy})`, cp.x + 10, cp.y - 8);
    } else if (stg.type === 'reflection') {
        ctx.save();
        ctx.strokeStyle = '#0033a0'; ctx.lineWidth = 3; ctx.setLineDash([6, 6]);
        if (state.refType === 'x-axis') {
            const p = gridToPixel(0, 0); ctx.beginPath(); ctx.moveTo(0, p.y); ctx.lineTo(canvas.width, p.y); ctx.stroke();
        } else if (state.refType === 'y-axis') {
            const p = gridToPixel(0, 0); ctx.beginPath(); ctx.moveTo(p.x, 0); ctx.lineTo(p.x, canvas.height); ctx.stroke();
        } else if (state.refType === 'x_line') {
            const p = gridToPixel(state.refVal, 0); ctx.beginPath(); ctx.moveTo(p.x, 0); ctx.lineTo(p.x, canvas.height); ctx.stroke();
        } else if (state.refType === 'y_line') {
            const p = gridToPixel(0, state.refVal); ctx.beginPath(); ctx.moveTo(0, p.y); ctx.lineTo(canvas.width, p.y); ctx.stroke();
        }
        ctx.restore();
    } else if (stg.type === 'combined') {
        const rotationStep = state.combo2_type === 'rotation' ? 2 : (state.combo1_type === 'rotation' ? 1 : null);
        if (rotationStep) {
            const cp = gridToPixel(state[`combo${rotationStep}_rcx`], state[`combo${rotationStep}_rcy`]);
            ctx.fillStyle = '#ffdf00';
            ctx.beginPath(); ctx.arc(cp.x, cp.y, 7, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#0033a0'; ctx.lineWidth = 2; ctx.stroke();
        }
    }
}

function drawTransformationGuides(stg, originalPoints, transformedPoints) {
    let center = null;
    if (stg.type === 'enlargement' || stg.type === 'enlargement_negative') center = { x: state.cx, y: state.cy };
    if (stg.type === 'rotation') center = { x: state.rcx, y: state.rcy };
    if (!center) return;

    const centerPx = gridToPixel(center.x, center.y);
    ctx.save();
    ctx.strokeStyle = '#0033a0';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 5]);
    if (stg.type === 'rotation') {
        // One object point and its image point meet at the pivot, making the rotation angle clear.
        const start = gridToPixel(originalPoints[0].x, originalPoints[0].y);
        const end = gridToPixel(transformedPoints[0].x, transformedPoints[0].y);
        ctx.beginPath();
        ctx.moveTo(centerPx.x, centerPx.y);
        ctx.lineTo(start.x, start.y);
        ctx.moveTo(centerPx.x, centerPx.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        const radius = Math.min(34, Math.hypot(start.x - centerPx.x, start.y - centerPx.y) * 0.35);
        const startAngle = Math.atan2(start.y - centerPx.y, start.x - centerPx.x);
        const canvasAngle = rotationForCanvas(state.angle, state.dir) * Math.PI / 180;
        const endAngle = startAngle + canvasAngle;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(centerPx.x, centerPx.y, radius, startAngle, endAngle, state.dir === 'ccw');
        ctx.stroke();

        const labelAngle = startAngle + canvasAngle / 2;
        ctx.fillStyle = '#0033a0';
        ctx.font = '16px VT323';
        ctx.textAlign = 'center';
        ctx.fillText(`${state.angle}°`, centerPx.x + Math.cos(labelAngle) * (radius + 13), centerPx.y + Math.sin(labelAngle) * (radius + 13));
        ctx.restore();
        return;
    }

    originalPoints.forEach((point, index) => {
        const start = gridToPixel(point.x, point.y);
        const end = gridToPixel(transformedPoints[index].x, transformedPoints[index].y);
        ctx.beginPath();
        ctx.moveTo(centerPx.x, centerPx.y);
        ctx.lineTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        if (stg.type === 'enlargement' || stg.type === 'enlargement_negative') {
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }
    });
    ctx.restore();
}

function rotationForCanvas(angle, direction) {
    // The canvas y-axis points downward, so mathematical CCW is negative here.
    return direction === 'ccw' ? -angle : angle;
}

function getReflectionSpriteTransform(refType) {
    if (refType === 'x-axis' || refType === 'y_line') return { flipY: true };
    if (refType === 'y-axis' || refType === 'x_line') return { flipX: true };
    return {};
}

function getSpriteTransform(stg, isTarget = false, stepOneOnly = false) {
    if (stg.type === 'enlargement' || stg.type === 'enlargement_negative') {
        const scaleFactor = isTarget ? stg.targetK : state.k;
        return { rotationDegrees: scaleFactor < 0 ? 180 : 0 };
    }
    if (stg.type === 'rotation') {
        return { rotationDegrees: isTarget
            ? rotationForCanvas(stg.targetAngle, stg.targetDir)
            : rotationForCanvas(state.angle, state.dir) };
    }
    if (stg.type === 'reflection') {
        return getReflectionSpriteTransform(isTarget ? stg.targetRefType : state.refType);
    }
    if (stg.type !== 'combined') return {};

    if (isTarget) return { rotationDegrees: rotationForCanvas(stg.targetAngle, stg.targetDir) };
    let rotation = 0;
    if (state.combo1_type === 'rotation') rotation += rotationForCanvas(state.combo1_angle, state.combo1_dir);
    if (!stepOneOnly && state.combo2_type === 'rotation') rotation += rotationForCanvas(state.combo2_angle, state.combo2_dir);
    return { rotationDegrees: rotation };
}

function renderControlPanel() {
    const container = document.getElementById('controls-container');
    const stg = stages[currentStage];
    document.getElementById('type-header').innerText = `STAGE ${stg.stage}: ${stg.type.toUpperCase()}`;

    let html = '';

    if (stg.type === 'enlargement' || stg.type === 'enlargement_negative') {
        html = `
            <div class="p-3 border flex flex-col gap-2" style="background-color: var(--color-dark-purple); border-color: var(--gold);">
                <label class="pixel-font text-xs" style="color: var(--color-pale-mint);">SCALE FACTOR (k):</label>
                <input type="number" id="scale-input" min="-3" max="4" step="0.5" value="${state.k}" class="w-full py-2 text-sm">
            </div>
            <div class="p-3 border flex flex-col gap-2" style="background-color: var(--color-dark-purple); border-color: var(--gold);">
                <label class="pixel-font text-xs" style="color: var(--color-pale-mint);">CENTER P(x, y):</label>
                <div class="grid grid-cols-2 gap-2">
                    <input type="number" id="cx-input" min="-10" max="10" value="${state.cx}" placeholder="X" class="w-full py-2 text-sm">
                    <input type="number" id="cy-input" min="-10" max="10" value="${state.cy}" placeholder="Y" class="w-full py-2 text-sm">
                </div>
            </div>
        `;
    } else if (stg.type === 'rotation') {
        html = `
            <div class="p-3 border flex flex-col gap-2" style="background-color: var(--color-dark-purple); border-color: var(--gold);">
                <label class="pixel-font text-xs" style="color: var(--color-pale-mint);">ANGLE & DIRECTION:</label>
                <div class="grid grid-cols-2 gap-2">
                    <select id="angle-select" class="py-2 text-xs">
                        <option value="90" ${state.angle===90?'selected':''}>90°</option>
                        <option value="180" ${state.angle===180?'selected':''}>180°</option>
                        <option value="270" ${state.angle===270?'selected':''}>270°</option>
                    </select>
                    <select id="dir-select" class="py-2 text-xs">
                        <option value="cw" ${state.dir==='cw'?'selected':''}>Clockwise ↻</option>
                        <option value="ccw" ${state.dir==='ccw'?'selected':''}>Anti-CW ↺</option>
                    </select>
                </div>
            </div>
            <div class="p-3 border flex flex-col gap-2" style="background-color: var(--color-dark-purple); border-color: var(--gold);">
                <label class="pixel-font text-xs" style="color: var(--color-pale-mint);">PIVOT CENTER (x, y):</label>
                <div class="grid grid-cols-2 gap-2">
                    <input type="number" id="rcx-input" min="-10" max="10" value="${state.rcx}" class="w-full py-2 text-sm">
                    <input type="number" id="rcy-input" min="-10" max="10" value="${state.rcy}" class="w-full py-2 text-sm">
                </div>
            </div>
        `;
    } else if (stg.type === 'reflection') {
        html = `
            <div class="p-3 border flex flex-col gap-2" style="background-color: var(--color-dark-purple); border-color: var(--gold);">
                <label class="pixel-font text-xs" style="color: var(--color-pale-mint);">MIRROR AXIS / LINE:</label>
                <select id="ref-type-select" class="py-2 text-xs w-full">
                    <option value="x-axis" ${state.refType==='x-axis'?'selected':''}>x-axis (y = 0)</option>
                    <option value="y-axis" ${state.refType==='y-axis'?'selected':''}>y-axis (x = 0)</option>
                    <option value="x_line" ${state.refType==='x_line'?'selected':''}>Line x = c</option>
                    <option value="y_line" ${state.refType==='y_line'?'selected':''}>Line y = c</option>
                </select>
                <div id="ref-val-box" class="mt-2 flex items-center gap-2">
                    <span class="text-xs" style="color: var(--gold);">Line Value c:</span>
                    <input type="number" id="ref-val-input" min="-10" max="10" value="${state.refVal}" class="w-full py-1 text-sm">
                </div>
            </div>
        `;
    } else if (stg.type === 'translation') {
        html = `
            <div class="p-3 border flex flex-col gap-2" style="background-color: var(--color-dark-purple); border-color: var(--gold);">
                <label class="pixel-font text-xs" style="color: var(--color-pale-mint);">TRANSLATION VECTOR (x, y):</label>
                <div class="grid grid-cols-2 gap-2">
                    <input type="number" id="tx-input" min="-15" max="15" value="${state.tx}" placeholder="X" class="w-full py-2 text-sm">
                    <input type="number" id="ty-input" min="-15" max="15" value="${state.ty}" placeholder="Y" class="w-full py-2 text-sm">
                </div>
            </div>
        `;
    } else if (stg.type === 'combined') {
        html = `
            <div class="p-2 border flex flex-col gap-1" style="background-color: var(--color-dark-purple); border-color: var(--gold);">
                <label class="pixel-font text-[10px]" style="color: var(--yellow);">STEP 1: PICK A TRANSFORMATION</label>
                <select id="c1-type" class="py-1 text-[10px]">
                    <option value="" ${state.combo1_type===''?'selected':''}>Choose transformation</option>
                    <option value="translation" ${state.combo1_type==='translation'?'selected':''}>Translation</option>
                    <option value="rotation" ${state.combo1_type==='rotation'?'selected':''}>Rotation</option>
                </select>
                ${renderCombinedInputs(1)}
            </div>
            <div class="p-2 border flex flex-col gap-1" style="background-color: var(--color-dark-purple); border-color: var(--gold);">
                <label class="pixel-font text-[10px]" style="color: var(--yellow);">STEP 2: PICK A TRANSFORMATION</label>
                <select id="c2-type" class="py-1 text-[10px]">
                    <option value="" ${state.combo2_type===''?'selected':''}>Choose transformation</option>
                    <option value="translation" ${state.combo2_type==='translation'?'selected':''}>Translation</option>
                    <option value="rotation" ${state.combo2_type==='rotation'?'selected':''}>Rotation</option>
                </select>
                ${renderCombinedInputs(2)}
            </div>
        `;
    }

    container.innerHTML = html;
    attachInputListeners();
}

function renderCombinedInputs(step) {
    const type = state[`combo${step}_type`];
    const prefix = `c${step}`;
    if (type === 'translation') {
        return `<div class="grid grid-cols-2 gap-2"><input type="number" id="${prefix}-tx" min="-15" max="15" value="${state[`combo${step}_tx`]}" placeholder="X" class="w-full py-1 text-xs"><input type="number" id="${prefix}-ty" min="-15" max="15" value="${state[`combo${step}_ty`]}" placeholder="Y" class="w-full py-1 text-xs"></div>`;
    }
    if (type === 'rotation') {
        return `<div class="grid grid-cols-2 gap-2 mb-1"><select id="${prefix}-angle" class="py-1 text-[10px]"><option value="90" ${state[`combo${step}_angle`]===90?'selected':''}>90°</option><option value="180" ${state[`combo${step}_angle`]===180?'selected':''}>180°</option><option value="270" ${state[`combo${step}_angle`]===270?'selected':''}>270°</option></select><select id="${prefix}-dir" class="py-1 text-[10px]"><option value="cw" ${state[`combo${step}_dir`]==='cw'?'selected':''}>CW ↻</option><option value="ccw" ${state[`combo${step}_dir`]==='ccw'?'selected':''}>CCW ↺</option></select></div><div class="grid grid-cols-2 gap-2"><input type="number" id="${prefix}-rcx" min="-10" max="10" value="${state[`combo${step}_rcx`]}" placeholder="Center X" class="w-full py-1 text-xs"><input type="number" id="${prefix}-rcy" min="-10" max="10" value="${state[`combo${step}_rcy`]}" placeholder="Center Y" class="w-full py-1 text-xs"></div>`;
    }
    return '<p class="text-xs" style="color: var(--color-pale-mint);">Choose a transformation to set its values.</p>';
}

function attachInputListeners() {
    const stg = stages[currentStage];

    if (stg.type === 'enlargement' || stg.type === 'enlargement_negative') {
        document.getElementById('scale-input').addEventListener('input', (e) => { state.k = parseFloat(e.target.value) || 0; drawCanvas(); });
        document.getElementById('cx-input').addEventListener('input', (e) => { state.cx = parseInt(e.target.value) || 0; drawCanvas(); });
        document.getElementById('cy-input').addEventListener('input', (e) => { state.cy = parseInt(e.target.value) || 0; drawCanvas(); });
    } else if (stg.type === 'rotation') {
        document.getElementById('angle-select').addEventListener('change', (e) => { state.angle = parseInt(e.target.value); drawCanvas(); });
        document.getElementById('dir-select').addEventListener('change', (e) => { state.dir = e.target.value; drawCanvas(); });
        document.getElementById('rcx-input').addEventListener('input', (e) => { state.rcx = parseInt(e.target.value) || 0; drawCanvas(); });
        document.getElementById('rcy-input').addEventListener('input', (e) => { state.rcy = parseInt(e.target.value) || 0; drawCanvas(); });
    } else if (stg.type === 'reflection') {
        document.getElementById('ref-type-select').addEventListener('change', (e) => { state.refType = e.target.value; drawCanvas(); });
        document.getElementById('ref-val-input').addEventListener('input', (e) => { state.refVal = parseInt(e.target.value) || 0; drawCanvas(); });
    } else if (stg.type === 'translation') {
        document.getElementById('tx-input').addEventListener('input', (e) => { state.tx = parseInt(e.target.value) || 0; drawCanvas(); });
        document.getElementById('ty-input').addEventListener('input', (e) => { state.ty = parseInt(e.target.value) || 0; drawCanvas(); });
    } else if (stg.type === 'combined') {
        [1, 2].forEach((step) => {
            const prefix = `c${step}`;
            const typeSelect = document.getElementById(`${prefix}-type`);
            typeSelect.addEventListener('change', (e) => {
                state[`combo${step}_type`] = e.target.value;
                renderControlPanel();
                drawCanvas();
            });
            const bindNumber = (field, key) => {
                const input = document.getElementById(`${prefix}-${field}`);
                if (input) input.addEventListener('input', (e) => { state[`combo${step}_${key}`] = parseInt(e.target.value) || 0; drawCanvas(); });
            };
            bindNumber('tx', 'tx'); bindNumber('ty', 'ty');
            bindNumber('rcx', 'rcx'); bindNumber('rcy', 'rcy');
            const angle = document.getElementById(`${prefix}-angle`);
            if (angle) angle.addEventListener('change', (e) => { state[`combo${step}_angle`] = parseInt(e.target.value); drawCanvas(); });
            const dir = document.getElementById(`${prefix}-dir`);
            if (dir) dir.addEventListener('change', (e) => { state[`combo${step}_dir`] = e.target.value; drawCanvas(); });
        });
    }
}

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const gridPos = pixelToGrid(clickX * scaleX, clickY * scaleY);

    const stg = stages[currentStage];
    if (stg.type === 'enlargement' || stg.type === 'enlargement_negative') {
        state.cx = gridPos.x; state.cy = gridPos.y;
    } else if (stg.type === 'rotation') {
        state.rcx = gridPos.x; state.rcy = gridPos.y;
    } else if (stg.type === 'combined') {
        const rotationStep = state.combo2_type === 'rotation' ? 2 : (state.combo1_type === 'rotation' ? 1 : null);
        if (rotationStep) {
            state[`combo${rotationStep}_rcx`] = gridPos.x;
            state[`combo${rotationStep}_rcy`] = gridPos.y;
        }
    }

    renderControlPanel();
    drawCanvas();
});

function checkAnswer() {
    const stg = stages[currentStage];
    const targetPts = getTransformedPointsForStage(stg, true);
    const userPts = getTransformedPointsForStage(stg, false);

    let isCorrect = !(stg.type === 'combined' && (state.combo1_type !== 'translation' || state.combo2_type !== 'rotation'));
    for (let i = 0; i < targetPts.length; i++) {
        if (Math.abs(targetPts[i].x - userPts[i].x) > 0.1 || Math.abs(targetPts[i].y - userPts[i].y) > 0.1) {
            isCorrect = false;
            break;
        }
    }

    if (isCorrect) {
        score += 300;
        document.getElementById('score-val').innerText = score.toString().padStart(4, '0');
        showToast("STAGE CLEAR!", `You successfully aligned Stage ${stg.stage}!`);
    } else {
        alert("Incorrect positioning! Adjust your inputs on the control panel to match the red target.");
    }
}

function showToast(title, msg) {
    const modal = document.getElementById('toast-modal');
    document.getElementById('toast-heading').innerText = title;
    document.getElementById('toast-text').innerText = msg;
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100');
}

function hideToast() {
    const modal = document.getElementById('toast-modal');
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.classList.remove('opacity-100');
}

function goToNextLevel() {
    hideToast();
    if (currentStage < stages.length - 1) {
        currentStage++;
        loadStage(currentStage);
    } else {
        alert("CONGRATULATIONS! You completed all 7 Merdeka stages!");
        currentStage = 0;
        score = 0;
        document.getElementById('score-val').innerText = "0000";
        loadStage(0);
    }
}

function resetLevel() {
    hideToast();
    loadStage(currentStage);
}

function loadStage(idx) {
    const stg = stages[idx];
    document.getElementById('level-num').innerText = `${stg.stage} / ${stages.length}`;
    document.getElementById('stage-title-text').innerText = stg.title;
    document.getElementById('historical-fact-text').innerText = stg.historicalFact;
    document.getElementById('stage-objective-text').innerText = stg.objective;

    state.k = 1.0; state.cx = 0; state.cy = 0;
    state.angle = 90; state.dir = 'cw'; state.rcx = 0; state.rcy = 0;
    state.refType = 'x-axis'; state.refVal = 0;
    state.tx = 0; state.ty = 0;
    state.combo1_type = ''; state.combo1_tx = 0; state.combo1_ty = 0; state.combo1_angle = 90; state.combo1_dir = 'cw'; state.combo1_rcx = 0; state.combo1_rcy = 0;
    state.combo2_type = ''; state.combo2_tx = 0; state.combo2_ty = 0; state.combo2_angle = 90; state.combo2_dir = 'cw'; state.combo2_rcx = 0; state.combo2_rcy = 0;

    renderControlPanel();
    drawCanvas();
}

window.addEventListener('load', () => {
    loadStage(0);
});