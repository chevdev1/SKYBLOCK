# Gameplay montage prompt (Hop to Olympus)

Use with a video AI / auto-editor that accepts a long gameplay recording. Paste the prompt below. Variants for 9:16 and a 15 s teaser at the end.

## Main prompt (30-45 s, 16:9)

Edit the uploaded gameplay recording of "Hop to Olympus", a voxel action RPG that runs in a browser, into a fast, beautiful 40-second highlight montage.

**Pick only the best moments:**
1. Fluid movement: rhythm hops on cloud islands, dashes, wall-runs, grappling hook, flying with wings.
2. Combat with clear hits: sword, spear, twin blades, katana, big particle bursts and screen shake.
3. Boss moments: a boss appearing, its attack, the final hit.
4. Beautiful locations: floating islands at golden hour, Gates of Olympus, space, the neon city of Horai, the Star Dome.
5. Cute moments: the cloud buddy Kumo hopping next to the hero.
6. Co-op or two characters on screen together, if present.

**Reject:** loading screens, menus and inventory (except a 1 s crafting-menu flash at most), long idle, falling off the map, camera clipping into blocks, any frame with a lot of Russian text, chat windows, nicknames, debug overlays, black or blurry frames.

**Structure (target):**
- 0.0-1.5 s: hook, the most spectacular single moment (a mega jump or a boss hit), slight slow-down.
- 1.5-12 s: movement and exploration, cuts every 0.8-1.2 s on the beat.
- 12-26 s: combat and bosses, cuts every 0.6-1.0 s, add a 0.3 s slow-motion on the biggest hit.
- 26-34 s: beautiful worlds, calmer, longer shots of 1.5-2 s, smooth cross-dissolves.
- 34-40 s: Kumo and the hero together, then hold on a clean final frame for 2 s.

**Style:** energetic, clean, game-trailer feel. Match cuts to the beat of the music (upbeat chiptune or light electronic, 120-140 BPM). Use punch-in zooms of 5-8% on impacts, quick whip transitions between locations, no cheesy effects, no heavy filters. Keep the original colors, slightly boosted contrast and saturation. Keep every shot sharp, avoid upscaling artifacts.

**On-screen text:** none inside the footage. Only two short overlays: at 0.5 s "HOP TO OLYMPUS" (bold, white with dark outline) and at 36 s "ALPHA TEST: OPENING SOON" with "No download. No sign-up." under it. Font style: chunky condensed sans. English only.

**Crop the UI:** crop or zoom to hide the game HUD and any non-English text where possible, without cutting the hero or the action.

**Output:** 1920x1080, 30 fps (60 if the source is 60), H.264. Then also export a 1080x1920 vertical version by re-framing on the hero (keep the hero in the center third), and a 15-second teaser built from the three best moments. Also return a list of timestamps of the 10 best clips from the source with a one-line description each, so I can re-cut manually.

## If the tool needs a short prompt

"Make a 40 s trailer-style highlight reel of this voxel action RPG gameplay: hook with the best moment, rhythm hopping and dashes, boss fights with slow-motion on the big hits, gorgeous floating-island and neon-city shots, cute cloud pet Kumo at the end. Cut on the beat of upbeat chiptune music, hide the HUD and Russian text by cropping, no menus or loading screens, add the title 'HOP TO OLYMPUS' at the start and 'ALPHA TEST: OPENING SOON' at the end. Export 16:9, 9:16 and a 15 s teaser, plus a timestamp list of the best clips."

## Tips
- Record at 1080p or higher, 60 fps, in English (`oblaka-lang` = en), with the HUD minimal. Avoid chat open.
- Provide the music separately if the tool does not generate it (royalty free only).
- First pass: ask for the timestamp list, review, then ask for the cut.
