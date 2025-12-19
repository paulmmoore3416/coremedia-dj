# CoreMedia Visual Design Guide

## Color Palette

### Base Theme Colors
```css
Background Primary:    #0d1117 (Deep Dark Gray)
Background Secondary:  #161b22 (Dark Gray)
Background Tertiary:   #21262d (Medium Gray)
Background Overlay:    #30363d (Light Gray)
```

### Text Colors
```css
Text Primary:          #c9d1d9 (Light Gray)
Text Secondary:        #8b949e (Medium Gray)
Text Tertiary:         #6e7681 (Dim Gray)
```

### Accent Colors
```css
Accent Primary:        #58a6ff (GitHub Blue)
Accent Hover:          #1f6feb (Dark Blue)
Accent Glow:           rgba(88, 166, 255, 0.3) (Blue Transparent)
```

### DJ Colors
```css
Neon Blue:            #00d4ff (Cyan)
Neon Purple:          #a855f7 (Purple)
Neon Pink:            #ec4899 (Pink)
DJ Red:               #ef4444 (Red)
DJ Green:             #10b981 (Green)
Success:              #3fb950 (Green)
Warning:              #d29922 (Orange)
Danger:               #f85149 (Red)
```

## Component Styling

### Equalizer Sliders
- **Height**: 120px (increased from 80px)
- **Width**: 6px track
- **Thumb**: 20px circle with gradient
- **Background**: Red-Yellow-Green gradient
- **Glow**: Blue shadow on hover
- **Center Line**: Semi-transparent blue indicator at 0dB

### Pitch Control
- **Range**: -16 to +16
- **Slider**: Red-Gray-Green gradient
- **Thumb**: 24px white circle with blue border
- **Display**: Large monospace font with glow
- **Quick Buttons**: Gradient background with hover glow

### Hot Cue Buttons
- **Size**: Square with aspect-ratio 1:1
- **Border**: 2px with color-coded borders
- **Colors**:
  - Red (#ef4444)
  - Cyan (#00d4ff)
  - Green (#10b981)
  - Orange (#d29922)
  - Purple (#a855f7)
  - Pink (#ec4899)
  - Blue (#58a6ff)
  - Green (#3fb950)
- **Active State**: Glowing background with pulsing animation
- **Font**: Bold, with small time display

### BPM Display
- **Font Size**: 32px
- **Font Family**: Courier New (monospace)
- **Color**: Accent blue with glow
- **Background**: Dark with blue border
- **Shadow**: Neon blue text-shadow

### Crossfader
- **Height**: 8px track
- **Thumb**: 32px rectangle with rounded corners
- **Gradient**: Red (left) → Gray (center) → Green (right)
- **Labels**: Glowing red/green text
- **Border**: Blue accent

### Loop Buttons
- **Layout**: 2-column grid
- **Padding**: 12px
- **Background**: Gradient overlay
- **Active State**: Green background with glow animation
- **Hover**: Blue glow effect

## Animation Effects

### Glow Pulse Animation
```css
@keyframes glow-pulse {
    0%, 100% {
        box-shadow: 0 0 5px accent, 0 0 10px glow;
    }
    50% {
        box-shadow: 0 0 10px accent, 0 0 20px glow;
    }
}
```

### Meter Pulse Animation
```css
@keyframes meter-pulse {
    0%, 100% { transform: scaleY(1); }
    50% { transform: scaleY(1.1); }
}
```

## Visual States

### Active Controls
- **Glow**: Continuous pulsing animation
- **Color**: Bright accent color
- **Shadow**: Enhanced box-shadow
- **Border**: Highlighted border color

### Hover States
- **Background**: Lighter overlay
- **Glow**: Increased intensity
- **Transform**: Slight scale increase (1.05-1.2x)
- **Cursor**: Grab/pointer

### Disabled/Inactive
- **Opacity**: 0.5-0.7
- **Grayscale**: Muted colors
- **No Glow**: Flat appearance
- **Cursor**: Default

## Layout Structure

### Sidebar Width
- **Default**: 380px (increased for DJ controls)
- **Tablet**: 280px
- **Mobile**: Full width overlay

### DJ Section Layout
```
┌─────────────────────────────┐
│      BPM Display            │
│         [###]               │
│      [Tap Tempo]            │
├─────────────────────────────┤
│    Pitch Control            │
│   [========|========]       │
│   [-8%] [Reset] [+8%]       │
├─────────────────────────────┤
│      Hot Cues (4x2)         │
│   [1] [2] [3] [4]           │
│   [5] [6] [7] [8]           │
├─────────────────────────────┤
│    Loop Controls (2x3)      │
│   [In] [Out]                │
│   [2B] [4B]                 │
│   [8B] [Exit]               │
├─────────────────────────────┤
│     Crossfader              │
│  A [=========] B            │
└─────────────────────────────┘
```

### Equalizer Layout
```
┌───────────────────────────────────┐
│  60  170 310 600  1k              │
│  Hz  Hz  Hz  Hz   Hz              │
│  |   |   |   |    |               │
│  |   |   |   |    |               │
│  |   |   |   |    |               │
│  ●   ●   ●   ●    ●               │
│  |   |   |   |    |               │
│  |   |   |   |    |               │
│  0   0   0   0    0               │
│                                   │
│  3k  6k  12k 14k 16k              │
│  Hz  Hz  Hz  Hz  Hz               │
│  |   |   |   |   |                │
│  |   |   |   |   |                │
│  |   |   |   |   |                │
│  ●   ●   ●   ●   ●                │
│  |   |   |   |   |                │
│  |   |   |   |   |                │
│  0   0   0   0   0                │
└───────────────────────────────────┘
```

## Responsive Behavior

### Desktop (1920x1080+)
- Full sidebar visible
- All controls accessible
- Large touch targets
- Full visualizer

### Tablet (768-1024px)
- Narrower sidebar (280px)
- Smaller EQ sliders
- Compact controls
- Reduced padding

### Mobile (<768px)
- Sidebar as overlay
- Toggle button for controls
- Touch-optimized buttons
- Simplified layout

## Accessibility Features

### Visual Indicators
- Color-coded controls for quick identification
- Glowing effects for active states
- Clear labels on all buttons
- Monospace fonts for precise values

### Contrast Ratios
- Text on dark background: >7:1
- Active elements: >4.5:1
- Glow effects enhance visibility
- High contrast mode compatible

### Touch Targets
- Minimum size: 44x44px (WCAG AAA)
- Adequate spacing between controls
- Large slider thumbs for easy grabbing
- Button padding for easy tapping

## Professional Touches

### Shadows and Depth
- **Card Shadows**: 0 2px 8px rgba(0,0,0,0.3)
- **Glow Effects**: 0 0 15px accent-color
- **Inset Shadows**: Depth on sliders and inputs
- **Layering**: Z-index for proper stacking

### Gradients
- **Subtle backgrounds**: 135deg angle
- **Control gradients**: Linear for sliders
- **Glow gradients**: Radial for buttons
- **Transparency layers**: RGBA overlays

### Typography
- **Headers**: System fonts, 600 weight
- **Values**: Courier New monospace
- **Labels**: 10-12px uppercase with letter-spacing
- **Display**: 18-32px for important values

## Performance Optimizations

### CSS Tricks
- **Transform** instead of position changes
- **Opacity** for smooth fades
- **Will-change** for animated elements
- **Hardware acceleration** via transform3d

### Visual Feedback
- Instant response to user input
- Smooth 60fps animations
- Optimized paint areas
- Efficient shadow rendering
