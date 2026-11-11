# ROBOTECH 2026 reel (TikTok / Reels / Shorts)

49-second 1080x1920 cut of the founders' clips and photos from the 2026 ROBOTECH
Embodied Robotics Technology & Application Expo (Shenzhen World, Bao'an,
27–29 October 2026). Output: ~/Downloads/robotech-2026-shenzhen-reel.mp4.

- `*.html`: caption overlays, rendered to transparent PNGs by headless Chrome at 1080x1920.
- `build.py`: cuts each clip, applies the overlay with a slide-and-fade, Ken Burns
  on the photos, blurs the end card, then chains everything with 0.45 s cross-fades
  and normalises audio to -14 LUFS. It reads the source clips from the folder in
  ~/Downloads named after the expo.
- Left out on purpose: clips and photos with identifiable faces of bystanders
  (1889, 1917-style booth photos), and the 360p charging-robot clip.
- No music is added; add a track from the platform's library when posting.
