# NR Cloud - Il Tuo Server Multimediale Personale
Trasforma il tuo computer in un potente cloud privato per gestire video, audio, immagini e documenti con un'interfaccia semplice e intuitiva.

## Prerequisiti
Prima di iniziare, assicurati di avere:

Python 3.8+ (Scaricalo qui)

Pip (incluso in Python 3.4+)

Flask (installato automaticamente)

Connessione di rete (per accedere da altri dispositivi)

## Installazione Dipendenze
Esegui questo comando per installare le librerie necessarie:
```
pip install flask werkzeug
```
## Avvio del Server
Scarica il progetto (o clona il repository)

Apri una finestra di terminale nella cartella del progetto

Esegui il server con:
```
python3 app.py
```
Accedi all'interfaccia aprendo nel browser:

Locale: http://localhost:8080

Rete locale: http://tuo-IP:8080 (mostrato nel terminale)

Al primo avvio, ti verrà chiesto di creare un account admin.
## Funzionalità Principali
- Caricamento File (drag & drop)
- Galleria Multimediale (immagini, video, audio)
- Gestione Documenti (PDF, Word, Excel, ecc.)
- Accesso Protetto con sistema di login/logout
- Nessun limite di spazio (dipende dal tuo disco)
- Interfaccia responsive (funziona su PC, tablet e smartphone)
- Le password vengono hashate usando generate_password_hash di Werkzeug
- Il file users.txt contiene solo username e hash della password

## Come Usare
Login: Inserisci le tue credenziali

Carica File: Trascina i file nelle sezioni dedicate

Visualizza/Scarica: Tutti i file sono organizzati automaticamente

Gestisci: Cancella o modifica i file direttamente dalle cartelle

Per cambiare la password o resettare il sistema, basta eliminare il file users.txt e riavviare il server.

## Sviluppato con da Nomar.exe
 Ideato e realizzato da Nomarexe
 Licenza: Libero uso per progetti personali (modifiche consentite)
