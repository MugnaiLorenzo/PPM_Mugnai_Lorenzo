# 🎯 PPM – Puntamento Particolare Multigiocatore  
**Autore:** Lorenzo Mugnai – 2022

## 📌 Informazioni sul progetto

PPM è un'applicazione web multiplayer che propone un gioco a puntamento basato su iterazione naturale. Due utenti visualizzano la stessa opera d'arte e devono individuare un particolare specificato il più velocemente possibile.  
Vince il round chi riesce a mantenere il puntamento sul dettaglio corretto per almeno 3 secondi.  

---

## 🛠️ Linguaggi Utilizzati

- **Frontend**: HTML, CSS, JavaScript  
- **Backend**: Node.js con Socket.IO  
- **Interazione Naturale**: Mediapipe.js (in particolare Mediapipe Hands)

---

## 📅 Agenda

- [Regolamento](#📋-regolamento)
- [Implementazione](#⚙️-implementazione)
- [Gestione dei Quadri](#🖼️-gestione-dei-quadri)

---

## 📋 Regolamento

### 👤 Accesso  
Per iniziare a giocare, l'utente deve inserire un nome utente.  
Dopo l’accesso, può:
- Unirsi ad una **partita pubblica**: l’app trova l’avversario casualmente.
- Unirsi ad una **partita privata**: inserendo un codice condiviso con l’avversario.

### 🕹️ Modalità di Gioco  
- Entrambi i giocatori visualizzano la stessa opera.
- Il titolo del dettaglio da cercare è mostrato.
- L’utente deve posizionare la mano sul particolare corretto.
- Dopo 3 secondi di puntamento continuo, il sistema verifica la correttezza.
- Il round si conclude con un vincitore (o pareggio).
- Si avanza automaticamente al round successivo.

---

## ⚙️ Implementazione

### 🖥️ Frontend  
- Responsabile dell'interfaccia utente.
- Usa **Mediapipe Hands** per rilevare in tempo reale la posizione e la forma delle mani.

### 🌐 Backend  
- Gestito tramite **Node.js** e **Socket.IO**.
- Coordina la comunicazione tra due giocatori.
- Controlla il flusso di gioco, i punteggi e la transizione tra i round.
- Gestisce la lettura e modifica del file `quadri.json`.

---

## 🖼️ Gestione dei Quadri

### ➕ Aggiunta  
È possibile aggiungere un nuovo quadro tramite la sezione dedicata.  
Ogni opera include:
- Titolo  
- Descrizione del particolare  
- Descrizione accurata per il post-riconoscimento  
- Coordinate del dettaglio da cercare  
- Immagine dell’opera

### 🗃️ Salvataggio  
Le informazioni sono memorizzate nel file `quadri.json`.  
Le immagini sono salvate su **Firebase Storage**.

### 🗑️ Rimozione  
È possibile eliminare un quadro esistente dalla sezione “Gestione Quadri”.

---

## 🚀 Avvio del progetto

1. Installare le dipendenze:
   ```bash
   npm install
2. Avviare il server
     ```bash
      node server.js
3. Aprire il browser su http://localhost:3000
