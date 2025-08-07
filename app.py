from flask import Flask, jsonify, send_from_directory, render_template_string, request
import os
import re

app = Flask(__name__, static_folder='')

VIDEO_DIR = 'Video'
GALLERY_DIR = 'Galleria'  # Folder containing gallery images and videos
AUDIO_DIR = 'Audio'  # Folder containing audio files
DOCUMENTS_DIR = 'Documents'  # Folder containing documents

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

if __name__ == '__main__':
    import sys
    import threading
    import requests
    import time

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
