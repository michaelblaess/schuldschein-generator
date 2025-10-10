<!--
  SPDX-License-Identifier: Apache-2.0
  Copyright (c) 2025 Michael Blaess
-->

# Datenschutzerklärung

Stand: 09.10.2025

Diese Website („Schuldschein‑Generator“) ist als **statische, rein clientseitige Anwendung** konzipiert. Sie kann ohne Registrierung genutzt werden. Wir betreiben die Seite so, dass **keine personenbezogenen Daten auf unserem Server gespeichert** werden und **keine Cookies gesetzt** werden. Einzelne **Einstellungen werden ausschließlich lokal** in Ihrem Browser gespeichert (Local Storage).

---

## 1. Verantwortlicher (Art. 4 Nr. 7 DSGVO)

**Michael Blaess**  
Kurze Str. 2, 15345 Rehfelde, Deutschland  
E‑Mail: [info@schuldschein-generator.de](mailto:info@schuldschein-generator.de)

Ein/e Datenschutzbeauftragte/r ist nicht benannt, da die gesetzlichen Voraussetzungen hierfür nicht vorliegen.

---

## 2. Arten der Daten und Verarbeitungszwecke

### 2.1 Nutzung der Anwendung (clientseitig, ohne Server‑Speicherung)
- **Keine Eingaben werden an einen Server übermittelt.** Alle Formulareingaben verbleiben in Ihrem Browser.  
- **Keine Cookies.**  
- **Local Storage (nur Einstellungen):**  
  - Schlüssel/Keys: `locale` (Sprachauswahl), `theme` (Dark/Light‑Mode).  
  - Zweck: Komfortfunktionen; Wiederherstellung Ihrer Anzeigeeinstellungen.  
  - Rechtsgrundlage: **Art. 6 Abs. 1 lit. f DSGVO** (berechtigtes Interesse an nutzerfreundlicher Darstellung).  
  - Speicherdauer: bis Sie die Daten in Ihrem Browser löschen (siehe Abschnitt 6).  
  - Hinweis: Die Speicherung erfolgt **ausschließlich lokal** in Ihrem Browser. Wir haben **keinen Zugriff** darauf.

### 2.2 Server‑Protokolle des Hosting‑Providers (technisch notwendig)
Auch wenn wir serverseitig keine eigenen Daten speichern, ist es üblich, dass der **Hosting‑Provider** aus technischen Gründen **Server‑Logfiles** verarbeitet (z. B. zur Abwehr von Angriffen, Fehleranalyse). Dabei können u. a. folgende Daten verarbeitet werden:
- IP‑Adresse des aufrufenden Geräts
- Datum und Uhrzeit des Abrufs
- Aufgerufene URL, Referrer‑URL
- User‑Agent (Browser/Version/Betriebssystem)

**Rechtsgrundlage:** **Art. 6 Abs. 1 lit. f DSGVO** (berechtigtes Interesse an der sicheren und fehlerfreien Bereitstellung).  
**Speicherdauer:** gemäß den Vorgaben des Hosting‑Providers; üblicherweise wenige Tage bis Wochen. Wir führen **keine Zusammenführung** dieser Daten mit anderen Quellen durch und nehmen selbst **keine Profilbildung** vor.

### 2.3 Einbindung externer Bibliotheken über CDN
Zur Auslieferung statischer Dateien können **Content Delivery Networks (CDN)** eingesetzt werden (z. B. für **Tailwind CSS** oder **jsPDF**). Beim Seitenaufruf wird aus technischen Gründen Ihre IP‑Adresse an die jeweiligen CDN‑Server übertragen.
- Zweck: schnelle, stabile Auslieferung von Bibliotheken
- Rechtsgrundlage: **Art. 6 Abs. 1 lit. f DSGVO** (berechtigtes Interesse an einer sicheren und performanten Bereitstellung)
- Speicherdauer/Empfänger: durch die jeweiligen CDN‑Betreiber festgelegt

*Hinweis:* Eine exakte Liste der aktuell verwendeten CDN‑Dienste finden Sie im Seitenquelltext (`index.html`).

### 2.4 Kontakt per E‑Mail
Wenn Sie uns eine E‑Mail senden, verarbeiten wir Ihre Angaben zur Bearbeitung der Anfrage (z. B. Absender, Inhalt, Zeitpunkt).  
**Rechtsgrundlage:** **Art. 6 Abs. 1 lit. b DSGVO** (vorvertragliche/vertragliche Kommunikation) oder **lit. f** (berechtigtes Interesse an der Beantwortung von Anfragen).  
**Speicherdauer:** bis zur abschließenden Bearbeitung bzw. entsprechend gesetzlicher Aufbewahrungspflichten.

---

## 3. Keine Weitergabe / keine Drittländerübermittlung
Es erfolgt **keine Weitergabe** Ihrer Daten durch uns an Dritte zu Werbe- oder Analysezwecken. Eine **Übermittlung in Drittländer** findet durch uns nicht statt. Etwaige Übermittlungen an CDN‑ oder Hosting‑Anbieter ergeben sich ausschließlich aus der **technischen Bereitstellung** der Website (siehe 2.2/2.3).

---

## 4. Rechtsgrundlagen im Überblick
- **Art. 6 Abs. 1 lit. f DSGVO** – Berechtigtes Interesse (Betrieb, Sicherheit, Komfortfunktionen via Local Storage, Auslieferung über CDN).  
- **Art. 6 Abs. 1 lit. b DSGVO** – Erfüllung/Anbahnung eines Vertrags (z. B. bei E‑Mail‑Kontakt).

Es findet **keine** automatisierte Entscheidungsfindung einschließlich Profiling im Sinne von **Art. 22 DSGVO** statt.

---

## 5. Ihre Rechte (Art. 12–22 DSGVO)
Sie haben das Recht auf **Auskunft**, **Berichtigung**, **Löschung**, **Einschränkung der Verarbeitung**, **Datenübertragbarkeit** sowie ein **Widerspruchsrecht** gegen Verarbeitungen, die auf **Art. 6 Abs. 1 lit. f DSGVO** beruhen.  
Sie haben zudem das Recht, sich bei einer **Datenschutz‑Aufsichtsbehörde** zu beschweren (Art. 77 DSGVO).

Kontaktieren Sie uns hierfür: [info@schuldschein-generator.de](mailto:info@schuldschein-generator.de).

---

## 6. So löschen Sie Local‑Storage‑Daten (Browser‑Hinweis)
Sie können die lokal gespeicherten Einstellungen jederzeit in Ihrem Browser löschen:
- **Firefox/Chrome/Edge/Brave:** Einstellungen → Datenschutz & Sicherheit → Website‑Daten / Browserdaten löschen → „Cookies und andere Websitedaten“ bzw. „Website‑Daten“ → Auswahl bestätigen.  
- Alternativ: Entwickler‑Tools (`F12`) → „Application/Anwendung“ → „Local Storage“ → Einträge `locale` und `theme` für diese Website manuell entfernen.

---

## 7. Sicherheit
Wir setzen angemessene **technische und organisatorische Maßnahmen** ein, um die Website sicher zu betreiben. Da die Anwendung clientseitig läuft, besteht **kein Risiko einer serverseitigen Datenpanne** durch Formulareingaben. Beachten Sie, dass die Übertragung im Internet (z. B. bei E‑Mails) Sicherheitslücken aufweisen kann.

---

## 8. Änderungen dieser Erklärung
Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen, z. B. wenn zusätzliche Funktionen (weitere Sprachen, neue CDN‑Dienste) hinzukommen. Es gilt stets die **aktuelle Fassung** auf dieser Seite.
