# ImageMagick CLI-Anything Harness

## Overview

Automatically generated CLI harness for ImageMagick image processing. This harness provides agent-native access to all common image processing operations needed for AI agent workflows, specifically designed to solve the **token overflow problem** when sending images to LLM chat platforms like Feishu.

## Problem Solved

When AI agents need to process images before sending them to chat:
- ❌ Before: Sending full-size base64 images directly = token overflow = session disconnected = restart required
- ✅ After: Local CLI processing → send only small previews/text = token count stays under limit = no disconnects

## Installation

```bash
cd imagemagick/agent-harness
pip install -e .
```

## Usage

### Command Line

```bash
# Get info about an image
cli-anything-imagemagick info image.jpg

# Resize an image
cli-anything-imagemagick resize input.jpg output.jpg --width 800 --quality 85

# Compress an image to reduce file size
cli-anything-imagemagick compress input.jpg output.jpg --quality 60

# Optimize for web (resize + compress to fit under size limit)
cli-anything-imagemagick optimize input.jpg output.jpg --max-width 1200 --max-size-kb 300

# Create a thumbnail
cli-anything-imagemagick thumbnail input.jpg thumb.jpg --size 200

# Convert format
cli-anything-imagemagick convert input.png output.webp --format webp

# Crop
cli-anything-imagemagick crop input.jpg output.jpg --x 100 --y 100 --width 400 --height 300

# Rotate
cli-anything-imagemagick rotate input.jpg output.jpg --degrees 90

# JSON output for agent consumption
cli-anything-imagemagick --json info image.jpg
```

### REPL Mode (Interactive)

Just run without any command:

```bash
cli-anything-imagemagick
```

## Architecture

- `imagemagick_cli.py` - Main Click CLI definition with all commands
- `utils/imagemagick_backend.py` - Wrapper calling actual ImageMagick `magick` binary
- `utils/repl_skin.py` - Unified REPL interface following CLI-Anything standard

## Supported Operations

| Command | Description |
|---------|-------------|
| `info` | Get image dimensions, format, file size |
| `resize` | Resize image with aspect ratio control |
| `compress` | Compress with quality setting |
| `convert` | Convert between formats (jpg, png, webp, gif) |
| `crop` | Crop to rectangle |
| `rotate` | Rotate by degrees |
| `thumbnail` | Create square centered thumbnail |
| `optimize` | Auto-optimize for web (resize + compress to target size) |
| `flip-h` | Flip horizontally |
| `flip-v` | Flip vertically |

## JSON Output

Every command supports `--json` flag for structured output that agents can easily parse:

```json
{
  "success": true,
  "message": "Optimized image saved to output.jpg (245.1KB)",
  "data": {
    "original_size_kb": "2450.3",
    "final_size_kb": "245.1"
  }
}
```

## Testing

Run tests with:

```bash
python -m pytest cli_anything/imagemagick/tests/ -v
```
