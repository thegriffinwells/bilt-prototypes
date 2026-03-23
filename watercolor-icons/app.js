// ─── State ───
let activeIcon = null;
let activeStyle = "watercolor";
let activeColor = "#0C0C0C";
let activeSize = 256;
let activeBg = "light";

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
const reliefSlider = document.getElementById("relief");
const reliefVal = document.getElementById("relief-val");
const reliefGroup = document.getElementById("relief-group");
const bevelSlider = document.getElementById("bevel");
const bevelVal = document.getElementById("bevel-val");
const bevelGroup = document.getElementById("bevel-group");
const shadowSlider = document.getElementById("shadow");
const shadowVal = document.getElementById("shadow-val");
const shadowGroup = document.getElementById("shadow-group");
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
  } else if (activeStyle === "metallic") {
    filterAttr = 'filter="url(#metallic)"';
    updateMetallicFilter();
  }

  previewGroup.innerHTML = `<g ${filterAttr}>${pathsHtml}</g>`;

  // Update viewer background for embossed mode (monochromatic)
  updateViewerBackground();

  viewerInfo.textContent = `${activeIcon} · ${activeSize}px · ${activeStyle}`;
}

// ─── Viewer background ───
function updateViewerBackground() {
  if (activeStyle === "embossed") {
    viewer.style.backgroundColor = activeColor;
    viewer.className = "viewer";
  } else if (activeStyle === "metallic") {
    // Metallic: silver/gray background
    viewer.style.backgroundColor = "#B8B8BC";
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

function updateMetallicFilter() {
  const intensity = intensitySlider.value / 100;
  const glossiness = glossinessSlider.value / 100;
  const relief = reliefSlider.value / 100;
  const bevel = bevelSlider.value / 100;
  const shadow = shadowSlider.value / 100;

  const metBlur = document.getElementById("met-blur");
  const metSpecular = document.getElementById("met-specular");
  const metDiffuse = document.getElementById("met-diffuse");
  const metDistantLight = document.getElementById("met-distant-light");
  const metShadowBlur = document.getElementById("met-shadow-blur");
  const metShadowColor = document.getElementById("met-shadow-color");
  const metShadowOffset = document.getElementById("met-shadow-offset");
  const metBevelLightOff = document.getElementById("met-bevel-light-off");
  const metBevelDarkOff = document.getElementById("met-bevel-dark-off");
  const metBevelBlur = document.getElementById("met-bevel-blur");

  // Smoothness of surface (higher blur = smoother polish)
  if (metBlur) metBlur.setAttribute("stdDeviation", 0.6 + intensity * 0.8);

  // Diffuse — smooth body gradient; relief controls surface depth
  if (metDiffuse) {
    metDiffuse.setAttribute("surfaceScale", 2 + relief * 6);
    metDiffuse.setAttribute("diffuseConstant", 0.8 + intensity * 0.3);
  }
  if (metDistantLight) {
    metDistantLight.setAttribute("elevation", 40 + intensity * 20);
  }

  // Specular — glossiness controls shine tightness
  if (metSpecular) {
    metSpecular.setAttribute("surfaceScale", 1.5 + relief * 4);
    metSpecular.setAttribute("specularExponent", 20 + glossiness * 40);
    metSpecular.setAttribute("specularConstant", 0.4 + glossiness * 0.8);
  }

  // Bevel — inner edge highlights/shadows
  const bevelOffset = 0.1 + bevel * 0.35;
  const bevelBlurVal = 0.15 + bevel * 0.4;
  if (metBevelLightOff) { metBevelLightOff.setAttribute("dx", -bevelOffset); metBevelLightOff.setAttribute("dy", -bevelOffset); }
  if (metBevelDarkOff) { metBevelDarkOff.setAttribute("dx", bevelOffset); metBevelDarkOff.setAttribute("dy", bevelOffset); }
  if (metBevelBlur) metBevelBlur.setAttribute("stdDeviation", bevelBlurVal);

  // Drop shadow
  if (metShadowOffset) { metShadowOffset.setAttribute("dx", 0.2 + shadow * 0.5); metShadowOffset.setAttribute("dy", 0.3 + shadow * 0.7); }
  if (metShadowBlur) metShadowBlur.setAttribute("stdDeviation", 0.3 + shadow * 1.0);
  if (metShadowColor) metShadowColor.setAttribute("flood-opacity", 0.15 + shadow * 0.4);
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
    const isMetal = activeStyle === "metallic";
    const isMetalOrEmboss = activeStyle === "embossed" || isMetal;
    glossinessGroup.style.display = isMetalOrEmboss ? "" : "none";
    softnessGroup.style.display = activeStyle === "watercolor" ? "" : "none";
    textureGroup.style.display = activeStyle === "watercolor" ? "" : "none";
    reliefGroup.style.display = isMetal ? "" : "none";
    bevelGroup.style.display = isMetal ? "" : "none";
    shadowGroup.style.display = isMetal ? "" : "none";
    seedRow.style.display = (activeStyle === "watercolor" || isMetal) ? "" : "none";
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
  reliefSlider.addEventListener("input", (e) => {
    reliefVal.textContent = e.target.value;
    updatePreview();
  });
  bevelSlider.addEventListener("input", (e) => {
    bevelVal.textContent = e.target.value;
    updatePreview();
  });
  shadowSlider.addEventListener("input", (e) => {
    shadowVal.textContent = e.target.value;
    updatePreview();
  });
  sizeSlider.addEventListener("input", (e) => {
    activeSize = parseInt(e.target.value);
    sizeVal.textContent = activeSize;
    updatePreview();
  });

  // Randomize seed
  document.getElementById("randomize-btn").addEventListener("click", () => {
    // Randomize all visible sliders
    const rand = (min, max) => Math.floor(Math.random() * (max - min) + min);

    intensitySlider.value = rand(10, 90);
    intensityVal.textContent = intensitySlider.value;

    if (activeStyle === "watercolor") {
      const seed = Math.floor(Math.random() * 1000);
      const wcEdge = document.getElementById("wc-edge-noise");
      const wcPaper = document.getElementById("wc-paper");
      if (wcEdge) wcEdge.setAttribute("seed", seed);
      if (wcPaper) wcPaper.setAttribute("seed", seed + 7);
      softnessSlider.value = rand(10, 90);
      softnessVal.textContent = softnessSlider.value;
      textureSlider.value = rand(10, 90);
      textureVal.textContent = textureSlider.value;
    }

    if (activeStyle === "metallic" || activeStyle === "embossed") {
      glossinessSlider.value = rand(20, 90);
      glossinessVal.textContent = glossinessSlider.value;
    }

    if (activeStyle === "metallic") {
      reliefSlider.value = rand(20, 80);
      reliefVal.textContent = reliefSlider.value;
      bevelSlider.value = rand(20, 80);
      bevelVal.textContent = bevelSlider.value;
      shadowSlider.value = rand(15, 70);
      shadowVal.textContent = shadowSlider.value;
    }

    updatePreview();
  });

  // Export SVG
  document.getElementById("export-svg").addEventListener("click", exportSVG);
  document.getElementById("export-png").addEventListener("click", exportPNG);
}

// ─── Export helpers ───
function prepareExportClone(clone) {
  // Inline the active filter
  if (activeStyle !== "plain") {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const filterEl = document.getElementById(activeStyle).cloneNode(true);
    defs.appendChild(filterEl);
    clone.insertBefore(defs, clone.firstChild);
  }

  // Add background rect for styles that use a colored background
  if (activeStyle === "embossed" || activeStyle === "metallic") {
    const vb = clone.getAttribute("viewBox").split(" ");
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", vb[2]);
    rect.setAttribute("height", vb[3]);
    rect.setAttribute("fill", activeStyle === "metallic" ? "#B8B8BC" : activeColor);
    clone.insertBefore(rect, clone.querySelector("g"));
  }
}

// ─── Export SVG ───
function exportSVG() {
  if (!activeIcon) return;
  const clone = previewSvg.cloneNode(true);
  prepareExportClone(clone);
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
  prepareExportClone(clone);

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
// Select first icon by default
const firstIcon = Object.keys(ICONS)[0];
if (firstIcon) selectIcon(firstIcon);
