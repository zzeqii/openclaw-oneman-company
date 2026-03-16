from setuptools import setup, find_namespace_packages

setup(
    name="cli-anything-imagemagick",
    version="1.0.0",
    description="CLI-Anything harness for ImageMagick image processing",
    author="OpenClaw",
    packages=find_namespace_packages(include=["cli_anything.*"]),
    install_requires=[
        "click>=8.0",
    ],
    entry_points={
        "console_scripts": [
            "cli-anything-imagemagick = cli_anything.imagemagick.imagemagick_cli:main",
        ],
    },
    classifiers=[
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
    ],
)
