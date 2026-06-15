import React from 'react';
import { Pencil, Trash2, Phone, Mail, MapPin, Tag, Calendar, Package } from 'lucide-react';
import { CategoriaProveedor, Proveedor } from '../types';

const CATEGORIA_COLORES: Record<CategoriaProveedor, string> = {
  'Alimentos':   'bg-green-500/15 text-green-400 border-green-500/30',
  'Electrónica': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'Limpieza':    'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  'Papelería':   'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  'Ferretería':  'bg-orange-500/15 text-orange-400 border-orange-500/30',
  'Tecnología':  'bg-purple-500/15 text-purple-400 border-purple-500/30',
  'Ropa':        'bg-pink-500/15 text-pink-400 border-pink-500/30',
  'Otro':        'bg-gray-500/15 text-gray-400 border-gray-500/30',
};

function Badge({ categoria }: { categoria: CategoriaProveedor }): JSX.Element {
  const cls = CATEGORIA_COLORES[categoria] ?? CATEGORIA_COLORES['Otro'];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${cls}`}>
      <Tag size={10} />{categoria}
    </span>
  );
}

interface Props {
  proveedores: Proveedor[];
  busqueda: string;
  onEditar: (p: Proveedor) => void;
  onEliminar: (p: Proveedor) => void;
}

const HEADERS = ['Proveedor', 'Contacto', 'Categoría', 'Teléfono', 'Correo', 'Dirección', 'Registro', ''];

export default function TablaProveedores({ proveedores, busqueda, onEditar, onEliminar }: Props): JSX.Element {
  const filtrados = proveedores.filter(p =>
    [p.nombre, p.contacto, p.email, p.categoria, p.telefono, p.direccion]
      .join(' ')
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  if (proveedores.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center mx-auto mb-4">
          <Package size={28} className="text-gray-600" />
        </div>
        <p className="text-gray-400 font-medium">Sin proveedores registrados</p>
        <p className="text-gray-600 text-sm mt-1">Presiona "Nuevo proveedor" para comenzar.</p>
      </div>
    );
  }

  if (filtrados.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 font-medium">Sin resultados para "{busqueda}"</p>
        <p className="text-gray-600 text-sm mt-1">Intenta con otro término de búsqueda.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700">
            {HEADERS.map(h => (
              <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {filtrados.map(p => (
            <tr key={p.id} className="hover:bg-gray-800/40 transition group">
              <td className="px-4 py-3">
                <span className="font-medium text-white">{p.nombre}</span>
                {p.notas && (
                  <p className="text-gray-500 text-xs mt-0.5 max-w-[180px] truncate">{p.notas}</p>
                )}
              </td>
              <td className="px-4 py-3 text-gray-300">{p.contacto}</td>
              <td className="px-4 py-3"><Badge categoria={p.categoria} /></td>
              <td className="px-4 py-3">
                <a href={`tel:${p.telefono}`} className="text-gray-300 hover:text-indigo-400 transition flex items-center gap-1">
                  <Phone size={12} className="text-gray-600" />{p.telefono}
                </a>
              </td>
              <td className="px-4 py-3">
                <a href={`mailto:${p.email}`} className="text-gray-300 hover:text-indigo-400 transition flex items-center gap-1 max-w-[160px] truncate">
                  <Mail size={12} className="text-gray-600" />{p.email}
                </a>
              </td>
              <td className="px-4 py-3">
                <span className="text-gray-400 flex items-center gap-1 max-w-[180px] truncate" title={p.direccion}>
                  <MapPin size={12} className="text-gray-600 flex-shrink-0" />{p.direccion}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="text-gray-500 flex items-center gap-1 text-xs">
                  <Calendar size={11} />{p.fechaRegistro}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => onEditar(p)}
                    className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-indigo-600 flex items-center justify-center text-gray-300 hover:text-white transition"
                    title="Editar">
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => onEliminar(p)}
                    className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-red-600 flex items-center justify-center text-gray-300 hover:text-white transition"
                    title="Eliminar">
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
