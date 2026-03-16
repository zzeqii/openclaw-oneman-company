"""
Unit tests for cli-anything-imagemagick
"""
import pytest
import os
import tempfile
from cli_anything.imagemagick.utils.imagemagick_backend import ImageMagickBackend

class TestImageMagickBackend:
    @pytest.fixture
    def backend(self):
        return ImageMagickBackend()
    
    @pytest.fixture
    def test_image(self):
        # Create a simple test image using PIL
        from PIL import Image
        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as f:
            img = Image.new('RGB', (1000, 800), color = (73, 109, 137))
            img.save(f, 'PNG')
            return f.name
    
    def test_get_info(self, backend, test_image):
        info = backend.get_info(test_image)
        assert info is not None
        assert 'geometry' in info
        assert info['geometry']['width'] == 1000
        assert info['geometry']['height'] == 800
        os.unlink(test_image)
    
    def test_resize(self, backend, test_image):
        with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as f:
            output_path = f.name
        
        ok, err = backend.resize(test_image, output_path, width=500, quality=85)
        assert ok
        assert os.path.exists(output_path)
        size = os.path.getsize(output_path)
        assert size > 0
        
        info = backend.get_info(output_path)
        assert info['geometry']['width'] == 500
        
        os.unlink(test_image)
        os.unlink(output_path)
    
    def test_compress(self, backend, test_image):
        with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as f:
            output_path = f.name
        
        ok, err = backend.compress(test_image, output_path, quality=50)
        assert ok
        assert os.path.exists(output_path)
        assert os.path.getsize(output_path) > 0
        os.unlink(test_image)
        os.unlink(output_path)
    
    def test_thumbnail(self, backend, test_image):
        with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as f:
            output_path = f.name
        
        ok, err = backend.thumbnail(test_image, output_path, size=200, quality=70)
        assert ok
        assert os.path.exists(output_path)
        info = backend.get_info(output_path)
        # Should be 200x200 after thumbnail
        assert info['geometry']['width'] == 200
        assert info['geometry']['height'] == 200
        os.unlink(test_image)
        os.unlink(output_path)
    
    def test_optimize_for_web(self, backend, test_image):
        with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as f:
            output_path = f.name
        
        ok, msg = backend.optimize_for_web(test_image, output_path, max_width=500, max_size_kb=100)
        assert ok
        assert os.path.exists(output_path)
        size_kb = os.path.getsize(output_path) / 1024
        assert size_kb <= 100
        os.unlink(test_image)
        os.unlink(output_path)
    
    def test_crop(self, backend, test_image):
        with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as f:
            output_path = f.name
        
        ok, err = backend.crop(test_image, output_path, 100, 100, 200, 200)
        assert ok
        assert os.path.exists(output_path)
        info = backend.get_info(output_path)
        assert info['geometry']['width'] == 200
        assert info['geometry']['height'] == 200
        os.unlink(test_image)
        os.unlink(output_path)
