// ─── State ───
let activeIcon = null;
let activeStyle = "plain";
let activeColor = "#0C0C0C";
let activeSize = 256;
let activeBg = "dark";

// ─── DOM refs ───
const iconGrid = document.getElementById("icon-grid");
const iconSearch = document.getElementById("icon-search");
const previewSvg = document.getElementById("preview-svg");
const previewGroup = document.getElementById("preview-group");
const viewer = document.getElementById("viewer");
const viewerInfo = document.getElementById("viewer-info");
const colorPicker = document.getElementById("color-picker");
const swatchesEl = document.getElementById("swatches");
const intensitySlider = document.getElementById("intensity");
const intensityVal = document.getElementById("intensity-val");
const glossinessSlider = document.getElementById("glossiness");
const glossinessVal = document.getElementById("glossiness-val");
const softnessSlider = document.getElementById("softness");
const softnessVal = document.getElementById("softness-val");
const sizeSlider = document.getElementById("size");
const sizeVal = document.getElementById("size-val");
const effectControls = document.getElementById("effect-controls");
const glossinessGroup = document.getElementById("glossiness-group");
const softnessGroup = document.getElementById("softness-group");
const textureSlider = document.getElementById("texture");
const textureVal = document.getElementById("texture-val");
const textureGroup = document.getElementById("texture-group");
const seedRow = document.getElementById("seed-row");

// ─── Bilt Color Library ───
const SWATCHES = [
  "#0C0C0C",  // on-surface (primary black)
  "#6B6B6B",  // on-surface-alternate
  "#B8860B",  // on-surface-context (gold/rent-day)
  "#4A7FA5",  // on-surface-status (blue)
  "#1A6B4B",  // success
  "#C1463D",  // error
  "#D4A017",  // warning
  "#E8DCC8",  // inverse-on-surface
  "#F5C469",  // inverse-on-surface-context
  "#7AB8D4",  // element-on-surface-status
];

// ─── Init ───
function init() {
  renderIconGrid();
  renderSwatches();
  bindEvents();
}

// ─── Icon Grid ───
function renderIconGrid(filter = "") {
  iconGrid.innerHTML = "";
  const lowerFilter = filter.toLowerCase();

  Object.entries(ICONS).forEach(([name, icon]) => {
    if (lowerFilter && !name.includes(lowerFilter) && !icon.category.includes(lowerFilter)) return;

    const cell = document.createElement("div");
    cell.className = "icon-cell" + (activeIcon === name ? " active" : "");
    cell.title = name;
    cell.innerHTML = buildSvgMarkup(icon, 20, 20, "#e8e8ed");
    cell.addEventListener("click", () => selectIcon(name));
    iconGrid.appendChild(cell);
  });
}

