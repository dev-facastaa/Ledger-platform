# Ledger Platform — Registro de mejoras v1.2.0
**Período:** Mayo – Junio 2026  
**Rama de trabajo:** `develop` → `main` (3 Pull Requests)

---

## 1. Alineación al Merlin Design System

Se reemplazó el sistema de diseño propio por los tokens canónicos del **Merlin Design System** de Bold, haciendo el prototipo visualmente indistinguible del Bold Backoffice real.

### Tokens de color
| Token | Antes | Después |
|---|---|---|
| Coral / Acción primaria | `#ee424e` | `#FF2947` (Coral/100) |
| Background de página | `#f1f2f6` | `#F7F8FB` (Background/Page) |
| Estado Activo | `#4caf50` sólido | `#1B8959` texto · `#F4FDF9` fondo |
| Estado Pendiente/Borrador | `#ff9800` sólido | `#FFC217` texto · `#FFF3D1` fondo |
| Estado Inactivo/Error | `#ee424e` sólido | `#910022` texto · `#FBF3F5` fondo |
| Estado Informativo | — | `#0A53A5` texto · `#F1F9FF` fondo |

### Componentes actualizados

**Button** — 5 variantes Merlin  
- Primary: Coral `#FF2947`, pill `border-radius: 32px`, altura 48px  
- Secondary: blanco con borde coral  
- Tertiary: fondo `#F7F8FB`, texto azul  
- Text Primary / Text Secondary  

**Badge** — tokens feedback semánticos  
- Fondo claro + texto oscuro (no filled sólido)  
- `border-radius: 100px` (full pill)  
- Font: 12px / 700 (Caption/Bold Merlin)  

**Card** — `border-radius: 16px`, shadow `0px 4px 12px 0px rgba(18,30,108,0.08)`, sin borde

**Modal** — overlay `rgba(0,0,0,0.5)`, `border-radius: 18px`, título Title/Large 28px/400

**Input / Select / Textarea** — `border-radius: 12px`, focus coral `#FF2947`, error `#910022`

**Toast** — rediseño completo: fondo oscuro `#3F3F3F`, texto blanco, íconos de color semántico por variante

**Sidebar** — ítem activo: fondo translúcido `rgba(255,255,255,0.15)` + borde izquierdo `#FF2947` (antes: fondo coral sólido)

**PageHeader** — título Title/Large: 28px / weight 400 (antes: 24px font-black)

**Tabs** — underline activo `#FF2947` exacto

---

## 2. Selector de país global en el header

Se eliminó el filtro de país como dropdown dentro del módulo Ledger y se reemplazó por un **selector persistente en el header** visible en todos los módulos.

**Comportamiento:**
- Muestra el país activo como botón único con bandera + nombre + chevron (`🇨🇴 Colombia ∨`)
- Al hacer click abre un dropdown con la opción alternativa (`🇵🇪 Perú`)
- Al seleccionar, el store global `selectedCountry` se actualiza instantáneamente
- La tabla de Ledgers e Integraciones filtran automáticamente por el país activo
- Click fuera del dropdown lo cierra
- Default: Colombia

**Archivos modificados:**
- `src/store/index.ts` — nuevo campo `selectedCountry` + acción `setCountry()`
- `src/components/ui/AppLayout.tsx` — componente `CountrySelector` integrado en barra superior (44px)

---

## 3. Limpieza de campos en formularios y tablas

Se eliminaron campos redundantes ahora que el contexto de país está en el header global.

### Campo País
Removido de:
- Tabla principal de Ledgers (columna)
- Filtros de búsqueda de Ledgers (dropdown)
- Formulario "Crear Ledger" (campo → se toma automáticamente de `selectedCountry`)
- Vista de detalle del Ledger (Información General)
- Módulo Integraciones ERP (columna de tabla)

### Campo Compañía
- **Formulario "Crear Ledger"**: volvió como campo seleccionable con opciones filtradas por país activo:
  - 🇨🇴 Colombia → Bold CF · Bold Co · Bold Capital
  - 🇵🇪 Perú → Bold Pe (única opción)
- **Vista de detalle**: removido de la card Información General
- **Etiquetas actualizadas**: Bold SAS → Bold Co · Bold Perú → Bold Pe

### Campo Producto
Removido de:
- Tabla principal de Ledgers (columna)
- Formulario "Crear Ledger" (campo eliminado)
- Vista de detalle del Ledger (Información General)

---

## 4. Autocompletado de cuenta auxiliar

En el modal "Nueva Configuración Contable" / "Editar Configuración", se reemplazaron los **3 dropdowns en cascada** (Grupo → Cuenta → Auxiliar) por un **único campo de búsqueda con autocompletado**.

**Antes:** 3 selects dependientes — el usuario debía navegar la jerarquía del PUC manualmente.

**Ahora:** Un input que busca en tiempo real entre todas las cuentas auxiliares activas:
- Escribe código (ej. `1115`) o nombre (ej. `BANCOS`) → hasta 8 resultados
- Click en resultado → se selecciona la cuenta (código + nombre)
- Click fuera → dropdown se cierra
- Sin resultados → mensaje informativo

---

## 5. Fix de columna ID Interno

La columna "ID Interno" en la tabla de Ledgers mostraba los valores cortados en dos líneas (`LDG-\n001`). Se agregó `white-space: nowrap` tanto en la celda como en el badge para garantizar que `LDG-001` siempre se muestre en una sola línea.

---

## 6. Página de contexto para stakeholders (`share.html`)

Se actualizó la página estática de presentación del prototipo (`/share.html`) para reflejar todas las mejoras y alinear su diseño al Merlin Design System.

**Diseño actualizado:**
- Tokens de color Merlin (coral `#FF2947`, fondo `#F7F8FB`)
- Botones pill `border-radius: 32px`
- Cards con sombra Merlin, sin borde
- Badges con tokens feedback semánticos

**Contenido actualizado:**
- Selector de país 🇨🇴🇵🇪 mencionado como feature
- Autocompletado de cuenta auxiliar destacado
- Stack: React 19, React Router v7, Tailwind CSS v4, Merlin Design System
- 25 cuentas PUC precargadas (antes: 20)
- Versión v1.2.0 · Junio 2026

**URL:** `https://dev-facastaa.github.io/Ledger-platform/share.html`

---

## 7. CI/CD y flujo de ramas

Se estableció el flujo definitivo de trabajo:

| Rama | Propósito | Deploy |
|---|---|---|
| `main` | Producción estable | GitHub Pages automático |
| `develop` | Desarrollo y validación | Localhost `http://localhost:5173` |

- **GitHub Pages** solo despliega desde `main` (branch protection configurada)
- `develop` se valida localmente con `npm run dev` antes del merge
- Flujo: `develop` → PR → `/verify` + `/code-review` → merge → deploy automático

---

## Pull Requests entregados

| PR | Título | Commits |
|---|---|---|
| #1 | Claude Code tooling + Praxis pipeline | 3 |
| #2 | UX improvements — Merlin DS, country selector, field cleanup | 6 |
| #3 | share.html + remove Producto + account autocomplete | 3 |

---

## Versión
**v1.2.0** — `npm run build` ✅ · 0 errores TypeScript · 0 errores de consola
