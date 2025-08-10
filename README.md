#  Media Server - Guida per Tutti

**Cos'è questo progetto?**
È come avere il tuo Netflix/Dropbox personale sul computer. Puoi vedere video, ascoltare musica, guardare foto e leggere documenti da qualsiasi dispositivo (telefono, tablet, altro computer) connesso alla tua stessa rete WiFi.

##  Cosa Puoi Fare
- **Guardare film e video** dal telefono/tablet mentre stai sul divano
- **Ascoltare musica** senza dover copiare file
- **Guardare le tue foto** su schermo grande
- **Leggere PDF e documenti** da qualsiasi dispositivo
- **Caricare nuovi file** semplicemente trascinandoli

##  Cosa Serve (Requisiti Semplici)

### Per Windows:
1. **Python** (obbligatorio) - vai su [python.org](https://www.python.org) e scarica la versione più recente
2. Durante l'installazione spunta  "Add Python to PATH"

### Per Mac:
1. **Python** (obbligatorio) - vai su [python.org](https://www.python.org) o apri il terminale e scrivi:
   ```
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   brew install python
   ```

### Per Linux:
1. **Python** è già installato, ma se non lo è:
   ```
   sudo apt install python3 python3-pip
   ```

##  Come Farlo Funzionare (3 Passi Facili)

### 1. Scarica i File
- Scarica tutta la cartella del progetto sul tuo computer
- Mettila dove vuoi (es. Desktop o Documenti)

### 2. Installa le Cose Necessarie
Apri il terminale (o Command Prompt su Windows) e scrivi:
```
pip install flask werkzeug requests
```
Oppure, per installare tutto in una volta sola:
```
pip install -r requirements.txt
```
Aspetta che finisca (ci mette 1-2 minuti)

### 3. Avvia il Server
Sempre nel terminale, vai nella cartella del progetto:
```
cd /percorso/della/cartella
python app.py
```

**Esempio pratico:**
- Se la cartella è sul Desktop: `cd Desktop/MediaServer`
- Poi: `python app.py`

##  Come Usarlo

### Dal Computer:
1. Apri il browser (Chrome, Firefox, Safari)
2. Vai su: `http://127.0.0.1:8080`
3. Vedrai il tuo archivio multimediale

### Dal Telefono/Tablet:
1. Assicurati che sia connesso alla stessa WiFi del computer
2. Apri il browser
3. Vai all'indirizzo che appare nel terminale (es. `http://192.168.1.100:8080`)

##  Dove Mettere i File

Il progetto ha già le cartelle pronte:
- **Video/** - metti qui film e video
- **Audio/** - metti qui musica e podcast
- **Galleria/** - metti qui foto e immagini
- **Documents/** - metti qui PDF, Word, Excel, ecc.

##  Problemi Comuni e Soluzioni

**"python non è riconosciuto"**
- Riavvia il computer dopo aver installato Python
- Su Windows: prova `py` invece di `python`

**"Non riesco ad accedere dal telefono"**
- Controlla che telefono e computer siano sulla stessa WiFi
- Disattiva temporaneamente il firewall

**"La porta 8080 è occupata"**
- Chiudi altri programmi o usa: `python app.py 8081`

##  Consigli Utili
- Puoi cambiare porta: `python app.py 3000`
- Per chiudere il server: premi `CTRL+C` nel terminale
- I file vengono caricati automaticamente - non serve riavviare

##  Se Non Funziona
1. Controlla che Python sia installato: apri terminale e scrivi `python --version`
2. Controlla che Flask sia installato: `pip show flask`
3. Se hai Mac M1/M2: potresti dover usare `python3` invece di `python`

**Hai bisogno di aiuto?** Scrivi l'errore esatto che vedi nel terminale e ccerca un video su youtube se non riesci chiama un tuo amico gamer.
