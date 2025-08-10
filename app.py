from flask import Flask, jsonify, send_from_directory, render_template_string, request, redirect, url_for, session, flash
import os
import re
import logging
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
import threading
import requests
import socket

app = Flask(__name__, static_folder='')
app.secret_key = os.urandom(24)  # Chiave segreta per le sessioni

# Configurazione delle cartelle
VIDEO_DIR = 'Video'
GALLERY_DIR = 'Galleria'
AUDIO_DIR = 'Audio'
DOCUMENTS_DIR = 'Documents'
CREDENTIALS_FILE = 'users.txt'

# Crea cartelle se non esistono
os.makedirs(VIDEO_DIR, exist_ok=True)
os.makedirs(GALLERY_DIR, exist_ok=True)
os.makedirs(AUDIO_DIR, exist_ok=True)
os.makedirs(DOCUMENTS_DIR, exist_ok=True)

# Estensioni file permesse
ALLOWED_EXTENSIONS = {
    'audio': {'mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'},
    'video': {'mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'},
    'documents': {'pdf', 'doc', 'docx', 'txt', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'},
    'gallery': {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'mp4', 'webm', 'ogg'}
}

def allowed_file(filename, category):
    """Verifica se l'estensione del file è permessa"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS.get(category, set())

def check_credentials(username, password):
    """Verifica le credenziali dell'utente"""
    try:
        with open(CREDENTIALS_FILE, 'r') as f:
            for line in f:
                if ':' in line:
                    stored_user, stored_hash = line.strip().split(':', 1)
                    if stored_user == username and check_password_hash(stored_hash, password):
                        return True
    except FileNotFoundError:
        pass
    return False

@app.before_request
def require_login():
    """Middleware per controllo autenticazione"""
    allowed_routes = ['login', 'static', 'first_setup', 'complete_setup']
    if not os.path.exists(CREDENTIALS_FILE) and request.endpoint not in ['first_setup', 'complete_setup']:
        return redirect(url_for('first_setup'))
    elif request.endpoint not in allowed_routes and not session.get('logged_in'):
        return redirect(url_for('login'))

# Setup iniziale
@app.route('/first-setup')
def first_setup():
    if os.path.exists(CREDENTIALS_FILE):
        return redirect(url_for('login'))
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Setup Iniziale - NR Cloud</title>
        <link rel="stylesheet" href="src/assets/styles/main.css">
        <style>
            .setup-container {
                max-width: 500px;
                margin: 50px auto;
                padding: 2rem;
                background: #1e1e1e;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            }
            .setup-container h1 {
                color: #8868f3;
                text-align: center;
                margin-bottom: 1.5rem;
            }
            .form-group {
                margin-bottom: 1.5rem;
            }
            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                color: #fff;
            }
            .form-group input {
                width: 100%;
                padding: 0.75rem;
                border-radius: 4px;
                border: 1px solid #444;
                background: #2a2a2a;
                color: white;
            }
            .setup-btn {
                width: 100%;
                padding: 0.75rem;
                background: #8868f3;
                color: white;
                border: none;
                border-radius: 4px;
                font-weight: bold;
                cursor: pointer;
                transition: background 0.3s;
            }
            .setup-btn:hover {
                background: #9a7dff;
            }
        </style>
    </head>
    <body style="background: #121212;">
        <div class="setup-container">
            <h1>Configurazione Iniziale</h1>
            <form action="/complete-setup" method="post">
                <div class="form-group">
                    <label for="username">Username Admin</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="submit" class="setup-btn">Crea Account Admin</button>
            </form>
        </div>
    </body>
    </html>
    '''

@app.route('/complete-setup', methods=['POST'])
def complete_setup():
    if os.path.exists(CREDENTIALS_FILE):
        return redirect(url_for('login'))
    
    username = request.form.get('username')
    password = request.form.get('password')
    
    if not username or not password:
        flash('Inserisci username e password', 'error')
        return redirect(url_for('first_setup'))
    
    try:
        with open(CREDENTIALS_FILE, 'w') as f:
            f.write(f"{username}:{generate_password_hash(password)}\n")
        return redirect(url_for('login'))
    except Exception as e:
        flash(f"Errore durante la creazione: {str(e)}", 'error')
        return redirect(url_for('first_setup'))

# Autenticazione
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        if check_credentials(username, password):
            session['logged_in'] = True
            session['username'] = username
            return redirect(url_for('serve_index_html'))
        else:
            flash('Credenziali non valide', 'error')
    
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Login - NR Cloud</title>
        <link rel="stylesheet" href="src/assets/styles/main.css">
        <style>
            .login-container {
                max-width: 400px;
                margin: 100px auto;
                padding: 2rem;
                background: #1e1e1e;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            }
            .login-container h1 {
                color: #8868f3;
                text-align: center;
                margin-bottom: 2rem;
            }
            .form-group {
                margin-bottom: 1rem;
            }
            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                color: #ffffff;
            }
            .form-group input {
                width: 100%;
                padding: 0.75rem;
                border-radius: 4px;
                border: 1px solid #444;
                background: #2a2a2a;
                color: white;
            }
            .login-btn {
                width: 100%;
                padding: 0.75rem;
                background: #8868f3;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                transition: background 0.3s;
            }
            .login-btn:hover {
                background: #9a7dff;
            }
            .error-message {
                color: #ff6b6b;
                text-align: center;
                margin-bottom: 1rem;
            }
        </style>
    </head>
    <body style="background: #121212;">
        <div class="login-container">
            <h1>NR Cloud Login</h1>
            <form method="post">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="submit" class="login-btn">Login</button>
            </form>
        </div>
    </body>
    </html>
    '''

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/api/check-session')
def check_session():
    """Endpoint per verificare lo stato della sessione"""
    return jsonify({
        'loggedIn': session.get('logged_in', False),
        'username': session.get('username', '')
    })

# Pagine principali
@app.route('/')
def serve_index_html():
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    return render_template_string(content)

# API per i documenti
@app.route('/api/documents')
def list_documents():
    try:
        if not os.path.exists(DOCUMENTS_DIR):
            return jsonify([])
        
        files = sorted(os.listdir(DOCUMENTS_DIR))
        supported_extensions = {
            '.pdf': 'PDF', '.docx': 'DOCX', '.doc': 'DOC',
            '.txt': 'TXT', '.svg': 'SVG', '.png': 'PNG',
            '.jpg': 'JPG', '.jpeg': 'JPEG', '.gif': 'GIF',
            '.bmp': 'BMP', '.webp': 'WEBP'
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

# API per la galleria
@app.route('/api/gallery')
def list_gallery_media():
    try:
        files = sorted(os.listdir(GALLERY_DIR))
        media_extensions = ('.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.mp4', '.webm', '.ogg')
        media_files = [f for f in files if f.lower().endswith(media_extensions)]
        media_urls = [f"/{GALLERY_DIR}/{media}" for media in media_files]
        return jsonify(media_urls)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API per audio
@app.route('/api/audio')
def list_audio_files():
    try:
        files = sorted(os.listdir(AUDIO_DIR))
        audio_extensions = ('.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a')
        audio_files = [f for f in files if f.lower().endswith(audio_extensions)]
        audio_urls = [f"/{AUDIO_DIR}/{audio}" for audio in audio_files]
        return jsonify(audio_urls)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API per video
@app.route('/api/videos')
def list_videos():
    try:
        files = sorted(os.listdir(VIDEO_DIR))
        video_extensions = ('.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv')
        video_files = [f for f in files if f.lower().endswith(video_extensions)]
        video_urls = [f"/{VIDEO_DIR}/{video}" for video in video_files]
        return jsonify(video_urls)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route per servire i file
@app.route('/Documents/<path:filename>')
def serve_document_file(filename):
    return send_from_directory(DOCUMENTS_DIR, filename)

@app.route('/Galleria/<path:filename>')
def serve_gallery_file(filename):
    return send_from_directory(GALLERY_DIR, filename)

@app.route('/Audio/<path:filename>')
def serve_audio_file(filename):
    return send_from_directory(AUDIO_DIR, filename)

@app.route('/Video/<path:filename>')
def serve_video_file(filename):
    return send_from_directory(VIDEO_DIR, filename)

# Upload endpoints
@app.route('/api/upload/<category>', methods=['POST'])
def upload_file(category):
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
            
            target_dir = {
                'audio': AUDIO_DIR,
                'video': VIDEO_DIR,
                'documents': DOCUMENTS_DIR,
                'gallery': GALLERY_DIR
            }.get(category)
            
            if not os.path.exists(target_dir):
                os.makedirs(target_dir)
            
            file_path = os.path.join(target_dir, filename)
            
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

# Gestione password
@app.route('/change-password', methods=['GET', 'POST'])
def change_password():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    if request.method == 'POST':
        new_password = request.form.get('new_password')
        if not new_password:
            flash('Inserisci una nuova password', 'error')
            return redirect(url_for('change_password'))
        
        try:
            # Leggi tutte le linee
            with open(CREDENTIALS_FILE, 'r') as f:
                lines = f.readlines()
            
            # Trova e aggiorna l'utente corrente
            updated = False
            username = session['username']
            for i, line in enumerate(lines):
                if line.startswith(username + ':'):
                    lines[i] = f"{username}:{generate_password_hash(new_password)}\n"
                    updated = True
                    break
            
            if not updated:
                flash('Utente non trovato', 'error')
                return redirect(url_for('change_password'))
                
            # Riscrivi il file
            with open(CREDENTIALS_FILE, 'w') as f:
                f.writelines(lines)
                
            flash('Password cambiata con successo!', 'success')
            return redirect(url_for('serve_index_html'))
        except Exception as e:
            flash(f"Errore: {str(e)}", 'error')
            return redirect(url_for('change_password'))
    
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Cambia Password - NR Cloud</title>
        <link rel="stylesheet" href="src/assets/styles/main.css">
        <style>
            .password-container {
                max-width: 500px;
                margin: 50px auto;
                padding: 2rem;
                background: #1e1e1e;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            }
            .password-container h1 {
                color: #8868f3;
                text-align: center;
                margin-bottom: 1.5rem;
            }
            .form-group {
                margin-bottom: 1.5rem;
            }
            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                color: #fff;
            }
            .form-group input {
                width: 100%;
                padding: 0.75rem;
                border-radius: 4px;
                border: 1px solid #444;
                background: #2a2a2a;
                color: white;
            }
            .password-btn {
                width: 100%;
                padding: 0.75rem;
                background: #8868f3;
                color: white;
                border: none;
                border-radius: 4px;
                font-weight: bold;
                cursor: pointer;
                transition: background 0.3s;
            }
            .password-btn:hover {
                background: #9a7dff;
            }
            .flash-message {
                padding: 0.75rem;
                margin-bottom: 1rem;
                border-radius: 4px;
                text-align: center;
            }
            .flash-error {
                background-color: #f8d7da;
                color: #721c24;
            }
            .flash-success {
                background-color: #d4edda;
                color: #155724;
            }
        </style>
    </head>
    <body style="background: #121212;">
        <div class="password-container">
            <h1>Cambia Password</h1>
            {% with messages = get_flashed_messages(with_categories=true) %}
                {% if messages %}
                    {% for category, message in messages %}
                        <div class="flash-message flash-{{ category }}">{{ message }}</div>
                    {% endfor %}
                {% endif %}
            {% endwith %}
            <form method="post">
                <div class="form-group">
                    <label for="new_password">Nuova Password</label>
                    <input type="password" id="new_password" name="new_password" required>
                </div>
                <button type="submit" class="password-btn">Salva Nuova Password</button>
            </form>
        </div>
    </body>
    </html>
    '''

# Gestione del server
@app.route('/shutdown', methods=['POST'])
def shutdown():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        return "Not running with the Werkzeug Server", 500
    func()
    return "Server shutting down..."

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = '127.0.0.1'
    finally:
        s.close()
    return IP

if __name__ == '__main__':
    logging.getLogger('werkzeug').setLevel(logging.ERROR)
    
    port = 8080
    if len(os.sys.argv) > 1:
        try:
            port = int(os.sys.argv[1])
        except ValueError:
            print(f"Porta non valida '{os.sys.argv[1]}', uso la porta predefinita {port}")

    def run_app():
        local_ip = get_local_ip()
        print("\n===============================================")
        print(f" NR Cloud Server avviato:")
        print(f" - Locale:  http://127.0.0.1:{port}")
        print(f" - Rete:    http://{local_ip}:{port}")
        if not os.path.exists(CREDENTIALS_FILE):
            print(f"\n PRIMO AVVIO: Visita http://127.0.0.1:{port}/first-setup")
            print(" per creare l'account admin")
        print("===============================================\n")
        app.run(debug=False, host='0.0.0.0', port=port, use_reloader=False)

    server_thread = threading.Thread(target=run_app)
    server_thread.start()

    try:
        while True:
            command = input()
            if command.strip().lower() == 'stop':
                print("Arresto del server...")
                try:
                    requests.post(f"http://127.0.0.1:{port}/shutdown")
                except requests.exceptions.RequestException:
                    pass
                print("Server arrestato correttamente.")
                break
    except KeyboardInterrupt:
        print("\nInterruzione da tastiera, arresto del server...")

    server_thread.join()