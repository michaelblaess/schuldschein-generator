# 📝 Offene Punkte – Online-Schuldschein-Generator

## ⚖️ Rechtliche Klärungen

### 1. Vertragsklauseln
- [ ] **Juristische Review aller §§ 1-8**: Vertragstext muss von Fachanwalt geprüft werden
- [ ] **Disclaimer-Formulierung**: Aktuell "rechtssicheres Muster" → besser "Mustervorlage ohne Gewähr"
- [ ] **Salvatorische Klausel**: Formulierung prüfen lassen
- [ ] **Gerichtsstand**: Ist "Wohnort Darlehensgeber" immer zulässig?

### 2. Verzugszinsen
- [ ] **Basiszinssatz-Referenz**: Wo finden Nutzer den aktuellen Basiszinssatz?
- [ ] **Standard "5% über Basiszinssatz"**: Ist das marktüblich/angemessen?

## 💰 Finanzberechnungen

### 3. Ratenzahlung
- [ ] **Ratenplan-Darstellung**: Soll eine Tabelle mit Datum/Betrag/Restschuld angezeigt werden?
- [ ] **Zinsen bei Ratenzahlung**: 
  - Zinsen auf Restschuld oder auf ursprüngliche Summe?
  - Tilgungsplan mit Tilgungs- und Zinsanteil?
  - Annuitätendarlehen oder feste Raten + Zinsen?
- [ ] **Erste Rate**: Fällig sofort oder nach 1 Monat/Quartal?
- [ ] **Letzte Rate**: Exaktes Enddatum bei vierteljährlicher Zahlung?

### 4. Betrag in Worten
- [ ] **Aktuell implementiert**: Einfache Variante ohne Cent-Beträge
- [ ] **Erweiterung**: Sollen auch Cent-Beträge in Worten dargestellt werden? (z.B. "1.250,50 € → Eintausendzweihundertfünfzig Euro und fünfzig Cent")

## 🎨 UI/UX-Verbesserungen

### 5. Benutzerführung
- [ ] **Tooltip-Hilfen**: Bei welchen Feldern sind Erklärungen sinnvoll?
  - Verzugszins
  - Gerichtsstand
  - IBAN-Format
  - Personalausweisnummer
- [ ] **Beispiel-Daten-Button**: Soll es einen "Demo-Daten laden"-Button geben?
- [ ] **Fortschrittsanzeige**: Bei mehrstufigem Formular sinnvoll?

### 6. Export-Optionen
- [ ] **Druckversion**: Zusätzlich Browser-Druckdialog anbieten?
- [ ] **Copy-to-Clipboard**: Vertragstext als Plain Text kopieren?
- [ ] **PDF-Dateiname**: Format festlegen (z.B. "Schuldschein_MustermannMax_2025-01-15.pdf")

## 🔧 Technische Details

### 7. PDF-Generierung
- [ ] **Font-Einbettung**: Deutsche Umlaute korrekt darstellen
- [ ] **Layout-Konsistenz**: Testen auf verschiedenen Geräten/Browsern
- [ ] **Seitenumbrüche**: Bei langen Texten (z.B. Zweck) automatisch umbrechen?
- [ ] **Unterschriftsfelder**: 
  - Leere Linien im PDF (_______________)?
  - Hinweis "Datum und Unterschrift"?
  - Anzahl der Linien (2 für Parteien, 1 für Zeuge)?

### 8. Validierung
- [ ] **IBAN-Prüfung**: Nur Format oder auch Prüfziffer?
- [ ] **Personalausweisnummer**: Welches Format? (Alt: 9-stellig, Neu: 9 alphanumerisch)
- [ ] **Mindestwerte**: 
  - Darlehenssumme min. 1 €?
  - Laufzeit min. 1 Monat?
  - Zinssatz max. X %?

### 9. Datumsberechnungen
- [ ] **Fälligkeitsdatum**: 
  - Ende des Monats oder exakt Tag+X Monate?
  - Bei 31.01. + 1 Monat = 28./29.02. oder 03.03.?
- [ ] **Ratentermine**: Fester Tag im Monat (z.B. immer der 1.) oder relativ zum Vertragsdatum?

## 🌍 Internationalisierung

### 10. Währungen
- [ ] **Nur Euro**: Aktuell fest codiert
- [ ] **Multi-Währung**: Sinnvoll für grenzüberschreitende Darlehen?

### 11. Sprache
- [ ] **Nur Deutsch**: Aktuell fest
- [ ] **Mehrsprachigkeit**: Sinnvoll? (z.B. Englisch für internationale Nutzer)

## 🧪 Testing

### 12. Browser-Kompatibilität
- [ ] **Minimale Browser-Version**: Festlegen (z.B. Chrome 90+, Firefox 88+, Safari 14+)
- [ ] **Mobile**: Vollständig auf Smartphones testbar?
- [ ] **PDF-Download**: Funktioniert auf iOS/Android?

### 13. Edge Cases
- [ ] **Sehr große Beträge**: Darstellung von Millionen-Beträgen
- [ ] **Sehr lange Laufzeiten**: 120+ Monate korrekt berechnen?
- [ ] **Rückdatierung**: Vertragsdatum in der Vergangenheit erlauben?

## 📋 Priorisierung

### Must-Have (vor Launch)
1. ⚖️ Rechtliche Review aller Klauseln
2. 💰 Zinsen bei Ratenzahlung klären
3. 🔧 PDF mit deutschen Umlauten testen
4. 🧪 Browser-Kompatibilität prüfen

### Should-Have (Version 1.1)
1. 🎨 Tooltip-Hilfen
2. 🔧 Beispiel-Daten-Button
3. 📋 Ratenplan-Tabelle

### Nice-to-Have (Future)
1. 🌍 Mehrsprachigkeit
2. 💰 Erweiterte Zinsberechnungen
3. 🎨 Druckversion

---

**Stand:** 2025-01-08  
**Letzte Aktualisierung:** Initial erstellt
