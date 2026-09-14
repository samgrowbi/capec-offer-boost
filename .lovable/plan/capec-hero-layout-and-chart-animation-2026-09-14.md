# CapEc hero layout and chart animation

## Scope
- Preserve every existing word, button style, chart color, grid line, and chart shape.
- Change only the hero layout at desktop widths and the chart's initial animation.

## Implementation
- Keep the current stacked, centered hero unchanged below 1024px.
- At 1024px and above, switch the hero content to a roughly 45/55 two-column grid with a 48–64px gutter.
- Place the existing chart in the left column and vertically center it; place the existing badge, headline, subhead, and CTAs in the right column with left alignment.
- Group each existing bar column so it rises from the shared baseline in a short left-to-right stagger.
- Pop each existing green marker after its matching bar finishes, then reveal the existing green path left to right using stroke dash offset.
- Run the sequence once when the chart mounts, finish within about 1.5–2 seconds, and show the final state immediately when reduced motion is preferred.

## Verification
- Check desktop and mobile screenshots to confirm desktop-only reordering, adequate gutter, and unchanged mobile stacking.
- Confirm the animation runs once, the line uses a drawn stroke reveal, reduced motion removes animation, and the page has no build or runtime errors.
