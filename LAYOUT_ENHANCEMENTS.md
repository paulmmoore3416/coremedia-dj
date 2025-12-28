# CoreMedia DJ - Layout Enhancements Documentation

This document describes the 6 advanced layout enhancements added to CoreMedia DJ, providing flexible UI customization and improved user experience.

---

## Table of Contents

1. [Responsive Grid Layout System](#1-responsive-grid-layout-system)
2. [Collapsible Panel System](#2-collapsible-panel-system)
3. [Picture-in-Picture Mode](#3-picture-in-picture-mode)
4. [Split-Screen Comparison View](#4-split-screen-comparison-view)
5. [Floating Widget System](#5-floating-widget-system)
6. [Adaptive Spacing & Density Controls](#6-adaptive-spacing--density-controls)

---

## 1. Responsive Grid Layout System

### Overview
A flexible CSS Grid-based layout system that automatically adapts to different screen sizes and provides aspect ratio control for UI elements.

### Features
- **Auto-flowing grid** with responsive breakpoints
- **Aspect ratio variants** (square, landscape, portrait)
- **Hover effects** with elevation and shadow
- **Mobile-friendly** with single-column layout on small screens

### CSS Classes

```css
.grid-container          /* Main grid wrapper */
.grid-item              /* Individual grid items */
.grid-item.square       /* 1:1 aspect ratio */
.grid-item.landscape    /* 16:9 aspect ratio */
.grid-item.portrait     /* 9:16 aspect ratio */
```

### Usage Example

```html
<div class="grid-container">
    <div class="grid-item landscape">Content 1</div>
    <div class="grid-item square">Content 2</div>
    <div class="grid-item">Content 3</div>
</div>
```

### Responsive Breakpoints

| Screen Size | Columns | Gap |
|------------|---------|-----|
| < 768px    | 1       | 12px |
| 768px - 1400px | auto-fit (min 280px) | 16px |
| > 1400px   | auto-fit (min 320px) | 16px |

---

## 2. Collapsible Panel System

### Overview
Transform sidebar sections into expandable/collapsible panels to save screen space and organize controls efficiently.

### Features
- **Smooth animations** with cubic-bezier easing
- **Click-to-toggle** with visual feedback
- **Arrow indicators** that rotate on collapse
- **Auto-initialization** on page load

### How It Works

The system automatically converts sidebar sections with `.section-title` elements into collapsible panels:

1. Detects all `.sidebar-section` elements
2. Wraps content in collapsible structure
3. Adds click handlers for expand/collapse
4. Animates max-height and opacity

### User Interaction

- **Click header** to toggle section
- **Collapsed state**: Content hidden, arrow rotated -90°
- **Expanded state**: Full content visible, arrow down

### Keyboard Accessibility

Currently mouse-only; keyboard support can be added by implementing:
- Enter/Space key handlers
- ARIA attributes (aria-expanded, role="button")

---

## 3. Picture-in-Picture Mode

### Overview
Detachable mini player that floats over content, allowing users to continue watching/listening while working elsewhere in the interface.

### Features
- **Draggable positioning** with mouse
- **Play/pause controls** in PiP window
- **Syncs with main player** (copies current media and time)
- **Glassmorphic design** with blur and shadow effects
- **Auto-hides drag handle** until hover

### Controls

| Button | Icon | Function |
|--------|------|----------|
| Header Button | PiP icon | Toggle Picture-in-Picture mode |
| Play/Pause | Play/Pause icon | Control playback in PiP |
| Close | ✕ | Close PiP window |

### User Workflow

1. Click the **PiP button** in header (icon shows nested rectangles)
2. PiP window appears in bottom-right corner
3. **Drag the top handle** to reposition anywhere
4. Use controls to play/pause or close
5. Click header button again to exit PiP mode

### Technical Details

- **Default position**: Bottom-right (20px from edges, 80px from bottom)
- **Size**: 360px × 202px (16:9 aspect ratio)
- **Z-index**: 9999 (always on top)
- **Media sync**: Copies src and currentTime from main player

### Limitations

- Cannot resize (fixed 360×202px)
- Position not saved between sessions
- Only one PiP instance at a time

---

## 4. Split-Screen Comparison View

### Overview
Side-by-side dual video/audio comparison mode for A/B testing, mixing, or educational purposes.

### Features
- **Vertical split** (default) or horizontal split
- **Resizable divider** with drag handle
- **Color-coded labels** (Red for Deck A, Green for Deck B)
- **Independent playback** for each pane
- **Synced controls** option (future enhancement)

### How to Use

1. Click the **Split View button** in header (two rectangles side-by-side)
2. Main video area replaced with split-screen layout
3. **Drag the center divider** to adjust pane sizes
4. Load different media into each pane
5. Click Split View button again to exit

### Divider Controls

- **Hover**: Divider highlights in accent blue
- **Drag**: Adjust split ratio (10% - 90% range)
- **Visual handle**: Center grip shows drag affordance

### Layout Variants

```css
.split-screen-container           /* Vertical split (default) */
.split-screen-container.horizontal /* Horizontal split */
```

### Pane Structure

Each pane contains:
- Label overlay (top-left corner)
- Video/audio player element
- Full-height background

### Use Cases

- **DJ mixing**: Compare two tracks side-by-side
- **Video editing**: Before/after comparisons
- **Educational**: Show reference vs. practice
- **Quality testing**: Compare different encodings

---

## 5. Floating Widget System

### Overview
Draggable, resizable overlay widgets that can be positioned anywhere on screen, providing quick access to specific controls.

### Features
- **Drag to move** via header
- **Resize from corner** (bottom-right handle)
- **Glassmorphic design** with backdrop blur
- **Pre-defined positions** (top-left, top-right, bottom-left, bottom-right, center)
- **Keyboard shortcuts** to toggle visibility

### Built-in Widgets

| Widget | ID | Shortcut | Default Position |
|--------|----|----|-----------------|
| VU Meters | `vuWidget` | Ctrl+Shift+V | Bottom-left |
| Waveform | `waveformWidget` | Ctrl+Shift+W | Top-right |

### User Interaction

#### Dragging
1. Click and hold **widget header**
2. Drag to desired position
3. Release to drop
4. Position classes automatically removed

#### Resizing
1. Hover bottom-right corner (resize cursor appears)
2. Click and drag to resize
3. Minimum: 200px wide × 100px tall
4. Maximum: 500px wide (no height limit)

#### Closing
- Click **✕ button** in header
- Widget hidden (not destroyed)
- Can be reopened with keyboard shortcut

### Creating Custom Widgets

```html
<div class="floating-widget bottom-left" id="myWidget">
    <div class="widget-header">
        <div class="widget-title">
            <!-- Icon SVG -->
            Widget Title
        </div>
        <div class="widget-actions">
            <button class="widget-btn">✕</button>
        </div>
    </div>
    <div class="widget-content">
        <!-- Your content here -->
    </div>
    <div class="widget-resize-handle"></div>
</div>
```

### JavaScript API

```javascript
// Toggle widget visibility
document.getElementById('myWidget').classList.toggle('active');

// Position widget programmatically
widget.style.left = '100px';
widget.style.top = '100px';

// Reset to preset position
widget.classList.add('bottom-right');
```

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+Shift+V | Toggle VU Meters widget |
| Ctrl+Shift+W | Toggle Waveform widget |

Add more shortcuts by extending the `initFloatingWidgets()` method in app.js.

---

## 6. Adaptive Spacing & Density Controls

### Overview
User-adjustable UI density modes that change spacing, padding, and font sizes throughout the application.

### Density Modes

| Mode | Spacing | Font Sizes | Sidebar Width | Best For |
|------|---------|-----------|---------------|----------|
| **Compact** | Tight (2-16px) | Small (10-14px) | 300px | Small screens, maximizing content |
| **Comfortable** | Balanced (4-24px) | Medium (11-16px) | 380px | Default, general use |
| **Spacious** | Generous (6-48px) | Large (12-18px) | 420px | Large screens, accessibility |

### How to Change Density

1. Open **Settings** modal (gear icon in header)
2. Find **"UI Density"** dropdown at bottom
3. Select: Compact, Comfortable, or Spacious
4. Changes apply immediately
5. **Saved to localStorage** (persists across sessions)

### CSS Variables

The system uses CSS custom properties for responsive scaling:

```css
--spacing-xs: 4px    /* Extra small gap/padding */
--spacing-sm: 8px    /* Small gap/padding */
--spacing-md: 12px   /* Medium gap/padding */
--spacing-lg: 16px   /* Large gap/padding */
--spacing-xl: 24px   /* Extra large gap/padding */
--spacing-2xl: 32px  /* 2X large gap/padding */

--font-size-xs: 11px  /* Extra small text */
--font-size-sm: 12px  /* Small text */
--font-size-md: 14px  /* Medium text */
--font-size-lg: 16px  /* Large text */
```

### Utility Classes

Use these classes to apply adaptive spacing:

```html
<!-- Gap utilities -->
<div class="spacing-sm">...</div>  <!-- gap: var(--spacing-sm) -->
<div class="spacing-md">...</div>  <!-- gap: var(--spacing-md) -->

<!-- Padding utilities -->
<div class="padding-lg">...</div>  <!-- padding: var(--spacing-lg) -->

<!-- Margin utilities -->
<div class="margin-xl">...</div>   <!-- margin: var(--spacing-xl) -->

<!-- Text size utilities -->
<span class="text-sm">...</span>   <!-- font-size: var(--font-size-sm) -->
<span class="text-lg">...</span>   <!-- font-size: var(--font-size-lg) -->
```

### Affected Elements

Density modes automatically adjust:
- Sidebar width and padding
- Button sizes and spacing
- Section title fonts
- Gap between controls
- Modal padding
- Card spacing

### Implementation Details

```javascript
// Set density programmatically
document.body.classList.add('density-compact');

// Save to localStorage
localStorage.setItem('uiDensity', 'compact');

// Load on startup
const savedDensity = localStorage.getItem('uiDensity') || 'comfortable';
document.body.classList.add(`density-${savedDensity}`);
```

---

## Integration Guide

### For Developers

#### Adding Layout Classes to Existing Elements

```javascript
// Make any section collapsible
const section = document.querySelector('.my-section');
section.classList.add('collapsible-section');
player.initCollapsiblePanels(); // Re-run initialization

// Use adaptive spacing
const controls = document.querySelector('.controls');
controls.classList.add('spacing-md', 'padding-lg');

// Create grid layouts
const container = document.createElement('div');
container.className = 'grid-container';
items.forEach(item => {
    const gridItem = document.createElement('div');
    gridItem.className = 'grid-item landscape';
    gridItem.textContent = item.name;
    container.appendChild(gridItem);
});
```

#### Extending Widget System

```javascript
// Create new widget
const newWidget = document.createElement('div');
newWidget.className = 'floating-widget top-left';
newWidget.id = 'customWidget';
newWidget.innerHTML = `...`; // Use widget HTML structure
document.body.appendChild(newWidget);

// Re-initialize to enable drag/resize
player.initFloatingWidgets();

// Add keyboard shortcut
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        newWidget.classList.toggle('active');
        e.preventDefault();
    }
});
```

---

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Grid Layout | ✅ 57+ | ✅ 52+ | ✅ 10.1+ | ✅ 16+ |
| Backdrop Filter | ✅ 76+ | ✅ 103+ | ✅ 9+ | ✅ 79+ |
| Aspect Ratio | ✅ 88+ | ✅ 89+ | ✅ 15+ | ✅ 88+ |
| CSS Variables | ✅ 49+ | ✅ 31+ | ✅ 9.1+ | ✅ 15+ |

All features gracefully degrade in older browsers.

---

## Performance Notes

- **Collapsible panels**: Use GPU-accelerated transforms for smooth 60fps animations
- **Dragging**: Throttled to reduce repaints (update on mousemove)
- **Resizing**: Direct style manipulation (no layout thrashing)
- **Grid layout**: Hardware-accelerated by modern browsers
- **Density changes**: Single class toggle (minimal DOM manipulation)

---

## Accessibility Improvements (Future)

Planned enhancements:

1. **Keyboard navigation** for collapsible panels (Enter/Space to toggle)
2. **ARIA labels** for all interactive elements
3. **Focus indicators** for keyboard users
4. **Screen reader announcements** for state changes
5. **Reduced motion** support (prefers-reduced-motion media query)
6. **High contrast mode** compatibility

---

## Troubleshooting

### Collapsible panels not working
- Ensure sections have `.section-title` elements
- Check that `initCollapsiblePanels()` is called after DOM load
- Verify no CSS conflicts override `.collapsible-content` max-height

### PiP not showing video
- Confirm main player has valid src before toggling PiP
- Check browser console for media errors
- Ensure media file is not DRM-protected

### Widgets not draggable
- Verify `initFloatingWidgets()` runs after DOM ready
- Check that widget has `.widget-header` element
- Ensure no CSS `pointer-events: none` on header

### Density not persisting
- Check localStorage is enabled in browser
- Verify no browser extensions blocking localStorage
- Confirm settings modal exists when `initDensityControls()` runs

### Split view divider not resizing
- Ensure mousedown/mousemove listeners are attached
- Check divider has correct z-index (should be 100)
- Verify split container has `.active` class when enabled

---

## Future Enhancements

Planned improvements:

1. **Grid Layout**: Auto-layout algorithms, masonry mode
2. **Collapsible Panels**: Remember collapsed state per session
3. **Picture-in-Picture**: Resizable PiP, snap-to-edges, multiple PiP windows
4. **Split Screen**: Synchronized playback, audio mixing, more than 2 panes
5. **Widgets**: Widget library/marketplace, custom widget builder
6. **Density**: Per-component density overrides, custom density presets

---

## Credits

Layout enhancements designed and implemented for **CoreMedia DJ** (December 2025).

Built with:
- CSS Grid Layout
- CSS Custom Properties
- Vanilla JavaScript (no dependencies)
- Glassmorphism design language
- Hardware-accelerated animations

---

## License

These layout enhancements are part of the CoreMedia DJ application.

---

**Generated with Claude Code** - Advanced Layout Enhancement System v1.0
