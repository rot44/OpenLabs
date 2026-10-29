---
name: 21st-dot-dev
description: Guidelines and patterns for implementing 21st.dev inspired modern animations, rich micro-interactions, glowing borders, card hover effects, and interactive UI components.
metadata:
  author: openlabs
  version: "1.0.0"
---

# 21st.dev Design System & Components Skill

This skill guides the implementation of premium, high-interaction 21st.dev style components:

## Design Signatures
1. **Dark Zinc Engineering Aesthetic**: `#09090b` canvas with glowing emerald/cyan neon accents and subtle glassmorphic backdrop blurs.
2. **Interactive Sliders & Diff Viewers**: Smooth draggable comparison dividers with touch/mouse tracking and visual bounding box overlays.
3. **Animated Pulse Badges & Neon Borders**: Subtle glowing rings and status pulses (`ring-2 ring-emerald-500/50`) without layout shift.
4. **Micro-Interactions**: Hover lifts (`hover:-translate-y-0.5`), subtle scale transitions, dynamic time counters, and celebratory confetti upon task completion.
5. **Zero Layout Shift (CLS = 0)**: Fixed aspect ratios for images, skeleton states, and pre-computed container heights.
