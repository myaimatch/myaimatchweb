# Guía: Agregar campos nuevos en Airtable
**Antes de la implementación — hazlo tú, toma ~10 minutos**

---

## ¿En qué tabla van los campos?

**Todos los campos nuevos van en la tabla `Tools`.**

No necesitas conectarlas entre sí. Son campos simples (checkboxes, números, listas) que viven dentro de cada fila de herramienta.

```
Tools table
├── Name          ← ya existe
├── Slug          ← ya existe
├── Website URL   ← ya existe
├── ...           ← campos existentes
│
├── Support Languages    ← NUEVO ✦
├── UI Languages         ← NUEVO ✦
├── Founded Year         ← NUEVO ✦
└── ... (10 más)         ← NUEVO ✦
```

---

## Cómo agregar un campo nuevo en Airtable

1. Abre tu base → haz clic en la tabla **Tools**
2. Desplázate hasta la última columna (la más a la derecha)
3. Haz clic en el **ícono `+`** que aparece al final de las columnas
4. Elige el tipo de campo (ver tabla abajo)
5. Escribe el nombre exactamente como aparece en esta guía
6. Haz clic en **Save**

Repite para cada campo. Son 13 en total.

---

## Los 13 campos — en orden de creación

### Grupo 1: Idiomas y acceso (6 campos)

| # | Nombre exacto del campo | Tipo en Airtable | Opciones a agregar |
|---|---|---|---|
| 1 | `Support Languages` | **Multiple select** | English, Spanish, French, German, Portuguese, Japanese, Other |
| 2 | `UI Languages` | **Multiple select** | English, Spanish, French, German, Portuguese, Japanese, Other |
| 3 | `Founded Year` | **Number** | Formato: Integer (sin decimales) |
| 4 | `Has Free Plan` | **Checkbox** | (sin opciones, solo marcar/desmarcar) |
| 5 | `Trial Days` | **Number** | Formato: Integer (0 = sin trial) |
| 6 | `Best For` | **Single select** | Solo, Small Team, Mid-Market, Enterprise, All |

### Grupo 2: Señales de confianza (4 campos)

| # | Nombre exacto del campo | Tipo en Airtable | Opciones a agregar |
|---|---|---|---|
| 7 | `Has API` | **Checkbox** | (sin opciones) |
| 8 | `Integrations` | **Multiple select** | Zapier, Slack, Make, Google Workspace, HubSpot, Notion, Stripe, Other |
| 9 | `Company HQ` | **Single select** | USA, EU, UK, Canada, LATAM, Asia, Other |
| 10 | `Employee Count` | **Single select** | 1-10, 11-50, 51-200, 200+ |

### Grupo 3: Compliance y técnico (3 campos)

| # | Nombre exacto del campo | Tipo en Airtable | Opciones a agregar |
|---|---|---|---|
| 11 | `GDPR Compliant` | **Checkbox** | (sin opciones) |
| 12 | `Has Mobile App` | **Checkbox** | (sin opciones) |
| 13 | `SOC2 Certified` | **Checkbox** | (sin opciones) |

---

## Tipos de campo — referencia rápida

| Tipo en Airtable | Cuándo usarlo |
|---|---|
| **Checkbox** | Sí/No, verdadero/falso |
| **Number** | Años, días — un solo número |
| **Single select** | Solo una opción posible (ej. región, tamaño) |
| **Multiple select** | Varias opciones a la vez (ej. idiomas, integraciones) |

---

## Cómo crear un "Single select" o "Multiple select"

1. Al crear el campo, elige el tipo **Single select** o **Multiple select**
2. En la sección "Options", escribe cada opción y presiona Enter
3. Agrega todas las opciones de la tabla de arriba
4. Haz clic en **Save**

> El script de automatización usará exactamente estos nombres de opciones.
> **No cambies los nombres después** o el script no podrá matchearlos.

---

## Checklist final antes de avisar

- [ ] Los 13 campos están creados en la tabla `Tools`
- [ ] Los nombres son exactos (mayúsculas incluidas)
- [ ] Los tipos son los correctos (checkbox ≠ number)
- [ ] Los selects tienen todas sus opciones cargadas
- [ ] Las otras tablas (Categories, Pricing, Leads) **no se tocan**

---

## ¿Listo? Avísame cuando termines

Una vez que tengas los 13 campos en Airtable, escríbeme "listo" y comienzo a implementar el script de enriquecimiento automático.
