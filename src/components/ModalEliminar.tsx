import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Proveedor } from '../types';

interface Props {
  proveedor: Proveedor | null;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function ModalEliminar({ proveedor, onConfirmar, onCancelar }: Props): JSX.Element | null {
  if (!proveedor) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={26} className="text-red-400" />
          </div>
          <h3 className="font-display font-bold text-lg text-white mb-2">¿Eliminar proveedor?</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Vas a eliminar a <span className="text-white font-medium">{proveedor.nombre}</span>. Esta acción no se puede deshacer.
          </p>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onCancelar}
            className="flex-1 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition text-sm font-medium flex items-center justify-center gap-2">
            <X size={14} /> Cancelar
          </button>
          <button onClick={onConfirmar}
            className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white transition text-sm font-medium flex items-center justify-center gap-2">
            <Trash2 size={14} /> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
