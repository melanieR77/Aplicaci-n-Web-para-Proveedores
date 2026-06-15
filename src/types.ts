export type CategoriaProveedor =
  | 'Alimentos'
  | 'Electrónica'
  | 'Limpieza'
  | 'Papelería'
  | 'Ferretería'
  | 'Tecnología'
  | 'Ropa'
  | 'Otro';

export interface Proveedor {
  id: string;
  nombre: string;
  contacto: string;
  telefono: string;
  email: string;
  direccion: string;
  categoria: CategoriaProveedor;
  notas: string;
  fechaRegistro: string;
}

export type ProveedorFormData = Omit<Proveedor, 'id' | 'fechaRegistro'>;

export type ErroresFormulario = Partial<Record<keyof ProveedorFormData, string>>;

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}