function buildSvgMarkup(icon, w, h, color) {
  let pathsHtml = "";
  icon.paths.forEach(p => {
    const attrs = [`d="${p.d}"`];
    if (p.fill && p.fill !== "none") attrs.push(`fill="${color || '#e8e8ed'}"`);
    else attrs.push('fill="none"');
    if (p.fillRule) attrs.push(`fill-rule="${p.fillRule}"`);
    if (p.clipRule) attrs.push(`clip-rule="${p.clipRule}"`);
    if (p.stroke) attrs.push(`stroke="${color || '#e8e8ed'}"`);
    if (p.strokeWidth) attrs.push(`stroke-width="${p.strokeWidth}"`);
    pathsHtml += `<path ${attrs.join(" ")}/>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icon.viewBox}" width="${w}" height="${h}">${pathsHtml}</svg>`;
}

// ─── Select Icon ───
function selectIcon(name) {
  activeIcon = name;
  renderIconGrid(iconSearch.value);
  updatePreview();
}

// ─── Build icon paths for preview ───
function buildPreviewPaths(icon) {
  let pathsHtml = "";
  icon.paths.forEach(p => {
    const attrs = [`d="${p.d}"`];
    if (p.fill && p.fill !== "none") attrs.push(`fill="${activeColor}"`);
    else attrs.push('fill="none"');
    if (p.fillRule) attrs.push(`fill-rule="${p.fillRule}"`);
    if (p.clipRule) attrs.push(`clip-rule="${p.clipRule}"`);
    if (p.stroke) {
      attrs.push(`stroke="${activeColor}"`);
      attrs.push(`stroke-width="${p.strokeWidth || 1.5}"`);
    }
    pathsHtml += `<path ${attrs.join(" ")}/>`;
  });
  return pathsHtml;
}

// ─── Preview ───
function updatePreview() {
  if (!activeIcon) return;
  const icon = ICONS[activeIcon];

  // Update SVG size
  previewSvg.setAttribute("width", activeSize);
  previewSvg.setAttribute("height", activeSize);
  previewSvg.setAttribute("viewBox", icon.viewBox);

  const pathsHtml = buildPreviewPaths(icon);

  // Apply filter
  let filterAttr = "";
  if (activeStyle === "embossed") {
    filterAttr = 'filter="url(#embossed)"';
    updateEmbossedFilter();
  } else if (activeStyle === "watercolor") {
    filterAttr = 'filter="url(#watercolor)"';
    updateWatercolorFilter();
  }

  previewGroup.innerHTML = `<g ${filterAttr}>${pathsHtml}</g>`;

  // Update viewer background for embossed mode (monochromatic)
  updateViewerBackground();

  viewerInfo.textContent = `${activeIcon} · ${activeSize}px · ${activeStyle}`;
}

// ─── Viewer background ───
function updateViewerBackground() {
  if (activeStyle === "embossed") {
    // Embossed: set viewer bg to match the icon color for monochromatic effect
    viewer.style.backgroundColor = activeColor;
    viewer.className = "viewer";
  } else {
    viewer.style.backgroundColor = "";
    viewer.className = "viewer bg-" + activeBg;
  }
}

// ─── Filter Updates ───
function updateEmbossedFilter() {
  const intensity = intensitySlider.value / 100;
  const glossiness = glossinessSlider.value / 100;

  const embColor = document.getElementById("emb-color");
  const embShadowOffset = document.getElementById("emb-shadow-offset");
  const embLightOffset = document.getElementById("emb-light-offset");
  const embShadowBlur = document.getElementById("emb-shadow-blur");
  const embLightBlur = document.getElementById("emb-light-blur");
  const embShadowColor = document.getElementById("emb-shadow-color");
  const embHighlightColor = document.getElementById("emb-highlight-color");

  if (embColor) embColor.setAttribute("flood-color", activeColor);

  // Tight inner shadow/highlight — intensity controls offset and blur
  const offset = 0.15 + intensity * 0.35;
  const blur = 0.15 + intensity * 0.35;

  if (embShadowOffset) { embShadowOffset.setAttribute("dx", offset); embShadowOffset.setAttribute("dy", offset); }
  if (embLightOffset) { embLightOffset.setAttribute("dx", -offset); embLightOffset.setAttribute("dy", -offset); }
  if (embShadowBlur) embShadowBlur.setAttribute("stdDeviation", blur);
  if (embLightBlur) embLightBlur.setAttribute("stdDeviation", blur);

  // Glossiness controls shadow/highlight visibility
  if (embShadowColor) embShadowColor.setAttribute("flood-opacity", 0.1 + glossiness * 0.25);
  if (embHighlightColor) embHighlightColor.setAttribute("flood-opacity", 0.12 + glossiness * 0.28);
}

function updateWatercolorFilter() {
  const intensity = intensitySlider.value / 100;
  const softness = softnessSlider.value / 100;
  const texture = textureSlider.value / 100;

  const wcDisplace = document.getElementById("wc-displace");
  const wcEdgeNoise = document.getElementById("wc-edge-noise");
  const wcPaper = document.getElementById("wc-paper");

  // Texture slider controls edge displacement (linocut / jagged edges)
  if (wcDisplace) {
    wcDisplace.setAttribute("scale", texture * 1.5);
  }
  if (wcEdgeNoise) {
    // Higher texture = more jagged (higher frequency noise)
    const freq = 0.02 + texture * 0.08;
    wcEdgeNoise.setAttribute("baseFrequency", freq);
    wcEdgeNoise.setAttribute("numOctaves", Math.round(2 + texture * 4));
  }

  // Intensity controls grain density
  if (wcPaper) {
    const grainFreq = 2 + intensity * 6;
    wcPaper.setAttribute("baseFrequency", grainFreq);
  }
}

// ─── Swatches ───
function renderSwatches() {
  swatchesEl.innerHTML = "";
  SWATCHES.forEach(color => {
    const el = document.createElement("div");
    el.className = "swatch" + (color === activeColor ? " active" : "");
    el.style.background = color;
    el.addEventListener("click", () => {
      activeColor = color;
      colorPicker.value = color;
      renderSwatches();
      updatePreview();
    });
    swatchesEl.appendChild(el);
  });
}

// ─── Style Controls Visibility ───
function updateControlsVisibility() {
  if (activeStyle === "plain") {
    effectControls.style.display = "none";
  } else {
    effectControls.style.display = "";
    glossinessGroup.style.display = activeStyle === "embossed" ? "" : "none";
    softnessGroup.style.display = activeStyle === "watercolor" ? "" : "none";
    textureGroup.style.display = activeStyle === "watercolor" ? "" : "none";
    seedRow.style.display = activeStyle === "watercolor" ? "" : "none";
  }
}

// ─── Event Binding ───
function bindEvents() {
  // Search
  iconSearch.addEventListener("input", () => renderIconGrid(iconSearch.value));

  // Style presets
  document.querySelectorAll("#style-control .seg-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#style-control .seg-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeStyle = btn.dataset.style;
      updateControlsVisibility();
      updatePreview();
    });
  });

  // Background
  document.querySelectorAll("#bg-control .seg-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#bg-control .seg-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeBg = btn.dataset.bg;
      updateViewerBackground();
    });
  });

  // Color picker
  colorPicker.addEventListener("input", (e) => {
    activeColor = e.target.value;
    renderSwatches();
    updatePreview();
  });

  // Sliders
  intensitySlider.addEventListener("input", (e) => {
    intensityVal.textContent = e.target.value;
    updatePreview();
  });
  glossinessSlider.addEventListener("input", (e) => {
    glossinessVal.textContent = e.target.value;
    updatePreview();
  });
  softnessSlider.addEventListener("input", (e) => {
    softnessVal.textContent = e.target.value;
    updatePreview();
  });
  textureSlider.addEventListener("input", (e) => {
    textureVal.textContent = e.target.value;
    updatePreview();
  });
  sizeSlider.addEventListener("input", (e) => {
    activeSize = parseInt(e.target.value);
    sizeVal.textContent = activeSize;
    updatePreview();
  });

  // Randomize seed
  document.getElementById("randomize-btn").addEventListener("click", () => {
    const seed = Math.floor(Math.random() * 1000);
    const wcEdge = document.getElementById("wc-edge-noise");
    const wcPaper = document.getElementById("wc-paper");
    if (wcEdge) wcEdge.setAttribute("seed", seed);
    if (wcPaper) wcPaper.setAttribute("seed", seed + 7);

    // Randomize slider values too
    const randIntensity = Math.floor(Math.random() * 80 + 10);
    const randSoftness = Math.floor(Math.random() * 80 + 10);
    const randTexture = Math.floor(Math.random() * 80 + 10);
    intensitySlider.value = randIntensity;
    intensityVal.textContent = randIntensity;
    softnessSlider.value = randSoftness;
    softnessVal.textContent = randSoftness;
    textureSlider.value = randTexture;
    textureVal.textContent = randTexture;

    updatePreview();
  });

  // Export SVG
  document.getElementById("export-svg").addEventListener("click", exportSVG);
  document.getElementById("export-png").addEventListener("click", exportPNG);
}

