# Drum Kit Images

This directory contains SVG images for the Virtual Drums application, providing realistic visual representations of drum kit components.

## Image Files

### Drums
- `kick-drum.svg` - Bass drum (kick) with realistic proportions and bass port
- `snare-drum.svg` - Snare drum with snare strainer and wires visible
- `tom-drum.svg` - Tom drum with mounting hardware (used for high and mid toms)
- `floor-tom.svg` - Floor tom with legs and larger size

### Cymbals
- `hihat.svg` - Hi-hat cymbals with stand and clutch mechanism
- `crash-cymbal.svg` - Crash cymbal with stand and concentric rings
- `ride-cymbal.svg` - Ride cymbal with larger size and prominent bell

## Design Features

All images are created with:
- **Top-down perspective** for optimal drum kit view
- **SVG format** for crisp scaling at any size
- **Realistic details** including stands, hardware, and texture
- **Consistent color scheme** (gold cymbals, wood drums, metal hardware)
- **Shadow effects** for depth perception
- **Brand text** for identification

## Usage

These images are automatically loaded by the DrumPad component based on the configuration in `src/lib/constants.ts`. Each drum type has:
- Specific image file path
- Position coordinates (x, y percentages)
- Size dimensions (width, height in pixels)

## Attribution

All drum images are original SVG creations for the Virtual Drums project, designed to provide an immersive and realistic drumming experience. 