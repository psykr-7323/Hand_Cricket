# Design System Document: eSports Hand Cricket Edition

## 1. Overview & Creative North Star
**Creative North Star: "The Kinetic Broadcast"**

This design system moves away from static web layouts toward the high-octane, data-heavy aesthetic of a premium eSports broadcast. It is designed to feel "live," aggressive, and high-stakes. We achieve this through **Kinetic Asymmetry**—where elements feel like they are in motion—and **Aggressive Contrast**, pitting deep slate voids against electric neon accents.

Instead of a traditional flat grid, we use "The Clash" layout principle: overlapping layers and sharp, italicized geometry that suggests a head-to-head confrontation. The UI doesn't just display information; it "announces" it.

---

## 2. Colors
Our palette is rooted in the depth of a digital arena. We use deep slates to create an infinite "void," allowing our functional accents to pop with luminous intensity.

### The Palette
*   **The Void (Backgrounds):** `surface` (#0c1324) and `surface_container_lowest` (#070d1f).
*   **The Batting Strike (Primary):** `primary` (#5af0b3 / Emerald-400 equivalent). Use this for "In-Play" states and success.
*   **The Wicket (Secondary):** `secondary` (#ffb3ad / Red-500 equivalent). Use this for "Out" states and high-tension alerts.
*   **The Data Overlay (Tertiary):** `tertiary` (#bfd8ff). Used for non-gameplay stats and secondary broadcast info.

### Color Rules
*   **The "No-Line" Rule:** Do not use 1px solid borders to define the edges of the game board. Instead, use background shifts. A `surface_container_low` section sitting on a `surface` background is the only way to define sections.
*   **Surface Hierarchy & Nesting:** Treat the UI as a "Command Center." Use `surface_container_highest` (#2e3447) for the most interactive player consoles, nested inside `surface_container_low` (#151b2d) arena backgrounds.
*   **Signature Textures:** Apply a linear gradient from `primary` (#5af0b3) to `primary_container` (#34d399) at a 135-degree angle for all main action buttons to give them a "lit from within" neon-tube effect.

---

## 3. Typography
Typography is our primary vehicle for the "eSports" feel. We pair the industrial reliability of **Inter** with the futuristic, wide-set nature of **Space Grotesk**.

*   **Display & Headlines (Space Grotesk):** All headlines must be **Bold**, **Italic**, and **Uppercase**. Increase tracking (`letter-spacing`) to `0.1em` minimum for a "stretched" broadcast look.
    *   *Role:* Massive score counters (`display-lg`), "OUT" announcements, and "BATTER UP" prompts.
*   **Body & Labels (Inter):** High-readability sans-serif for stats, rules, and settings.
    *   *Role:* Player names, historical averages, and UI labels. Use `label-md` for metadata, always in uppercase with `tracking-widest`.

---

## 4. Elevation & Depth
In this system, depth is "Tactile Digital." We want the user to feel like they are pressing physical, illuminated buttons on a high-end broadcast switcher.

*   **The Layering Principle:** Stacking is mandatory. The "Scoreboard" should be a `surface_container_highest` block floating over the `surface` arena. 
*   **Inner Shadows (Clash Zones):** For the central area where the "Player Move" and "AI Move" meet, use a heavy **Inner Shadow**. This creates a "pit" or "arena" feel where the action happens. 
*   **Ambient Shadows:** Floating cards use an extra-diffused shadow.
    *   *Shadow Color:* `#000000` at 40% opacity (higher than standard due to high-contrast theme).
    *   *Blur:* 30px - 50px for a "heavy" presence.
*   **The "Ghost Border":** To maintain the "Sleek Card" requirement, use `outline_variant` (#3c4a42) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Tactile 3D Buttons
Buttons are not flat. They are "Physical Switches."
*   **Primary (Batting/Start):** Gradient of `primary` to `primary_container`. 4px bottom-offset dark shadow to create a 3D "pressable" look.
*   **Shape:** `md` (0.375rem) corner radius. Avoid fully rounded buttons; keep them angular and aggressive.
*   **State:** On `:active`, remove the bottom shadow and shift the element down 2px to simulate a mechanical click.

### Massive Score Cards
*   **Visuals:** Use `surface_container_highest` with `display-lg` numbers.
*   **Asymmetry:** Place the "Runs" score slightly off-center to the left, and the "Wickets" score to the bottom right in a smaller `headline-sm` font.

### Clash Zones (The Play Area)
*   Two `surface_container_low` containers with a 20px gap. 
*   Use an **Inner Shadow** (`inset 0 4px 12px rgba(0,0,0,0.5)`) to make these look like recessed bays in a console.

### Chips (Game Stats)
*   No background. Use `outline` (#85948b) at 20% opacity for the container and `label-sm` text in `primary` or `secondary` colors.

### Input Fields (Betting/Predicting)
*   **Style:** Minimalist. No background. Bottom border only using `primary` (2px).
*   **Focus:** The bottom border glows using a `primary` drop shadow (0 0 8px).

---

## 6. Do's and Don'ts

### Do
*   **Do** use italics for all "action" text (headers, buttons).
*   **Do** lean into the "Slate" depth. The darker the background, the more the neon accents shine.
*   **Do** use massive scale differences. A score of "124" should be 5x larger than the "Runs" label.
*   **Do** use `backdrop-blur` (12px) on any floating modal or pause menu.

### Don't
*   **Don't** use standard "web" blue or grey. If it's not Slate or Emerald, it doesn't belong.
*   **Don't** use thin font weights. Everything in eSports is about impact; keep it Bold or Black.
*   **Don't** use dividers or lines to separate list items. Use vertical spacing (16px or 24px) to let the data breathe.
*   **Don't** use "Soft" rounded corners. Stick to `sm` or `md` scales to keep the "edge" of the competition.