# NR Progetto Dinamic Python Server

Questo progetto è un server web Python dinamico, sviluppato con Flask, che gestisce un sito web multimediale completo con galleria, video, audio e documenti. Il marchio "NR Project Dynamic Python Server" è presente in tutte le pagine.

## Caratteristiche

- **Elenco dinamico dei contenuti**: endpoint API dedicati per articoli, galleria, video, audio e documenti
- **Gestione multimediale completa**: supporta immagini, video, audio e documenti (PDF, DOCX, TXT, SVG)
- **Navigazione dinamica**: tutte le pagine caricano e visualizzano dinamicamente i contenuti
- **Layout coerente**: tutte le pagine condividono un layout uniforme per intestazione, navigazione e piè di pagina
- **Controllo del server**: server Flask eseguito in thread separato con arresto sicuro via comando `stop`
- **Responsive design**: compatibile con tutti i dispositivi e dimensioni dello schermo

## Struttura del progetto

- `app.py`: Applicazione Flask principale con gestione API per tutte le sezioni
- `index.html`: Pagina principale con overview del progetto
- `gallery.html`: Galleria dinamica di immagini e video
- `video.html`: Sezione dedicata ai video
- `audio.html`: Sezione dedicata all'audio
- **documents.html**: Nuova sezione per la gestione dei documenti
- `src/assets/js/`: Script JavaScript per il caricamento dinamico dei contenuti
  - `gallery.js`: Gestione galleria immagini/video
  - `video.js`: Gestione sezione video
  - `audio.js`: Gestione sezione audio
  - **documents.js**: Nuovo script per gestione documenti
- `Galleria/`: Cartella contenente immagini e video
- `Video/`: Cartella contenente file video
- `Audio/`: Cartella contenente file audio
- **Documents/**: Nuova cartella per documenti (PDF, DOCX, TXT, SVG, etc.)
- `src/assets/styles/`: Stili CSS condivisi
- `setup_instructions.sh`: Script di installazione dipendenze

## Requisiti di sistema

### Prerequisiti
- **Python 3.7 o superiore** (consigliato Python 3.9+)
- **pip** (gestore pacchetti Python)
- **bash** o **zsh** (per lo script di setup - opzionale)

### Installazione Python

#### Windows
1. Scarica Python da [python.org](https://www.python.org/downloads/windows/)
2. Durante l'installazione, **spunta** "Add Python to PATH"
3. Verifica l'installazione: `python --version`

#### macOS
1. Installa via Homebrew:
   ```bash
   brew install python3
   ```
2. Oppure scarica da [python.org](https://www.python.org/downloads/macos/)
3. Verifica: `python3 --version`

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install python3 python3-pip
```

### Installazione dipendenze

#### Metodo 1: Script automatico (consigliato)
```bash
bash setup_instructions.sh
```

#### Metodo 2: Installazione manuale
```bash
# Crea ambiente virtuale (opzionale ma consigliato)
python3 -m venv venv

# Attiva ambiente virtuale
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Installa Flask
pip install flask

# Verifica installazione
python -c "import flask; print(flask.__version__)"
```

## Esecuzione del server

1. **Naviga nella directory del progetto**
   ```bash
   cd /percorso/del/progetto
   ```

2. **Avvia il server**
   ```bash
   python3 app.py
   ```

3. **Accesso al sito**
   - Apri il browser e vai su `http://127.0.0.1:8080`
   - Il server è ora in esecuzione

4. **Arresto sicuro del server**
   - Torna al terminale dove è in esecuzione il server
   - Digita `stop` e premi Invio
   - Attendi il messaggio di conferma dell'arresto

## Risoluzione problemi comuni

### Errore "python3 non trovato"
- Su Windows prova: `python` o `py` invece di `python3`
- Assicurati che Python sia nel PATH di sistema

### Errore "pip non trovato"
- Su Windows: `python -m pip install flask`
- Su macOS/Linux: `python3 -m pip install flask`

### Porta 8080 occupata
- Il server userà automaticamente la porta 8081 se 8080 è occupata
- O modifica la porta in `app.py` (riga `port=8080`)

### Permessi su macOS/Linux
```bash
chmod +x setup_instructions.sh
./setup_instructions.sh
```

## Accesso al sito web

- Apri il browser e vai su `http://127.0.0.1:8080`
- Utilizza i link di navigazione per accedere a tutte le sezioni:
  - **Home**: Overview del progetto
  - **Gallery**: Galleria immagini e video
  - **Video**: Sezione video dedicata
  - **Audio**: Sezione audio dedicata
  - **Documenti**: Nuova sezione per documenti

## API Endpoints

- `/api/gallery` - Restituisce lista immagini e video dalla Galleria
- `/api/videos` - Restituisce lista video dalla cartella Video
- `/api/audio` - Restituisce lista file audio dalla cartella Audio
- `/api/documents` - Restituisce lista documenti dalla cartella Documents

## Format supportati

### Immagini
PNG, JPG, JPEG, GIF, BMP, WEBP, SVG

### Video
MP4, WEBM, OGG

### Audio
MP3, WAV, M4A, OGG

### Documenti
PDF, DOCX, TXT, SVG, e altri formati comuni

## Note

- Tutti i contenuti vengono caricati dinamicamente dalle rispettive cartelle
- Il design è responsive e ottimizzato per tutti i dispositivi
- Supporto completo per SVG nelle sezioni Gallery e Documents
- Navigazione intuitiva con indicatore della pagina attiva

## Autore

Realizzato da [Nomar.exe](https://github.com/Nomarexe) - 2025

## Licenza e Crediti

Questo progetto è rilasciato sotto la licenza MIT. Per utilizzare questo progetto è sufficiente:
1. Mantenere il credito al creatore originale (Nomar.exe)
2. Includere il link al repository originale: https://github.com/Nomarexe
3. Non rimuovere i riferimenti al creatore nelle pagine web

Per maggiori dettagli sulla licenza, consulta il file [LICENSE](LICENSE).

## Collegamenti utili
- **Repository GitHub**: [https://github.com/Nomarexe](https://github.com/Nomarexe)
- **Licenza MIT**: [https://opensource.org/licenses/MIT](https://opensource.org/licenses/MIT)
- **Documentazione completa**: [https://github.com/Nomarexe/NR-Project-Dynamic-Python-Server](https://github.com/Nomarexe/NR-Project-Dynamic-Python-Server)

Copyright (c) 2025 Nomar.exe
