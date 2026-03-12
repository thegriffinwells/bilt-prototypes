# Bilt Localhost Prototype Template

Rules and specs for every Bilt UI prototype built with Claude Code.

---

## Page Shell

- **Background**: `Hero.png` wallpaper with `#1a2332` fallback
  ```css
  background: #1a2332 url('Hero.png') center/cover no-repeat fixed;
  ```
- **Layout**: Flexbox, centered both axes, `height: 100vh`, `overflow: hidden` (NOT `min-height` — that breaks vertical centering with scaled frames)
- **Favicon**: `favicon.ico` from bilt.com — copy into project root or `/public`
- **Title format**: `Bilt — <Screen Name>`

---

## iPhone 16 Pro Frame — Silver Titanium

All prototypes render inside a silver iPhone 16 Pro device frame.

| Property | Value |
|---|---|
| Width | 402px |
| Height | 874px |
| Border radius | 55px |
| Background | #fff |
| Border | 4px solid #d6d6d8 |

```css
.phone-frame {
  width: 402px;
  height: 874px;
  background: #fff;
  border-radius: 55px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  border: 4px solid #d6d6d8;
  box-shadow:
    0 0 0 1px #bbbbbe,
    0 30px 90px rgba(0, 0, 0, 0.35),
    0 12px 36px rgba(0, 0, 0, 0.2),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
  transform-origin: center center;
  transform: scale(var(--frame-scale, 1));
}
```

---

## Responsive Scaling

The phone frame scales down to fit the browser window but never exceeds native size.

```js
function scaleFrame() {
  const frame = document.querySelector('.phone-frame');
  if (!frame) return;
  const sx = (window.innerWidth - 60) / 410;
  const sy = (window.innerHeight - 60) / 882;
  frame.style.setProperty('--frame-scale', Math.min(1, sx, sy));
}
window.addEventListener('resize', scaleFrame);
scaleFrame();
```

---

## Status Bar (iOS 18)

Use the exported status bar image — do NOT hand-draw SVG icons.

```css
.status-bar {
  height: 54px;
  flex-shrink: 0;
  background: url('status-bar.png') center/contain no-repeat;
}
```

```html
<div class="status-bar"></div>
```

The image is at `bilt-localhost-template/assets/status-bar.png`. Copy it into each project's public/static assets.

---

## Home Indicator

Bottom swipe indicator, always present.

```css
.home-indicator {
  display: flex;
  justify-content: center;
  padding: 8px 0 10px;
  flex-shrink: 0;
}
.indicator-pill {
  width: 140px;
  height: 5px;
  background: #1a1a1a;
  border-radius: 999px;
}
```

```html
<div class="home-indicator"><div class="indicator-pill"></div></div>
```

---

## Assets Checklist

When starting a new Bilt prototype, copy these from `/Users/griffin.wells/claude-projects/bilt-localhost-template/assets/`:

- [ ] `Hero.png` — page wallpaper background
- [ ] `favicon.ico` — Bilt favicon from bilt.com
- [ ] `status-bar.png` — exported iOS 18 status bar image

---

## Structural Markup Template

```html
<body>
  <div class="phone-frame">
    <div class="status-bar"></div>

    <!-- Your screen content here -->

    <div class="home-indicator">
      <div class="indicator-pill"></div>
    </div>
  </div>
</body>
```
