"""
ImageMagick backend wrapper for CLI-Anything
Calls the actual magick/convert command-line tool for image processing
"""
import subprocess
import json
from typing import Optional, Dict, Any, Tuple, List

class ImageMagickBackend:
    def __init__(self):
        self.magick_path = self._find_magick()
    
    def _find_magick(self) -> str:
        """Find the magick binary"""
        for cmd in ['magick', 'convert']:
            try:
                result = subprocess.run([cmd, '--version'], capture_output=True, text=True)
                if result.returncode == 0:
                    return cmd
            except FileNotFoundError:
                continue
        raise RuntimeError("ImageMagick not found. Please install it first (brew install imagemagick)")
    
    def _run_command(self, args: List[str]) -> Tuple[bool, str, str]:
        """Run a command and return result"""
        # If magick_path is already 'magick', args already starts with the subcommand
        if self.magick_path == 'magick' or self.magick_path == 'convert':
            full_args = [self.magick_path] + args
        else:
            full_args = [self.magick_path] + args
        result = subprocess.run(full_args, capture_output=True, text=True)
        return (result.returncode == 0, result.stdout, result.stderr)
    
    def get_info(self, input_path: str) -> Optional[Dict[str, Any]]:
        """Get image information in JSON format"""
        # First try JSON format
        ok, stdout, stderr = self._run_command(['identify', '-json', input_path])
        if not ok:
            # If JSON fails, parse manually at least get dimensions
            ok, stdout, stderr = self._run_command(['identify', input_path])
            if not ok:
                return None
        
        # Manual parsing from standard output
        # Sample output: "/tmp/test.png PNG 1000x800 1000x800+0+0 8-bit sRGB 2406B 0.000u 0:00.001"
        parts = stdout.strip().split()
        if len(parts) >= 3:
            dims = parts[2].split('x')
            if len(dims) >= 2:
                try:
                    width = int(dims[0])
                    height = int(dims[1])
                    return {
                        'format': parts[1],
                        'geometry': {
                            'width': width,
                            'height': height
                        },
                        'filename': parts[0]
                    }
                except ValueError:
                    pass
        return None
    
    def resize(self, input_path: str, output_path: str, width: Optional[int] = None, 
              height: Optional[int] = None, keep_aspect: bool = True, 
              quality: int = 85) -> Tuple[bool, str]:
        """Resize image"""
        args = [input_path]
        
        if keep_aspect:
            if width and height:
                args.extend(['-resize', f'{width}x{height}'])
            elif width:
                args.extend(['-resize', f'{width}x'])
            elif height:
                args.extend(['-resize', f'x{height}'])
        else:
            if width and height:
                args.extend(['-resize', f'{width}x{height}!'])
        
        args.extend(['-quality', str(quality), output_path])
        
        ok, _, stderr = self._run_command(args)
        return ok, stderr
    
    def compress(self, input_path: str, output_path: str, quality: int = 80, 
                format: str = 'jpg') -> Tuple[bool, str]:
        """Compress image to reduce file size"""
        args = [input_path, '-quality', str(quality)]
        
        if format == 'jpg' or format == 'jpeg':
            args.extend(['-sampling-factor', '4:2:0'])
        
        args.append(output_path)
        
        ok, _, stderr = self._run_command(args)
        return ok, stderr
    
    def convert_format(self, input_path: str, output_path: str, format: str) -> Tuple[bool, str]:
        """Convert image to another format"""
        args = [input_path]
        
        if format == 'webp':
            args.extend(['-quality', '80'])
        
        args.append(output_path)
        
        ok, _, stderr = self._run_command(args)
        return ok, stderr
    
    def crop(self, input_path: str, output_path: str, x: int, y: int, 
            width: int, height: int) -> Tuple[bool, str]:
        """Crop image to rectangle"""
        args = [input_path, '-crop', f'{width}x{height}+{x}+{y}', '+repage', output_path]
        ok, _, stderr = self._run_command(args)
        return ok, stderr
    
    def rotate(self, input_path: str, output_path: str, degrees: float) -> Tuple[bool, str]:
        """Rotate image"""
        args = [input_path, '-rotate', str(degrees), output_path]
        ok, _, stderr = self._run_command(args)
        return ok, stderr
    
    def flip_horizontal(self, input_path: str, output_path: str) -> Tuple[bool, str]:
        """Flip image horizontally"""
        args = [input_path, '-flop', output_path]
        ok, _, stderr = self._run_command(args)
        return ok, stderr
    
    def flip_vertical(self, input_path: str, output_path: str) -> Tuple[bool, str]:
        """Flip image vertically"""
        args = [input_path, '-flip', output_path]
        ok, _, stderr = self._run_command(args)
        return ok, stderr
    
    def thumbnail(self, input_path: str, output_path: str, size: int = 200, 
                 quality: int = 70) -> Tuple[bool, str]:
        """Create a thumbnail"""
        args = [input_path, '-thumbnail', f'{size}x{size}^', '-gravity', 'center', 
                '-extent', f'{size}x{size}', '-quality', str(quality), output_path]
        ok, _, stderr = self._run_command(args)
        return ok, stderr
    
    def optimize_for_web(self, input_path: str, output_path: str, 
                       max_width: int = 1920, max_size_kb: int = 500) -> Tuple[bool, str]:
        """Optimize image for web - resize + compress"""
        # First get info
        info = self.get_info(input_path)
        if not info:
            return False, "Failed to get image info"
        
        # Resize if too wide
        width = info.get('geometry', {}).get('width', 0)
        if width > max_width:
            # First resize to max_width
            temp_path = output_path + '.tmp.jpg'
            ok, err = self.resize(input_path, temp_path, width=max_width, quality=90)
            if not ok:
                return False, err
            current_path = temp_path
        else:
            current_path = input_path
        
        # Compress with decreasing quality until size is under limit
        for quality in [85, 75, 65, 55, 45]:
            ok, err = self.compress(current_path, output_path, quality=quality)
            if not ok:
                return False, err
            
            # Check file size
            import os
            try:
                size_kb = os.path.getsize(output_path) / 1024
                if size_kb <= max_size_kb:
                    if current_path != input_path:
                        os.remove(temp_path)
                    return True, f"Optimized to {size_kb:.1f}KB with quality {quality}"
            except OSError:
                pass
        
        if current_path != input_path:
            os.remove(temp_path)
        return False, "Could not compress to target size even at lowest quality"
