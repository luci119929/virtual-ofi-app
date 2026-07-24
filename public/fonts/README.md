# Fuentes de marca — Virtual Ofi

Estas fuentes son **comerciales / con licencia** y no se versionan en el repo.

Colocá aquí los archivos (formato `.woff2` recomendado) y descomentá los bloques
`@font-face` en `src/app/globals.css`:

| Rol | Fuente | Archivo esperado |
|-----|--------|------------------|
| Logo y títulos | **Architype Aubette** | `architype-aubette.woff2` |
| Textos / interfaz | **Helvetica Now Text** | `helvetica-now-text.woff2` |
| Títulos grandes (opcional) | **Helvetica Now Display** | `helvetica-now-display.woff2` |

Mientras no estén los archivos, la app usa fallbacks del sistema (monospace para
el display, Helvetica/Arial para el texto), con un aspecto muy cercano al diseño.

> Convertí `.otf/.ttf` a `.woff2` con un conversor de confianza para mejor rendimiento.
