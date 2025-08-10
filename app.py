from flask import Flask, jsonify, send_from_directory, render_template_string, request
import os
import re
import logging
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder='')

VIDEO_DIR = 'Video'
GALLERY_DIR = 'Galleria'  # Folder containing gallery images and videos
AUDIO_DIR = 'Audio'  # Folder containing audio files
DOCUMENTS_DIR = 'Documents'  # Folder containing documents

# Allowed file extensions for uploads
ALLOWED_EXTENSIONS = {
    'audio': {'mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'},
    'video': {'mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'},
    'documents': {'pdf', 'doc', 'docx', 'txt', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'},
    'gallery': {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'mp4', 'webm', 'ogg'}
}

def allowed_file(filename, category):
    """Check if file extension is allowed for the given category"""
    if '.' not in filename:
        return False
    ext = filename.rsplit('.', 1)[1].lower()
    return ext in ALLOWED_EXTENSIONS.get(category, set())

def extract_title(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE | re.DOTALL)
    if match:
        return match.group(1).strip()
    return os.path.basename(file_path)

@app.route('/')
def serve_index_html():
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    return render_template_string(content)

# Articles endpoints removed - replaced with video section

@app.route('/api/documents')
def list_documents():
    """List all documents from the Documents folder"""
    try:
        if not os.path.exists(DOCUMENTS_DIR):
            return jsonify([])
        
        files = sorted(os.listdir(DOCUMENTS_DIR))
        # Supported document formats
        supported_extensions = {
            '.pdf': 'PDF',
            '.docx': 'DOCX',
            '.doc': 'DOC',
            '.txt': 'TXT',
            '.svg': 'SVG',
            '.png': 'PNG',
            '.jpg': 'JPG',
            '.jpeg': 'JPEG',
            '.gif': 'GIF',
            '.bmp': 'BMP',
            '.webp': 'WEBP'
        }
        
        documents = []
        for filename in files:
            file_path = os.path.join(DOCUMENTS_DIR, filename)
            if os.path.isfile(file_path):
                file_ext = os.path.splitext(filename)[1].lower()
                if file_ext in supported_extensions:
                    file_size = os.path.getsize(file_path)
                    documents.append({
                        'name': filename,
                        'type': supported_extensions[file_ext],
                        'url': f"/{DOCUMENTS_DIR}/{filename}",
                        'size': file_size
                    })
        
        return jsonify(documents)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/Documents/<path:filename>')
def serve_document_file(filename):
    """Serve document files from the Documents folder"""
    return send_from_directory(DOCUMENTS_DIR, filename)

@app.route('/api/gallery')
def list_gallery_media():
    try:
        files = sorted(os.listdir(GALLERY_DIR))
        # Filter image and video files by common extensions
        image_extensions = ('.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp')
        video_extensions = ('.mp4', '.webm', '.ogg')
        media_files = [f for f in files if f.lower().endswith(image_extensions + video_extensions)]
        # Return URLs relative to server root
        media_urls = [f"/{GALLERY_DIR}/{media}" for media in media_files]
        return jsonify(media_urls)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/Galleria/<path:filename>')
def serve_gallery_file(filename):
    return send_from_directory(GALLERY_DIR, filename)

@app.route('/api/audio')
def list_audio_files():
    try:
        files = sorted(os.listdir(AUDIO_DIR))
        # Filter audio files by common extensions
        audio_extensions = ('.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a')
        audio_files = [f for f in files if f.lower().endswith(audio_extensions)]
        # Return URLs relative to server root
        audio_urls = [f"/{AUDIO_DIR}/{audio}" for audio in audio_files]
        return jsonify(audio_urls)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/videos')
def list_videos():
    try:
        files = sorted(os.listdir(VIDEO_DIR))
        # Filter video files by common extensions
        video_extensions = ('.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv')
        video_files = [f for f in files if f.lower().endswith(video_extensions)]
        # Return URLs relative to server root
        video_urls = [f"/{VIDEO_DIR}/{video}" for video in video_files]
        return jsonify(video_urls)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/Video/<path:filename>')
def serve_video_file(filename):
    return send_from_directory(VIDEO_DIR, filename)

@app.route('/Audio/<path:filename>')
def serve_audio_file(filename):
    return send_from_directory(AUDIO_DIR, filename)

# Upload endpoints
@app.route('/api/upload/<category>', methods=['POST'])
def upload_file(category):
    """Handle file uploads for different categories"""
    try:
        if category not in ['audio', 'video', 'documents', 'gallery']:
            return jsonify({"success": False, "error": "Invalid category"}), 400
        
        if 'file' not in request.files:
            return jsonify({"success": False, "error": "No file provided"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"success": False, "error": "No file selected"}), 400
        
        if file and allowed_file(file.filename, category):
            filename = secure_filename(file.filename)
            
            # Determine target directory based on category
            target_dir = {
                'audio': AUDIO_DIR,
                'video': VIDEO_DIR,
                'documents': DOCUMENTS_DIR,
                'gallery': GALLERY_DIR
            }.get(category)
            
            if not os.path.exists(target_dir):
                os.makedirs(target_dir)
            
            file_path = os.path.join(target_dir, filename)
            
            # Check if file already exists
            if os.path.exists(file_path):
                base, ext = os.path.splitext(filename)
                counter = 1
                while os.path.exists(file_path):
                    filename = f"{base}_{counter}{ext}"
                    file_path = os.path.join(target_dir, filename)
                    counter += 1
            
            file.save(file_path)
            return jsonify({"success": True, "filename": filename})
        else:
            return jsonify({"success": False, "error": "File type not allowed"}), 400
            
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    import sys
    import threading
    import requests
    import time

    # Suppress the development server warning
    logging.getLogger('werkzeug').setLevel(logging.ERROR)

    port = 8080  # qui e dove puoi cambiare la porta predefinita
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f"Invalid port number '{sys.argv[1]}', using default port {port}")

    @app.route('/shutdown', methods=['POST'])
    def shutdown():
        func = request.environ.get('werkzeug.server.shutdown')
        if func is None:
            return "Not running with the Werkzeug Server", 500
        func()
        return "Server shutting down..."

    import socket

    def get_local_ip():
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        try:
            # non deve essere raggiungibile
            s.connect(('10.255.255.255', 1))
            IP = s.getsockname()[0]
        except Exception:
            IP = '127.0.0.1'
        finally:
            s.close()
        return IP

    def run_app():
        local_ip = get_local_ip()
        url_localhost = f"http://127.0.0.1:{port}" # url per accedere al server tramite localhost
        url_network = f"http://{local_ip}:{port}" # url per accedere al server tramite la rete
        print(f" * Running on {url_localhost} (clickable link)") # url per accedere al server tramite localhost
        print(f" * Also accessible on your network at: {url_network}") # url per accedere al server tramite la rete
        app.run(debug=False, host='0.0.0.0', port=port, use_reloader=False)  # serve il server con debug disattivato

    server_thread = threading.Thread(target=run_app)
    server_thread.start()

    try:
        while True:
            command = input()
            if command.strip().lower() == 'stop':
                print("Stopping server...")
                try:
                    requests.post(f"http://127.0.0.1:{port}/shutdown")
                except requests.exceptions.RequestException:
                    pass
                print("Server stopped correctly.")
                break
    except KeyboardInterrupt:
        print("Keyboard interrupt received, stopping server...")

    server_thread.join()
