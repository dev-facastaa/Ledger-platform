# Changelog

Todas las mejoras de esta plataforma están documentadas aquí.  
El formato sigue [Keep a Changelog](https://keepachangelog.com/es/1.0.0/) y el versionado usa [Semantic Versioning](https://semver.org/lang/es/).

> **Convención de versiones**
> - `MAJOR` — cambios que rompen la estructura o flujo principal (ej: rediseño completo, migración a API real)
> - `MINOR` — nuevas funcionalidades o módulos (ej: nuevo módulo, nueva columna, nuevo flujo)
> - `PATCH` — correcciones de bugs, ajustes visuales, fixes de infraestructura

---

## [1.2.0] — 2026-05-23

### Añadido
- **Layer — Crear**: campos obligatorios Compañía (CF / SAS / Capital / Perú) y Moneda (COP / USD / PEN), independientes entre sí. La moneda no se deriva del país.
- **Layer — ID Interno**: cada ledger recibe un identificador alfanumérico consecutivo (`LDG-001`, `LDG-002`…) generado automáticamente al crearlo, visible en lista y detalle.
- **Configuración Contable**: campo opcional "Nota Contable" (texto libre) en cada Transaction Type.
- **Plan de Cuentas — Jerarquía**: 40 cuentas reales del plan Bold CF SAS con niveles `grupo / cuenta / auxiliar`. Selector en cascada (3 dropdowns encadenados) en la configuración de field mappings.
- **Módulo Integraciones**: renombrado desde "Exportación ERP" en Sidebar, header y navegación de detalle.

### Modificado
- **Transición de estado**: borrador → activo es la única dirección permitida. Los ledgers inactivos no pueden regresar a borrador ni activarse (guard en store + eliminación del botón "Reactivar").
- **Mock data ledgers**: los 5 ledgers precargados incluyen `company`, `currency` e `internalId`.
- **Plan de Cuentas — Crear cuenta**: formulario incluye campo de nivel jerárquico.

---

## [1.1.0] — 2026-05-22

### Añadido
- **Módulo ERP Independiente** (`/erp`): nueva vista centralizada con tabla de todos los ledgers, columnas País, Frecuencia, Formato ERP y badge de estado (Configurado / No configurado). Botón "Configurar" abre formulario ERP en modal sin salir de la vista.
- **Sidebar**: ítem "Exportación ERP" (icono Upload) debajo de Ledgers.
- **Ledger — Lista**: columna País con bandera emoji (🇨🇴 / 🇵🇪) y columna Frecuencia con chip estilizado. Filtro por país en el panel de filtros.
- **Ledger — Crear**: campos obligatorios País (dropdown Colombia/Perú) y Frecuencia (Diario/Semanal/Quincenal/Mensual) con validación.
- **Ledger — Detalle**: País y Frecuencia visibles en tarjeta Información General. Enlace directo a módulo ERP.
- **Tipos**: `LedgerCountry`, `LedgerFrequency` en `types/index.ts`.
- **Mock data**: 5 ledgers actualizados con `country` y `frequency`.
- **OpenSpec**: change `ledger-module-improvements-v1` documentado (proposal, design, specs, tasks).

### Eliminado
- Tab "Exportación ERP" del detalle de Ledger (ahora es módulo independiente).

---

## [1.0.0] — 2026-05-13

### Añadido
- **Prototipo completo** con Bold Design System (colores #121e6c / #ee424e, fuente Montserrat, componentes UI propios).
- **Módulo Ledgers**: lista con filtros (estado, producto), crear ledger (modal), detalle con tabs Información General / Configuración Contable / Exportación ERP, activar/desactivar ledger.
- **Módulo Configuración Contable**: gestión de `AccountingEntryConfig` por tipo de transacción, field mappings (cuenta contable, naturaleza débito/crédito), versionado de configs.
- **Módulo Monitoreo**: dashboard con métricas (transacciones, latencia P50/P95/P99, tasa de error), gráfico de volumen por ledger, gráfico histórico horario, alertas activas.
- **Módulo Transacciones**: log paginado con búsqueda, filtros por ledger/estado, detalle de transacción con payload y asientos contables generados.
- **Módulo Plan de Cuentas**: catálogo de cuentas contables (código, nombre, tipo, estado), crear/editar/inactivar cuentas.
- **Módulo Auditoría**: historial de eventos por ledger, filtros por acción/usuario, diff before/after de cambios.
- **Módulo ERP Config** (en detalle de Ledger): formulario de parámetros de exportación (formato CSV/JSON/XML, frecuencia, mapeo de campos), preview del archivo exportado.
- **Infraestructura**: Zustand store, React Query, React Router v6 con `basename="/Ledger-platform"`, GitHub Actions CI/CD, deploy a GitHub Pages.
- **Landing page** (`share.html`) para compartir con stakeholders.

---

<!-- Plantilla para próximas versiones:

## [X.Y.Z] — YYYY-MM-DD

### Añadido
-

### Modificado
-

### Corregido
-

### Eliminado
-

-->
