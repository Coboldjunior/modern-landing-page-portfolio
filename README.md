# Landing Page Portfolio

Ein statisches GitHub-Portfolio mit mehreren Landing-Page-Beispielen. Das Projekt ist ohne Build-Schritt nutzbar und eignet sich direkt fuer GitHub Pages.

## Struktur

- `index.html` - Portfolio-Startseite mit Filter und Projektuebersicht
- `landing-pages/` - sechs eigenstaendige Landing-Page-Beispiele
- `assets/` - lokale visuelle Assets fuer Hero- und Projektbereiche
- `styles.css` - Portfolio-Styles
- `script.js` - kleine UI-Interaktionen fuer Filter und Kontaktkopie

## Lokal ansehen

Die Seite kann direkt im Browser geoeffnet werden:

```text
index.html
```

Optional kann ein einfacher lokaler Server verwendet werden:

```bash
node scripts/serve.mjs 8080
```

Danach ist die Seite unter `http://localhost:8080` erreichbar.

## Verifikation

Lokale Links und Assets lassen sich mit dem mitgelieferten Check pruefen:

```bash
node scripts/verify-links.mjs
```

## GitHub Pages

In den Repository-Einstellungen unter **Pages** den Branch auswaehlen, auf dem diese Dateien liegen, und als Quelle den Repository-Root (`/`) verwenden.
