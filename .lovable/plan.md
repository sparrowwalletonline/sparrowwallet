

# Landing Page Modernisierung

## Ziel
Die Landing Page bekommt ein moderneres, cleanes Design mit besserer visueller Hierarchie und zeitgemaesseren Gestaltungselementen.

## Geplante Aenderungen

### 1. Hero Section - Komplett ueberarbeitet
- Hintergrund: Von flachem Weiss zu einem dunklen, modernen Gradient (dunkelblau/schwarz) mit subtilen Glow-Effekten (blurred colored circles)
- Die vielen kleinen Crypto-Icons im Hintergrund entfernen (wirken unruhig) -- stattdessen ein paar grosse, subtile Glow-Orbs
- Headline: Weisser Text auf dunklem Hintergrund, etwas kompakter (statt 4 separate h2-Zeilen eine zusammenhaengende Headline)
- Die 3 rotierenden Rauten-Icons (Sicher/Privat/Schnell) werden zu modernen Pill-Badges umgebaut (horizontal nebeneinander, mit Icon + Text)
- Buttons: Glassmorphism-Stil mit leichtem Blur-Effekt
- Das Screenshot-Bild bekommt einen staerkeren Glow-Schatten und eine leichte 3D-Perspektive
- Den langen Beschreibungstext unter dem Bild in eine kompaktere, visuell ansprechendere Box packen

### 2. Sicherheit Section
- Von weissem Hintergrund zu einem subtilen dunklen Gradient
- SecurityCards bekommen Glassmorphism-Effekt (halbtransparenter Hintergrund mit Blur)
- Icons bekommen farbige Glow-Ringe

### 3. Schritte Section ("Einfache Schritte zum Start")
- Verbindungslinien zwischen den 3 Schritten (gestrichelte Linie oder Gradient-Linie)
- Step-Nummern werden groesser und bekommen einen Gradient-Hintergrund
- Cards bekommen eine leichte Border mit Gradient

### 4. Allgemeine Verbesserungen
- Framer Motion Animationen fuer alle Sections (fade-in beim Scrollen)
- Einheitlichere Spacing und Section-Uebergaenge
- Entfernung von ungenutzten Interfaces/Komponenten (Testimonial, FAQ, AssetCard etc. die im Code definiert aber nicht verwendet werden)

## Technische Details

### Dateien die geaendert werden
- `src/pages/LandingPage.tsx` -- Hauptaenderungen am Layout und Design
- `src/index.css` -- Neue CSS-Klassen fuer Glow-Effekte und Glassmorphism

### Keine neuen Abhaengigkeiten noetig
- Framer Motion ist bereits installiert und wird in FeaturesSection verwendet
- Tailwind CSS deckt alle Styling-Aenderungen ab

### Beibehaltene Elemente
- Alle Texte/Inhalte bleiben identisch (deutsch)
- Navigation/Header bleibt unveraendert
- Footer bleibt unveraendert
- FeaturesSection und SupportedAssetsSection bleiben unveraendert (sind separate Komponenten)
- Alle Button-Funktionalitaet (Register, Login, Wallet-Zugriff) bleibt gleich

