const canvas = document.getElementById("transformCanvas"),
  ctx = canvas.getContext("2d"),
  upload = document.getElementById("imageUpload"),
  emptyMessage = document.getElementById("emptyMessage"),
  ruleControls = document.getElementById("ruleControls"),
  ruleReadout = document.getElementById("ruleReadout"),
  historyList = document.getElementById("historyList"),
  historyCount = document.getElementById("historyCount");
let image = null,
  useDemo = false,
  tool = "enlargement",
  transform = {
    scale: 2,
    mirror: "vertical",
    mirrorValue: 0,
    angle: 90,
    direction: "anticlockwise",
    centreX: 0,
    centreY: 0,
    dx: 2,
    dy: 1,
    objectX: 0,
    objectY: 0,
  },
  gridState,
  history = [],
  justApplied = false;
const points = (label = "PUSAT TRANSFORMASI") =>
  `<p class="field-label point-heading">${label}</p><div class="field-row"><label><span class="field-label">x</span><input class="control-field" id="centreX" type="number" value="${transform.centreX}"></label><label><span class="field-label">y</span><input class="control-field" id="centreY" type="number" value="${transform.centreY}"></label></div>`;
const toolDetails = {
  enlargement: () =>
    `<label class="field-label">FAKTOR SKALA (k)</label><input class="control-field" id="scale" type="number" value="${transform.scale}" step="0.1" min="-3" max="4">${points()}`,
  reflection: () =>
    `<label class="field-label">GARIS PANTULAN</label><select class="control-field" id="mirror"><option value="vertical">mencancang: x = a</option><option value="horizontal">mengufuk: y = b</option></select><label class="field-label" id="mirrorValueLabel">NILAI (a)</label><input class="control-field" id="mirrorValue" type="number" value="${transform.mirrorValue}">`,
  rotation: () =>
    `<label class="field-label">SUDUT</label><select class="control-field" id="angle"><option value="90">90°</option><option value="180">180°</option><option value="270">270°</option></select><label class="field-label">ARAH</label><select class="control-field" id="direction"><option value="anticlockwise">lawan arah jam</option><option value="clockwise">mengikut arah jam</option></select>${points()}`,
  translation: () =>
    `<div class="field-row"><label><span class="field-label">KANAN (a)</span><input class="control-field" id="dx" type="number" value="${transform.dx}"></label><label><span class="field-label">ATAS (b)</span><input class="control-field" id="dy" type="number" value="${transform.dy}"></label></div>`,
};
function read() {
  const n = (id) => Number(document.getElementById(id)?.value) || 0;
  if (tool === "enlargement") {
    transform.scale = n("scale");
    transform.centreX = n("centreX");
    transform.centreY = n("centreY");
  }
  if (tool === "reflection") {
    transform.mirror = document.getElementById("mirror").value;
    transform.mirrorValue = n("mirrorValue");
  }
  if (tool === "rotation") {
    transform.angle = n("angle");
    transform.direction = document.getElementById("direction").value;
    transform.centreX = n("centreX");
    transform.centreY = n("centreY");
  }
  if (tool === "translation") {
    transform.dx = n("dx");
    transform.dy = n("dy");
  }
  transform.objectX = n("objectX");
  transform.objectY = n("objectY");
  let s =
    tool === "enlargement"
      ? `PEMBESARAN, k = ${transform.scale}, PUSAT (${transform.centreX}, ${transform.centreY})`
      : tool === "reflection"
        ? `PANTULAN PADA ${transform.mirror === "vertical" ? "x" : "y"} = ${transform.mirrorValue}`
        : tool === "rotation"
          ? `PUTARAN ${transform.angle}° ${transform.direction === "anticlockwise" ? "LAWAN ARAH JAM" : "MENGIKUT ARAH JAM"}, PUSAT (${transform.centreX}, ${transform.centreY})`
          : `TRANSLASI (${transform.dx}, ${transform.dy})`;
  ruleReadout.textContent = s;
}
function controls() {
  ruleControls.innerHTML = toolDetails[tool]();
  if (tool === "reflection") {
    document.getElementById("mirror").value = transform.mirror;
    document.getElementById("mirror").addEventListener("change", () => {
      transform.mirror = document.getElementById("mirror").value;
      document.getElementById("mirrorValueLabel").textContent =
        transform.mirror === "vertical" ? "NILAI (a)" : "NILAI (b)";
      read();
      draw();
    });
  }
  if (tool === "rotation") {
    document.getElementById("angle").value = transform.angle;
    document.getElementById("direction").value = transform.direction;
  }
  ruleControls.querySelectorAll("input,select").forEach((x) =>
    x.addEventListener("input", () => {
      justApplied = false;
      read();
      draw();
    }),
  );
  read();
}
function applyPoint(p, t) {
  let x = p.x,
    y = p.y;
  if (t.kind === "enlargement") {
    x = t.centreX + t.scale * (x - t.centreX);
    y = t.centreY + t.scale * (y - t.centreY);
  }
  if (t.kind === "reflection") {
    if (t.mirror === "vertical") x = 2 * t.mirrorValue - x;
    else y = 2 * t.mirrorValue - y;
  }
  if (t.kind === "rotation") {
    let dx = x - t.centreX,
      dy = y - t.centreY,
      a = ((t.direction === "clockwise" ? -1 : 1) * t.angle * Math.PI) / 180;
    x = t.centreX + dx * Math.cos(a) - dy * Math.sin(a);
    y = t.centreY + dx * Math.sin(a) + dy * Math.cos(a);
  }
  if (t.kind === "translation") {
    x += t.dx;
    y += t.dy;
  }
  return { x, y };
}
function transformedAnchor() {
  let p = { x: transform.objectX, y: transform.objectY };
  history.forEach((t) => (p = applyPoint(p, t)));
  if (!justApplied) p = applyPoint(p, { ...transform, kind: tool });
  return p;
}
function grid() {
  const w = canvas.width,
    h = canvas.height,
    cx = w / 2,
    cy = h / 2,
    q = transformedAnchor(),
    extra = tool === "enlargement" ? Math.abs(transform.scale) * 3 : 3,
    extent = Math.max(
      5,
      Math.abs(transform.objectX) + extra,
      Math.abs(transform.objectY) + extra,
      Math.abs(q.x) + extra,
      Math.abs(q.y) + extra,
      Math.abs(transform.centreX) + 2,
      Math.abs(transform.centreY) + 2,
      Math.abs(transform.mirrorValue) + 2,
    ),
    unit = Math.max(
      3,
      Math.min(40, (w / 2 - 55) / extent, (h / 2 - 55) / extent),
    );
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#fffdf4";
  ctx.fillRect(0, 0, w, h);
  ctx.lineWidth = 1;
  const major = Math.max(1, Math.ceil(34 / unit)),
    gridGap = unit * major,
    startX = cx + Math.ceil(-cx / gridGap) * gridGap,
    startY = cy + Math.ceil(-cy / gridGap) * gridGap;
  for (let x = startX; x < w; x += gridGap) {
    ctx.strokeStyle = "#d7e0da";
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = startY; y < h; y += gridGap) {
    ctx.strokeStyle = "#d7e0da";
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.strokeStyle = "#263d56";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, h);
  ctx.moveTo(0, cy);
  ctx.lineTo(w, cy);
  ctx.stroke();
  ctx.fillStyle = "#263d56";
  ctx.font = "20px VT323";
  const firstI = Math.ceil(-cx / unit / major) * major,
    lastI = Math.floor((w - cx) / unit / major) * major,
    firstJ = Math.ceil(-cy / unit / major) * major,
    lastJ = Math.floor((h - cy) / unit / major) * major;
  for (let i = firstI; i <= lastI; i += major) {
    if (i && cx + i * unit > 10 && cx + i * unit < w - 10)
      ctx.fillText(i, cx + i * unit - 7, cy + 20);
  }
  for (let j = firstJ; j <= lastJ; j += major) {
    if (j && cy - j * unit > 10 && cy - j * unit < h - 10)
      ctx.fillText(j, cx + 7, cy - j * unit + 6);
  }
  ctx.font = "18px VT323";
  ctx.fillText("y", cx + 8, 17);
  ctx.fillText("x", w - 18, cy - 8);
  return { cx, cy, unit };
}
function point(x, y, color, label) {
  const { cx, cy, unit } = gridState;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx + x * unit, cy - y * unit, 6, 0, 7);
  ctx.fill();
  ctx.fillStyle = "#15253a";
  ctx.font = "19px VT323";
  ctx.fillText(label, cx + x * unit + 8, cy - y * unit - 7);
}
function guide() {
  const { cx, cy, unit } = gridState;
  ctx.save();
  ctx.setLineDash([8, 7]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#715e94";
  if (tool === "reflection") {
    ctx.beginPath();
    if (transform.mirror === "vertical") {
      ctx.moveTo(cx + transform.mirrorValue * unit, 0);
      ctx.lineTo(cx + transform.mirrorValue * unit, canvas.height);
    } else {
      ctx.moveTo(0, cy - transform.mirrorValue * unit);
      ctx.lineTo(canvas.width, cy - transform.mirrorValue * unit);
    }
    ctx.stroke();
  }
  ctx.restore();
  if (tool === "enlargement" || tool === "rotation")
    point(transform.centreX, transform.centreY, "#7963aa", "C");
}
function contextTransform(ctx, t, unit) {
  let X = t.centreX * unit,
    Y = -t.centreY * unit;
  if (t.kind === "enlargement") {
    ctx.translate(X, Y);
    ctx.scale(t.scale, t.scale);
    ctx.translate(-X, -Y);
  }
  if (t.kind === "reflection") {
    let v = t.mirrorValue * unit;
    if (t.mirror === "vertical") {
      ctx.translate(v, 0);
      ctx.scale(-1, 1);
      ctx.translate(-v, 0);
    } else {
      ctx.translate(0, -v);
      ctx.scale(1, -1);
      ctx.translate(0, v);
    }
  }
  if (t.kind === "rotation") {
    ctx.translate(X, Y);
    ctx.rotate(
      ((t.direction === "clockwise" ? 1 : -1) * t.angle * Math.PI) / 180,
    );
    ctx.translate(-X, -Y);
  }
  if (t.kind === "translation") ctx.translate(t.dx * unit, -t.dy * unit);
}
function object(alpha, newOne) {
  if (!image && !useDemo) return;
  const { cx, cy, unit } = gridState;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx, cy);
  if (newOne === "previous") {
    history
      .slice()
      .reverse()
      .forEach((t) => contextTransform(ctx, t, unit));
  }
  if (newOne === "current") {
    if (!justApplied) contextTransform(ctx, { ...transform, kind: tool }, unit);
    history
      .slice()
      .reverse()
      .forEach((t) => contextTransform(ctx, t, unit));
  }
  ctx.translate(transform.objectX * unit, -transform.objectY * unit);
  if (image) {
    let max =
      newOne === "current" && tool === "enlargement"
        ? 160 / Math.max(Math.abs(transform.scale), 0.15)
        : 190;
    let r = Math.min(max / image.width, max / image.height, 1);
    ctx.drawImage(
      image,
      (-image.width * r) / 2,
      (-image.height * r) / 2,
      image.width * r,
      image.height * r,
    );
    ctx.strokeStyle =
      newOne === "current"
        ? "#477fa3"
        : newOne === "previous"
          ? "#e5ba4c"
          : "#ba4d57";
    ctx.lineWidth = 4;
    ctx.strokeRect(
      (-image.width * r) / 2,
      (-image.height * r) / 2,
      image.width * r,
      image.height * r,
    );
  } else {
    ctx.beginPath();
    ctx.moveTo(-58, 50);
    ctx.lineTo(0, -67);
    ctx.lineTo(70, 45);
    ctx.closePath();
    ctx.fillStyle =
      newOne === "current"
        ? "#477fa3"
        : newOne === "previous"
          ? "#e5ba4c"
          : "#ba4d57";
    ctx.fill();
    ctx.strokeStyle = "#15253a";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.fillStyle = "#15253a";
    ctx.font = "26px VT323";
    ctx.fillText(
      newOne === "current" ? "A′" : newOne === "previous" ? "A1" : "A",
      -8,
      10,
    );
  }
  ctx.restore();
}
function describe(t) {
  if (t.kind === "enlargement")
    return `Pembesaran: k = ${t.scale}, pusat (${t.centreX}, ${t.centreY})`;
  if (t.kind === "reflection")
    return `Pantulan: ${t.mirror === "vertical" ? "x" : "y"} = ${t.mirrorValue}`;
  if (t.kind === "rotation")
    return `Putaran: ${t.angle}° ${t.direction === "anticlockwise" ? "lawan arah jam" : "mengikut arah jam"}, pusat (${t.centreX}, ${t.centreY})`;
  return `Translasi: (${t.dx}, ${t.dy})`;
}
function updateHistory() {
  historyCount.textContent = `${history.length} ${history.length === 1 ? "LANGKAH" : "LANGKAH"}`;
  historyList.innerHTML = history.length
    ? history.map((t) => `<li>${describe(t)}</li>`).join("")
    : '<li class="history-empty">Transformasi yang anda lakukan akan dipaparkan di sini.</li>';
}
function draw() {
  gridState = grid();
  if (image || useDemo) {
    emptyMessage.style.display = "none";
    guide();
    object(0.25, "original");
    if (history.length) object(0.48, "previous");
    object(1, "current");
    point(transform.objectX, transform.objectY, "#ba4d57", "A");
  } else emptyMessage.style.display = "grid";
}
document.querySelectorAll(".tool").forEach((b) =>
  b.addEventListener("click", () => {
    tool = b.dataset.tool;
    justApplied = false;
    document.querySelectorAll(".tool").forEach((x) => {
      x.classList.toggle("active", x === b);
      x.setAttribute("aria-checked", x === b);
    });
    controls();
    draw();
  }),
);
upload.addEventListener("change", (e) => {
  let f = e.target.files[0];
  if (!f) return;
  let r = new FileReader();
  r.onload = () => {
    image = new Image();
    image.onload = draw;
    image.src = r.result;
    useDemo = false;
  };
  r.readAsDataURL(f);
});
document.getElementById("demoButton").addEventListener("click", () => {
  image = null;
  useDemo = true;
  draw();
});
document.getElementById("applyButton").addEventListener("click", () => {
  read();
  history.push({ ...transform, kind: tool });
  justApplied = true;
  updateHistory();
  draw();
  let b = document.getElementById("applyButton");
  b.textContent = "✓ DIGUNAKAN!";
  setTimeout(() => (b.textContent = "GUNAKAN TRANSFORMASI"), 900);
});
document.getElementById("resetButton").addEventListener("click", () => {
  image = null;
  useDemo = false;
  history = [];
  justApplied = false;
  transform = {
    scale: 2,
    mirror: "vertical",
    mirrorValue: 0,
    angle: 90,
    direction: "anticlockwise",
    centreX: 0,
    centreY: 0,
    dx: 2,
    dy: 1,
    objectX: 0,
    objectY: 0,
  };
  objectX.value = 0;
  objectY.value = 0;
  updateHistory();
  controls();
  draw();
});
["objectX", "objectY"].forEach((id) =>
  document.getElementById(id).addEventListener("input", () => {
    justApplied = false;
    read();
    draw();
  }),
);
controls();
updateHistory();
draw();
