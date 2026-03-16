# cli-anything-imagemagick

> CLI-Anything generated harness for ImageMagick image processing - solves the token overflow problem when sending images to LLM chat platforms.

## Problem

When AI agents need to process images before sending them to chat:
- ❌ **Before**: Sending full-size base64 images directly = token overflow = session disconnected = restart required
- ✅ **After**: Local CLI processing → send only small previews/text = token count stays under limit = no disconnects

## Installation

```bash
# Install ImageMagick first (macOS)
brew install imagemagick

# Install the CLI harness
cd agent-harness
pip install -e .
```

## Usage

```bash
# Get information about an image
cli-anything-imagemagick info image.jpg

# Resize an image
cli-anything-imagemagick resize input.jpg output.jpg --width 800 --quality 85

# Compress an image to reduce file size
cli-anything-imagemagick compress input.jpg output.jpg --quality 60

# Optimize for web (resize + compress to fit within size limit)
cli-anything-imagemagick optimize input.jpg output.jpg --max-width 1200 --max-size-kb 300

# Create a thumbnail
cli-anything-imagemagick thumbnail input.jpg thumb.jpg --size 200

# Convert format
cli-anything-imagemagick convert input.png output.webp --format webp

# Crop
cli-anything-imagemagick crop input.jpg output.jpg --x 100 --y 100 --width 400 --height 300

# Get JSON output for agent consumption
cli-anything-imagemagick --json info image.jpg
```

## Supported Commands

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

## Architecture

This harness follows the [CLI-Anything](https://github.com/HKUDS/CLI-Anything) methodology:

- `cli_anything/imagemagick/imagemagick_cli.py` - Main Click CLI definition
- `cli_anything/imagemagick/utils/imagemagick_backend.py` - Wrapper calling actual ImageMagick `magick` binary
- `cli_anything/imagemagick/utils/repl_skin.py` - Unified REPL interface

## Benefits for OpenClaw + Feishu

1. **Solve token overflow**: Large images processed locally, never send full base64 to Feishu
2. **Agent-friendly JSON output**: Every command supports `--json` for easy parsing
3. **REPL interactive mode**: Run `cli-anything-imagemagick` for interactive processing
4. **100% passes tests**: All 6 core tests pass with ImageMagick 7.1.2

## Testing

```bash
python -m pytest cli_anything/imagemagick/tests/test_core.py -v
```

## Generated with

Built with [CLI-Anything](https://github.com/HKUDS/CLI-Anything) - All software becomes agent-native.
