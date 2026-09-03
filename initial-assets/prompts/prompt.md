You are a UI design system analyst. You will be shown ONE screenshot of a
software interface, located at {{screenshot_path}}. Extract every observable
design fact into the exact JSON schema below. Do not guess at values you
cannot see — omit fields you're not confident about rather than inventing
plausible-looking data.

Output ONLY valid JSON. No preamble, no markdown fences, no commentary.

SCHEMA:
{
  "screen_id": "{{screen_id}}",
  "screenshot_path": "{{screenshot_path}}",
  "screen_name": "best guess at what this screen/page is, e.g. 'Settings > Profile'",
  "layout": {
    "structure": "sidebar+content | top-nav+content | single-column | grid | split-pane | other",
    "grid_columns": "number or null if not a grid",
    "breakpoint_hint": "mobile | tablet | desktop",
    "max_content_width_px": "estimate or null"
  },
  "colors": {
    "background": [{"hex": "#xxxxxx", "usage": "e.g. page background, card background"}],
    "text": [{"hex": "#xxxxxx", "usage": "e.g. heading, body, muted/secondary"}],
    "accent": [{"hex": "#xxxxxx", "usage": "e.g. primary button, link, active state"}],
    "border": [{"hex": "#xxxxxx", "usage": "e.g. card border, divider"}],
    "semantic": [{"hex": "#xxxxxx", "usage": "e.g. success, error, warning"}]
  },
  "typography": {
    "families_observed": ["font family names if identifiable, else 'sans-serif (unidentified)'"],
    "sizes_observed": [{"px": 0, "role": "e.g. h1, h2, body, caption, button-label"}],
    "weights_observed": [{"weight": "e.g. 400, 600, 700", "role": ""}],
    "line_height_notes": "tight | normal | loose, if distinguishable"
  },
  "spacing_scale_observed": [0, 0, 0],
  "corner_radius_observed": [{"px": 0, "usage": "e.g. buttons, cards, inputs"}],
  "shadows_observed": [{"description": "e.g. subtle card elevation", "usage": ""}],
  "components": [
    {
      "type": "button | input | card | nav-item | modal | table | badge | avatar | dropdown | tab | toggle | tooltip | other",
      "variant": "primary | secondary | ghost | destructive | etc",
      "properties": {
        "radius_px": null,
        "padding": "e.g. '8px 16px'",
        "border": "description or null",
        "shadow": "description or null",
        "icon_present": false
      },
      "state_visible": "default | hover | active | disabled | focus | error"
    }
  ],
  "content_patterns": "notable copy/microcopy/tone conventions (button verbs, empty-state language, etc.)",
  "notable_interactions": "anything implying behavior — dropdowns open, modals overlaying, etc."
}

Save the result to `analysis/xxx.json`