// ─── Export SVG ───
function exportSVG() {
  if (!activeIcon) return;

  const clone = previewSvg.cloneNode(true);

  if (activeStyle !== "plain") {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const filterId = activeStyle === "embossed" ? "embossed" : "watercolor";
    const filterEl = document.getElementById(filterId).cloneNode(true);
    defs.appendChild(filterEl);
    clone.insertBefore(defs, clone.firstChild);
  }

  // For embossed, add background rect
  if (activeStyle === "embossed") {
    const icon = ICONS[activeIcon];
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", "24");
    rect.setAttribute("height", "24");
    rect.setAttribute("fill", activeColor);
    clone.insertBefore(rect, clone.querySelector("g"));
  }

  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(clone);
  const blob = new Blob([svgStr], { type: "image/svg+xml" });
  downloadBlob(blob, `${activeIcon}-${activeStyle}.svg`);
}

// ─── Export PNG ───
function exportPNG() {
  if (!activeIcon) return;

  const scale = 2;
  const w = activeSize * scale;
  const h = activeSize * scale;

  const clone = previewSvg.cloneNode(true);
  clone.setAttribute("width", w);
  clone.setAttribute("height", h);

  if (activeStyle !== "plain") {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const filterId = activeStyle === "embossed" ? "embossed" : "watercolor";
    const filterEl = document.getElementById(filterId).cloneNode(true);
    defs.appendChild(filterEl);
    clone.insertBefore(defs, clone.firstChild);
  }

  if (activeStyle === "embossed") {
    const icon = ICONS[activeIcon];
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", "24");
    rect.setAttribute("height", "24");
    rect.setAttribute("fill", activeColor);
    clone.insertBefore(rect, clone.querySelector("g"));
  }

  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(clone);
  const dataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgStr);

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);
    canvas.toBlob(blob => {
      if (blob) downloadBlob(blob, `${activeIcon}-${activeStyle}.png`);
    }, "image/png");
  };
  img.src = dataUrl;
}

// ─── Download helper ───
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Boot ───
updateControlsVisibility();
init();
