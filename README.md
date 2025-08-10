
# NR Cloud - Il tuo spazio multimediale personale 📁

## Cos'è NR Cloud?
NR Cloud è un servizio cloud personale che ti permette di organizzare e condividere i tuoi file multimediali (foto, video, musica, documenti) in modo semplice e veloce.

## Cosa puoi fare con NR Cloud?
-  **Galleria**: Carica e visualizza le tue foto
-  **Video**: Guarda i tuoi video preferiti
-  **Audio**: Ascolta la tua musica
-  **Documenti**: Visualizza PDF, Word, e altri documenti

## Requisiti minimi per il tuo computer
Per far funzionare NR Cloud hai bisogno di:

### 1. Python (obbligatorio)
- **Windows**: Scarica da [python.org](https://www.python.org/downloads/)
- **Mac**: Apri il terminale e scrivi: `python3 --version`
  - Se non è installato, scaricalo da [python.org](https://www.python.org/downloads/)
- **Linux**: Apri il terminale e scrivi: `python3 --version`

### 2. Internet (opzionale)
- Serve solo se vuoi accedere ai tuoi file da altri dispositivi

## Installazione in 3 semplici passi

### Passo 1: Scarica il progetto
- Scarica questa cartella sul tuo computer
- Ricordati dove l'hai salvata (es. Desktop/NR-Cloud)

### Passo 2: Installa Python e le dipendenze
**Copia e incolla questi comandi nel terminale:**

```bash
# Installa Python (se non lo hai già)
# Windows: scarica da https://www.python.org/downloads/
# Mac/Linux: Python è già installato o installalo con:
# sudo apt-get install python3 python3-pip  # Ubuntu/Debian
# brew install python3                     # macOS

# Installa le dipendenze
pip install flask
# Oppure se hai il file requirements.txt:
pip install -r requirements.txt
```

### Passo 3: Avvia il servizio
**Copia e incolla questi comandi nel terminale:**

```bash
# Vai nella cartella del progetto
cd /percorso/della/cartella/NR-Cloud

# Avvia il server
# Windows:
python app.py

# Mac/Linux:
python3 app.py

# Per usare una porta diversa (esempio: 8081)
python app.py 8081
```

### Comandi rapidi per l'installazione

**Installazione completa in un solo comando:**

```bash
# Clona o scarica il progetto
git clone https://github.com/tuo-username/NR-Cloud.git
cd NR-Cloud

# Installa le dipendenze
pip install -r requirements.txt

# Avvia il server
python app.py
```

**Installazione manuale passo-passo:**

```bash
# 1. Scarica il progetto
# 2. Entra nella cartella
cd NR-Cloud

# 3. Installa Flask
pip install flask

# 4. Avvia il server
python app.py
```

## Come usare NR Cloud

### Una volta avviato:
1. Apri il tuo browser (Chrome, Firefox, Safari, Edge)
2. Vai all'indirizzo: `http://localhost:8080`
3. Inizia a caricare i tuoi file nelle cartelle:
   - **Galleria**: Metti le tue foto in `/Galleria/`
   - **Video**: Metti i tuoi video in `/Video/`
   - **Audio**: Metti la tua musica in `/Audio/`
   - **Documenti**: Metti i tuoi documenti in `/Documents/`

### Caricare nuovi file:
- Copia e incolla i file nelle cartelle corrispondenti
- Il sito si aggiorna automaticamente, non serve ricaricare la pagina

## Risoluzione problemi

### "Python non trovato"
- Assicurati di aver installato Python correttamente
- Riavvia il computer dopo l'installazione

### "Porta 8080 occupata"
- Il programma ti dirà automaticamente se c'è un problema
- Puoi cambiare porta scrivendo: `python app.py 8081`

### Non riesco ad accedere da altri dispositivi
- Assicurati che il computer principale sia acceso
- Controlla che il firewall permetta le connessioni sulla porta 8080

## Domande frequenti

**D: Devo pagare qualcosa?**
R: No, è completamente gratuito e open source.

**D: Funziona senza internet?**
R: Sì, funziona perfettamente offline sul tuo computer.

**D: Posso accedere dai miei dispositivi?**
R: Sì, se il computer principale è acceso e sulla stessa rete WiFi.

**D: I miei file sono al sicuro?**
R: Sì, rimangono sempre sul tuo computer.

## Struttura del progetto
```
NR-Cloud/
├── app.py              # Server Python principale
├── index.html          # Pagina principale
├── gallery.html        # Pagina galleria foto
├── video.html          # Pagina video
├── audio.html          # Pagina audio
├── documents.html      # Pagina documenti
├── src/                # Risorse frontend
│   ├── assets/
│   │   ├── js/         # JavaScript
│   │   └── styles/     # CSS
│   └── ...
├── Galleria/           # Cartella foto
├── Video/              # Cartella video
├── Audio/              # Cartella musica
├── Documents/          # Cartella documenti
└── ...
```

## Tecnologie utilizzate
- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Librerie**: 
  - Flask (server web)
  - Jinja2 (template engine)
  - Bootstrap (UI framework)

## Contributi
Le contribuzioni sono benvenute! Per contribuire:
1. Fai un fork del progetto
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Fai commit delle tue modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## Licenza
Questo progetto è distribuito con licenza MIT. Vedi il file `LICENSE` per maggiori dettagli.

## Ringraziamenti
- Grazie alla community open source per le librerie utilizzate
- Ringraziamenti speciali a tutti i contributori del progetto

## Changelog
### v1.0.0 (2024)
- Prima versione stabile
- Supporto per foto, video, audio e documenti
- Interfaccia responsive
- Sistema di caricamento file drag & drop

---

**Creato da Nomar.exe**
