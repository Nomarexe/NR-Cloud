#!/bin/bash
# Setup script to install necessary packages for the project on Linux, macOS, and Windows (using Git Bash or WSL)

echo "Installing required packages..."

# Check for python3 or python
if command -v python3 &>/dev/null; then
    PYTHON=python3
elif command -v python &>/dev/null; then
    PYTHON=python
else
    echo "Python is not installed. Please install Python 3.x before proceeding."
    exit 1
fi

# Check for pip
if ! command -v pip &>/dev/null; then
    echo "pip is not installed. Installing pip..."
    $PYTHON -m ensurepip --upgrade
fi

# Install Flask
echo "Installing Flask..."
$PYTHON -m pip install --upgrade pip
$PYTHON -m pip install Flask

echo "Setup complete. You can start the server with:"
echo "$PYTHON app.py"
