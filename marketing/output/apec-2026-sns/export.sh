#!/bin/sh
# Renders the APEC 2026 SNS images into ~/Downloads with headless Chrome.
set -e
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1080,1350 --virtual-time-budget=6000 --screenshot="$HOME/Downloads/apec-2026-sns-feed.png" "file://$PWD/01-feed.html" 2>/dev/null
"$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1080,1920 --virtual-time-budget=6000 --screenshot="$HOME/Downloads/apec-2026-sns-story.png" "file://$PWD/02-story.html" 2>/dev/null
echo "Saved ~/Downloads/apec-2026-sns-feed.png and apec-2026-sns-story.png"
