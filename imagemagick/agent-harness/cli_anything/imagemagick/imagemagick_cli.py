"""
cli-anything-imagemagick - ImageMagick CLI for AI Agents
Built with CLI-Anything methodology
"""
import click
import json
import sys
import os
from typing import Optional, Dict, Any
from cli_anything.imagemagick.utils.imagemagick_backend import ImageMagickBackend

# Global session state for REPL
class Session:
    def __init__(self):
        self.backend = ImageMagickBackend()
        self.current_project: Optional[str] = None

pass_session = click.make_pass_decorator(Session, ensure=True)

def print_result(ok: bool, message: str, data: Optional[Dict[str, Any]] = None, json_output: bool = False):
    """Print result in either JSON or human format"""
    if json_output:
        result = {
            "success": ok,
            "message": message,
            "data": data or {}
        }
        click.echo(json.dumps(result, indent=2))
    else:
        if ok:
            click.secho(f"✓ {message}", fg="green")
            if data:
                for key, value in (data or {}).items():
                    click.echo(f"  {key}: {value}")
        else:
            click.secho(f"✗ {message}", fg="red")

@click.group(invoke_without_command=True)
@click.option('--json', '-j', is_flag=True, help='Output JSON for machine consumption')
@pass_session
def main(session, json):
    """
    cli-anything-imagemagick - ImageMagick image processing for AI Agents
    
    Image processing operations that won't break your token limit:
    - All heavy lifting done locally via ImageMagick
    - Only structured results sent back to agent
    - Perfect for fitting within platform token limits
    """
    if json:
        session.json_output = True
    else:
        session.json_output = False
    
    if click.get_current_context().invoked_subcommand is None:
        # No subcommand given - enter REPL
        from cli_anything.imagemagick.utils.repl_skin import run_repl
        run_repl(main, "cli-anything-imagemagick", "ImageMagick")
    sys.exit(0)

@main.command()
@click.argument('input_path', type=click.Path(exists=True))
@click.option('--json', '-j', is_flag=True, help='Output JSON')
@pass_session
def info(session, input_path, json):
    """Get information about an image"""
    info = session.backend.get_info(input_path)
    if info:
        dimensions = f"{info.get('geometry', {}).get('width')}x{info.get('geometry', {}).get('height')}"
        format = info.get('format', 'unknown')
        print_result(True, f"Image info for {input_path}", {
            "dimensions": dimensions,
            "format": format,
            "depth": info.get('depth'),
            "filesize": f"{os.path.getsize(input_path)/1024:.1f}KB"
        }, json or getattr(session, 'json_output', False))
    else:
        print_result(False, f"Failed to get info for {input_path}", None, 
                      json or getattr(session, 'json_output', False))

@main.command()
@click.argument('input_path', type=click.Path(exists=True))
@click.argument('output_path', type=click.Path())
@click.option('--width', '-w', type=int, help='Target width')
@click.option('--height', '-h', type=int, help='Target height')
@click.option('--no-aspect', '-f', is_flag=True, help='Do not preserve aspect ratio')
@click.option('--quality', '-q', type=int, default=85, help='Output quality (1-100)')
@click.option('--json', '-j', is_flag=True, help='Output JSON')
@pass_session
def resize(session, input_path, output_path, width, height, no_aspect, quality, json):
    """Resize an image"""
    if not width and not height:
        print_result(False, "Must specify at least one of --width or --height", None,
                      json or getattr(session, 'json_output', False))
        return
    
    ok, stderr = session.backend.resize(
        input_path, output_path, width, height, 
        keep_aspect=not no_aspect, quality=quality
    )
    if ok:
        size_info = ""
        if os.path.exists(output_path):
            size_info = f"Output size: {os.path.getsize(output_path)/1024:.1f}KB"
        print_result(True, f"Resized image saved to {output_path} {size_info}", None,
                      json or getattr(session, 'json_output', False))
    else:
        print_result(False, f"Resize failed: {stderr}", None,
                      json or getattr(session, 'json_output', False))

@main.command()
@click.argument('input_path', type=click.Path(exists=True))
@click.argument('output_path', type=click.Path())
@click.option('--quality', '-q', type=int, default=80, help='Compression quality (1-100)')
@click.option('--format', '-f', type=str, default='jpg', help='Output format')
@click.option('--json', '-j', is_flag=True, help='Output JSON')
@pass_session
def compress(session, input_path, output_path, quality, format, json):
    """Compress an image to reduce file size"""
    ok, stderr = session.backend.compress(input_path, output_path, quality, format)
    if ok:
        size_info = ""
        if os.path.exists(output_path):
            size_info = f"Output size: {os.path.getsize(output_path)/1024:.1f}KB"
        print_result(True, f"Compressed image saved to {output_path} {size_info}", None,
                      json or getattr(session, 'json_output', False))
    else:
        print_result(False, f"Compression failed: {stderr}", None,
                      json or getattr(session, 'json_output', False))

