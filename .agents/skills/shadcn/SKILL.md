---
name: shadcn
description: Guidance and best practices for integrating, configuring, and composing shadcn/ui components with Tailwind CSS and Radix UI in React applications.
metadata:
  author: openlabs
  version: "1.0.0"
---

# shadcn/ui React Integration Skill

This skill provides guidelines and patterns for building high-craft accessible web interfaces with shadcn/ui patterns and Tailwind CSS in React 19 / Vite applications.

## Core Principles
1. **Zero Runtime Bloat**: Copy-and-paste composable components over heavy bloated UI component libraries.
2. **Accessible Radix Primitives**: Full keyboard navigation, ARIA roles, focus management, and portal dialogs.
3. **Tailwind Design System Tokens**: Use CSS variables and semantic design tokens:
   - `background`: Canvas background (Zinc 950 `#09090b`)
   - `card` / `card-foreground`: Elevated surface (Zinc 900 `#18181b`)
   - `border`: Subtle divider lines (Zinc 800 `#27272a`)
   - `primary`: Accent branding (Emerald 500 `#10b981`)
   - `accent`: Secondary pop (Cyan 500 `#06b6d4`)
   - `muted`: Secondary text & subtle fills (Zinc 400 / Zinc 800)
4. **cn Helper Function**: Combine `clsx` and `tailwind-merge` for clean conditional class merging without collision.
