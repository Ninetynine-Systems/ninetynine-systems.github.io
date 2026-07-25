# Site redesign — Cinematic Frontier direction

**Date:** 2026-07-16

**Scope:** ninetynine.systems landing page

**Status:** Implemented as an uncommitted experiment after checkpoint `c7385af`

## Intent

The design takes loose structural inspiration from SpaceX without borrowing its identity, assets, or exact styling. The transferable ideas are:

- One consequential claim per near-viewport chapter.
- Imagery and scale carry atmosphere; copy stays short.
- Alternating composition creates momentum without decorative components.
- Frontier language is grounded by tangible systems and operating principles.
- Navigation is quiet, persistent, and secondary to the story.

The ninetynine.systems interpretation remains distinctly editorial, technical, and reliability-led.

## Core statement

> Build what the future can depend on.

The page argument is:

> future → human command → product proof → operating standard → breadth → partnership

## Visual language

- Carbon-black cinematic chapters alternate with one warm editorial standard section.
- Source Serif 4 carries the primary voice, keeping the experience closer to a research institution than an aerospace imitation.
- JetBrains Mono provides sparse identifiers and operating status.
- Oxide remains a signal rather than a background color.
- Hard rectangular actions, thin rules, and exact alignment communicate control.
- The 99 is repeated only as a functional brand image: interactive particles in the hero and restrained line work in later chapters.

## Imagery

The page uses three kinds of original or owned imagery:

1. The interactive particle 99 as the opening monument.
2. A custom textured Earth for the mission chapter, using atmospheric shading, irregular land and cloud material, and an extremely slow surface turn beneath a fixed terminator.
3. A real Gatekeeper example workspace for product proof, clearly labeled as an example.

No SpaceX photography, logos, copy, or proprietary visual assets are used.

## Page sequence

1. Hero — “Build what the future can depend on.”
2. Mission — “Keep humanity in command.”
3. Gatekeeper — “Human authority. At machine speed.”
4. Standard — “Reliability is part of the invention.”
5. Systems — “Different worlds. One standard.”
6. Studio — “We build at the hard edge of possibility.”

## Voice

- Use short, affirmative claims with a concrete second sentence.
- Speak about humanity through authority and recoverability, not vague inspiration.
- Speak about the frontier as an operating problem, not a science-fiction aesthetic.
- Keep reliability embedded in the action: decide, recover, verify.
- Avoid superlatives that require proof and avoid copying recognizable SpaceX phrasing.

## Motion

- The particle 99 remains the primary continuous spectacle.
- The mission Earth adds only a restrained, independent surface-and-cloud drift so its rotation can be perceived without becoming a second spectacle.
- Sections reveal once with a short vertical transition.
- The header tracks chapter and page progress without becoming a dashboard.
- All motion collapses under `prefers-reduced-motion`.

## Responsive behavior

- Desktop chapters use a 12-column shell and alternate left/right emphasis.
- Mobile chapters preserve the cinematic order: image first, claim second, action last.
- The compact navigation retains every destination in a horizontally safe second row.
- Product rows recompose into two-line records rather than card stacks.

## Quality floor

- Semantic landmarks, one H1, visible focus, skip navigation, and explicit new-tab labels.
- No horizontal overflow from 360px through desktop widths.
- Local fonts and local visual assets only.
- Static fallback for the particle mark and complete no-JavaScript content.
- Zero-build GitHub Pages architecture with automated HTML-adjacent and JavaScript syntax checks.
