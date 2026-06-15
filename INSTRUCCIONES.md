# Gestión de Proveedores (TypeScript) — Tienda de Alejandro

## Estructura del proyecto

```
proveedores-ts/
├── public/
│   └── index.html
├── src/
│   ├── types.ts                          ← Interfaces y tipos compartidos
│   ├── components/
│   │   ├── FormularioProveedor.tsx       ← Formulario crear/editar con validaciones
│   │   ├── TablaProveedores.tsx          ← Tabla con búsqueda en vivo
│   │   ├── ModalEliminar.tsx             ← Modal de confirmación
│   │   └── Toast.tsx                     ← Sistema de notificaciones propio
│   ├── hooks/
│   │   └── useProveedores.ts             ← Lógica CRUD + localStorage
│   ├── App.tsx
│   └── index.tsx
├── tsconfig.json
└── package.json
```

## Requisitos previos

- Node.js v16 o superior
- npm v7 o superior

```bash
node --version   # debe ser >= 16
npm --version    # debe ser >= 7
```

---

## Comandos para la terminal

### 1. Entrar al proyecto
```bash
cd proveedores-ts
```

### 2. Instalar dependencias
```bash
npm install --legacy-peer-deps
```

### 3. Correr en modo desarrollo
```bash
npm start
```
Abre `http://localhost:3000` automáticamente.

### 4. Compilar para producción
```bash
npm run build
```
Genera `build/` lista para cualquier servidor estático.

### 5. Servir el build localmente (opcional)
```bash
npx serve -s build
```

---

## Tipos principales (src/types.ts)

| Tipo | Descripción |
|---|---|
| `CategoriaProveedor` | Union type con las 8 categorías válidas |
| `Proveedor` | Entidad completa con id y fechaRegistro |
| `ProveedorFormData` | Omit<Proveedor, 'id' \| 'fechaRegistro'> — usado en el formulario |
| `ErroresFormulario` | `Partial<Record<keyof ProveedorFormData, string>>` |
| `ToastType` | `'success' | 'error' | 'info'` |
| `ToastItem` | `{ id, message, type }` |

## Funcionalidades

| Función | Detalle |
|---|---|
| ✅ Crear | Modal con validación en tiempo real por campo |
| ✅ Listar | Tabla tipada con 8 columnas |
| ✅ Editar | Formulario precargado, misma interfaz |
| ✅ Eliminar | Confirmación modal antes de borrar |
| ✅ Buscar | Filtro en vivo, múltiples campos |
| ✅ Notificaciones | Toast custom, sin `alert()` nativo |
| ✅ Persistencia | `localStorage` sobrevive al recargar |
