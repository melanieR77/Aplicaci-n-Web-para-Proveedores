import { useState, useEffect } from 'react';
import { Proveedor, ProveedorFormData } from '../types';

const STORAGE_KEY = 'alejandro_proveedores_v1';

interface UseProveedoresReturn {
  proveedores: Proveedor[];
  agregarProveedor: (datos: ProveedorFormData) => Proveedor;
  actualizarProveedor: (id: string, datos: ProveedorFormData) => void;
  eliminarProveedor: (id: string) => void;
}

export function useProveedores(): UseProveedoresReturn {
  const [proveedores, setProveedores] = useState<Proveedor[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as Proveedor[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(proveedores));
    } catch (e) {
      console.error('Error guardando en localStorage', e);
    }
  }, [proveedores]);

  const agregarProveedor = (datos: ProveedorFormData): Proveedor => {
    const nuevo: Proveedor = {
      ...datos,
      id: crypto.randomUUID(),
      fechaRegistro: new Date().toLocaleDateString('es-HN'),
    };
    setProveedores(prev => [nuevo, ...prev]);
    return nuevo;
  };

  const actualizarProveedor = (id: string, datos: ProveedorFormData): void => {
    setProveedores(prev =>
      prev.map(p => (p.id === id ? { ...p, ...datos } : p))
    );
  };

  const eliminarProveedor = (id: string): void => {
    setProveedores(prev => prev.filter(p => p.id !== id));
  };

  return { proveedores, agregarProveedor, actualizarProveedor, eliminarProveedor };
}
