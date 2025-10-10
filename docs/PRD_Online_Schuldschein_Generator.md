# 🧾 PRD: Online-Schuldschein-Generator (Client-only)

## 1. 🎯 Ziel
Ein browserbasierter, rein client-seitiger **Schuldschein-Generator** für Privatpersonen, der ohne Server- oder Datenspeicherung funktioniert. Der Nutzer gibt seine Daten ein, sieht rechts eine Live-Vorschau des fertigen Vertrags und kann diesen als **PDF herunterladen**. Der Generator dient als **rechtssicheres Muster** für private Darlehensvereinbarungen nach deutschem Recht (§§ 488 ff. BGB).

## 2. 🧩 Technologie-Vorgaben
- Keine Serververarbeitung, keine Speicherung, kein Tracking.  
- Nur statische Technologien: **HTML + CSS (Tailwind via CDN)** + **JavaScript**.  
- PDF-Generierung via **pdf-lib** oder **jsPDF** (Client-seitig über CDN).  
- Kein Framework-Build, kein Backend, keine Datenbank.  
- Vollständig in einer Datei `index.html`.  

## 3. 🖥️ Layout / UX
**Zweispaltiges Layout (Split View):**
- **Linke Spalte:** Formular-Editor (Eingabefelder mit Gruppen/Sections).  
- **Rechte Spalte:** Live-Vorschau des Schuldscheins mit Button **„PDF herunterladen“**.  
- Responsive Design: bei schmalen Viewports → Editor oben, Vorschau unten.  
- Farbthema: hell, seriös (Weiß / Grau / Akzent in Dunkelblau oder Grün).  

## 4. 🧠 Struktur und Inhalte

### 4.1 Formular-Sektionen
#### 👤 Darlehensgeber
| Feld | Typ | Pflicht | Beispiel |
|------|-----|----------|-----------|
| Name | text | ✅ | Michael Blaess |
| Adresse | text | ✅ | Kurze Str. 2, 15345 Rehfelde |
| Geburtsdatum | date | ✅ | 26.03.1972 |
| Personalausweisnummer | text | ✅ | L3Y6F1P1H |
| IBAN für Rückzahlung | text | ✅ | DE08 1001 2345 0117 6793 01 |

#### 👥 Darlehensnehmer/in
| Feld | Typ | Pflicht |
|------|-----|----------|
| Name | text | ✅ |
| Adresse | text | ✅ |
| Geburtsdatum | date | ✅ |
| Personalausweisnummer | text | ✅ |

#### 💰 Darlehensdetails
| Feld | Typ | Pflicht | Beschreibung |
|------|-----|----------|---------------|
| Darlehenssumme (€) | number | ✅ | Standard: 1000 |
| Zinssatz (%) | number | ❌ | Default: 0 („zinslos“) |
| Verzugszins (%) | number | ✅ | Default: 5 % über Basiszinssatz p.a. |
| Laufzeit (Monate) | number | ✅ | Default: 6 |
| Vertragsdatum | date | ✅ | Default: heute |
| Berechnetes Fälligkeitsdatum | auto | – | = Vertragsdatum + Laufzeit |
| Rückzahlungsart | select | ✅ | Einmalzahlung / Ratenzahlung |
| Rückzahlungsrhythmus | select | ❌ | Monatlich, vierteljährlich (sichtbar bei Ratenzahlung) |
| Auszahlungsart | select | ✅ | Bar / Überweisung |
| IBAN der Darlehensnehmerin | text | ❌ | Nur bei „Überweisung“ sichtbar |
| Zweck | textarea | ❌ | z. B. Kauf eines Pferdes |
| Gerichtsstand (Ort) | text | ✅ | Wohnort Darlehensgeber |

#### 👁 Zeuge/Zeugin (optional)
| Feld | Typ | Pflicht |
|------|-----|----------|
| Name | text | ❌ |
| Adresse | text | ❌ |
| Geburtsdatum | date | ❌ |
| Personalausweisnummer | text | ❌ |

## 5. 📄 Live-Vorschau / PDF-Inhalt
Die Vorschau zeigt in Echtzeit den fertigen Schuldschein im typischen Layout. Beim Klick auf **„PDF herunterladen“** wird ein A4-PDF generiert, das alle Benutzerdaten automatisch einfügt. Enthaltene Paragraphen:

1. **§1 Darlehenssumme**
2. **§2 Zweck**
3. **§3 Auszahlung**
4. **§4 Rückzahlung**
5. **§5 Verzinsung / Verzug**
6. **§6 Schriftform**
7. **§7 Gerichtsstand**
8. **§8 Salvatorische Klausel**
9. **Ort, Datum, Unterschriften**
10. **Zeugenbestätigung (optional)**
11. **Disclaimer (immer enthalten)**

## 6. ⚙️ Funktionale Anforderungen
- Live-Rendering der Vorschau mit automatischer Aktualisierung.  
- PDF-Erstellung per Button („PDF herunterladen“) → erzeugt Download.  
- Keine Speicherung oder Serververbindung.  
- Lokale Berechnung der Fälligkeit (Vertragsdatum + Laufzeit Monate).  
- Beträge auch in Worten ausgeben.  
- Validierung: Pflichtfelder, einfache IBAN-/Datum-Checks.  
- Fehlermeldungen inline im Formular.  

## 7. 🧱 UI-Details
- Header mit Titel, Kurzbeschreibung, Datenschutzhinweis.  
- Editor (links) in Abschnitten (Accordion oder Tabs).  
- Vorschau (rechts) mit typografisch ansprechendem Layout.  
- Buttons: **PDF herunterladen**, **Zurücksetzen**.  
- Footer: © 2025 Online-Schuldschein-Generator | Keine Rechtsberatung | Keine Datenspeicherung  

## 8. 🔒 Datenschutz & Sicherheit
- Kein Tracking, keine Cookies, keine Speicherung.  
- Hinweisbox im Formular:  
  > 🔐 **Datenschutzhinweis:** Alle Eingaben bleiben ausschließlich in Ihrem Browser.  
- Content-Security-Policy nur für eigene Domain und PDF/Tailwind-CDNs.  

## 9. 🧰 Technische Hinweise
- Verwende `pdf-lib` für Textlayout.  
- Verwende `Intl.DateTimeFormat('de-DE')` für Datumsformat.  
- Nutze Tailwind-CDN (`https://cdn.jsdelivr.net/npm/tailwindcss@3.3.0/dist/tailwind.min.css`).  
- Eine einzige Datei `index.html`.  
- Code kommentieren (`// PDF-Erstellung`, `// Laufzeitberechnung`).  

## 10. 🚀 Zielausgabe
Claude soll eine **vollständige, lauffähige `index.html`-Datei** generieren, die sofort funktioniert (lokal öffnen → Formular ausfüllen → PDF herunterladen).