@main.command()
@click.argument('input_path', type=click.Path(exists=True))
@click.argument('output_path', type=click.Path())
@click.option('--format', '-f', type=str, required=True, help='Target format (jpg, png, webp, gif)')
@click.option('--json', '-j', is_flag=True, help='Output JSON')
@pass_session
def convert(session, input_path, output_path, format, json):
    """Convert image to another format"""
    ok, stderr = session.backend.convert_format(input_path, output_path, format)
    if ok:
        size_info = ""
        if os.path.exists(output_path):
            size_info = f"Output size: {os.path.getsize(output_path)/1024:.1f}KB"
        print_result(True, f"Converted image saved to {output_path} {size_info}", None,
                      json or getattr(session, 'json_output', False))
    else:
        print_result(False, f"Conversion failed: {stderr}", None,
                      json or getattr(session, 'json_output', False))

@main.command()
@click.argument('input_path', type=click.Path(exists=True))
@click.argument('output_path', type=click.Path())
@click.option('--x', type=int, required=True, help='Left X coordinate')
@click.option('--y', type=int, required=True, help='Top Y coordinate')
@click.option('--width', '-w', type=int, required=True, help='Crop width')
@click.option('--height', '-h', type=int, required=True, help='Crop height')
@click.option('--json', '-j', is_flag=True, help='Output JSON')
@pass_session
def crop(session, input_path, output_path, x, y, width, height, json):
    """Crop image to rectangle"""
    ok, stderr = session.backend.crop(input_path, output_path, x, y, width, height)
    if ok:
        print_result(True, f"Cropped image saved to {output_path}", None,
                      json or getattr(session, 'json_output', False))
    else:
        print_result(False, f"Crop failed: {stderr}", None,
                      json or getattr(session, 'json_output', False))

@main.command()
@click.argument('input_path', type=click.Path(exists=True))
@click.argument('output_path', type=click.Path())
@click.option('--degrees', '-d', type=float, required=True, help='Rotation degrees (90, 180, 270, etc)')
@click.option('--json', '-j', is_flag=True, help='Output JSON')
@pass_session
def rotate(session, input_path, output_path, degrees, json):
    """Rotate image by degrees"""
    ok, stderr = session.backend.rotate(input_path, output_path, degrees)
    if ok:
        print_result(True, f"Rotated image saved to {output_path}", None,
                      json or getattr(session, 'json_output', False))
    else:
        print_result(False, f"Rotation failed: {stderr}", None,
                      json or getattr(session, 'json_output', False))

@main.command()
@click.argument('input_path', type=click.Path(exists=True))
@click.argument('output_path', type=click.Path())
@click.option('--size', '-s', type=int, default=200, help='Thumbnail size')
@click.option('--quality', '-q', type=int, default=70, help='Quality')
@click.option('--json', '-j', is_flag=True, help='Output JSON')
@pass_session
def thumbnail(session, input_path, output_path, size, quality, json):
    """Create a square thumbnail"""
    ok, stderr = session.backend.thumbnail(input_path, output_path, size, quality)
    if ok:
        size_info = ""
        if os.path.exists(output_path):
            size_info = f"Output size: {os.path.getsize(output_path)/1024:.1f}KB"
        print_result(True, f"Thumbnail saved to {output_path} {size_info}", None,
                      json or getattr(session, 'json_output', False))
    else:
        print_result(False, f"Thumbnail creation failed: {stderr}", None,
                      json or getattr(session, 'json_output', False))

@main.command()
@click.argument('input_path', type=click.Path(exists=True))
@click.argument('output_path', type=click.Path())
@click.option('--max-width', '-w', type=int, default=1920, help='Maximum width')
@click.option('--max-size-kb', '-s', type=int, default=500, help='Maximum file size in KB')
@click.option('--json', '-j', is_flag=True, help='Output JSON')
@pass_session
def optimize(session, input_path, output_path, max_width, max_size_kb, json):
    """Optimize image for web - resize + compress to fit within size limit"""
    ok, message = session.backend.optimize_for_web(input_path, output_path, max_width, max_size_kb)
    if ok:
        size_kb = os.path.getsize(output_path) / 1024
        print_result(True, f"Optimized image saved to {output_path} ({size_kb:.1f}KB)", {
            "original_size_kb": f"{os.path.getsize(input_path)/1024:.1f}",
            "final_size_kb": f"{size_kb:.1f}"
        }, json or getattr(session, 'json_output', False))
    else:
        print_result(False, f"Optimization failed: {message}", None,
                      json or getattr(session, 'json_output', False))

@main.command()
@click.argument('input_path', type=click.Path(exists=True))
@click.argument('output_path', type=click.Path())
@click.option('--json', '-j', is_flag=True, help='Output JSON')
@pass_session
def flip_h(session, input_path, output_path, json):
    """Flip image horizontally"""
    ok, stderr = session.backend.flip_horizontal(input_path, output_path)
    if ok:
        print_result(True, f"Flipped image saved to {output_path}", None,
                      json or getattr(session, 'json_output', False))
    else:
        print_result(False, f"Flip failed: {stderr}", None,
                      json or getattr(session, 'json_output', False))

@main.command()
@click.argument('input_path', type=click.Path(exists=True))
@click.argument('output_path', type=click.Path())
@click.option('--json', '-j', is_flag=True, help='Output JSON')
@pass_session
def flip_v(session, input_path, output_path, json):
    """Flip image vertically"""
    ok, stderr = session.backend.flip_vertical(input_path, output_path)
    if ok:
        print_result(True, f"Flipped image saved to {output_path}", None,
                      json or getattr(session, 'json_output', False))
    else:
        print_result(False, f"Flip failed: {stderr}", None,
                      json or getattr(session, 'json_output', False))

if __name__ == '__main__':
    main()
