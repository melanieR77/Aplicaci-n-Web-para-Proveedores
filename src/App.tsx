import React, { useState } from 'react';
import { useProveedores } from './hooks/useProveedores';
import FormularioProveedor from './components/FormularioProveedor';
import TablaProveedores from './components/TablaProveedores';
import ModalEliminar from './components/ModalEliminar';
import { Toaster, toast } from './components/Toast';
import { Plus, Search, Store, Users, LayoutGrid } from 'lucide-react';
import { Proveedor, ProveedorFormData } from './types';

export default function App(): JSX.Element {
  const { proveedores, agregarProveedor, actualizarProveedor, eliminarProveedor } = useProveedores();

  const [mostrarFormulario, setMostrarFormulario]   = useState<boolean>(false);
  const [proveedorEditando, setProveedorEditando]   = useState<Proveedor | null>(null);
  const [proveedorEliminando, setProveedorEliminando] = useState<Proveedor | null>(null);
  const [busqueda, setBusqueda]                     = useState<string>('');

  const handleGuardar = (datos: ProveedorFormData): void => {
    if (proveedorEditando) {
      actualizarProveedor(proveedorEditando.id, datos);
      toast.success(`✓ Proveedor "${datos.nombre}" actualizado correctamente.`);
    } else {
      agregarProveedor(datos);
      toast.success(`✓ Proveedor "${datos.nombre}" registrado.`);
    }
    setMostrarFormulario(false);
    setProveedorEditando(null);
  };

  const handleEditar = (proveedor: Proveedor): void => {
    setProveedorEditando(proveedor);
    setMostrarFormulario(true);
  };

  const handleCancelar = (): void => {
    setMostrarFormulario(false);
    setProveedorEditando(null);
  };

  const handleConfirmarEliminar = (): void => {
    if (!proveedorEliminando) return;
    eliminarProveedor(proveedorEliminando.id);
    toast.error(`Proveedor "${proveedorEliminando.nombre}" eliminado.`);
    setProveedorEliminando(null);
  };

  const totalCategorias = new Set(proveedores.map(p => p.categoria)).size;
  const totalFiltrados  = proveedores.filter(p =>
    [p.nombre, p.contacto, p.email, p.categoria].join(' ').toLowerCase().includes(busqueda.toLowerCase())
  ).length;

  interface StatCard { icon: JSX.Element; valor: number; label: string; }
  const stats: StatCard[] = [
    { icon: <Users size={20} className="text-indigo-400" />,   valor: proveedores.length, label: 'Proveedores' },
    { icon: <LayoutGrid size={20} className="text-purple-400" />, valor: totalCategorias,   label: 'Categorías'  },
    { icon: <Search size={20} className="text-sky-400" />,     valor: totalFiltrados,      label: busqueda ? 'Encontrados' : 'Activos' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Toaster />

      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Store size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-white text-base leading-none">Proveedores</h1>
              <p className="text-gray-500 text-xs mt-0.5">Tienda de Alejandro</p>
            </div>
          </div>
          <button
            onClick={() => { setProveedorEditando(null); setMostrarFormulario(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-indigo-600/20">
            <Plus size={16} /> Nuevo proveedor
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map(({ icon, valor, label }) => (
            <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                {icon}
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-white leading-none">{valor}</p>
                <p className="text-gray-500 text-xs mt-1">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between gap-4">
            <h2 className="font-display font-bold text-white text-base">Lista de proveedores</h2>
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre, categoría..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-100 placeholder-gray-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition"
              />
            </div>
          </div>
          <TablaProveedores
            proveedores={proveedores}
            busqueda={busqueda}
            onEditar={handleEditar}
            onEliminar={setProveedorEliminando}
          />
        </div>
      </main>

      {mostrarFormulario && (
        <FormularioProveedor
          proveedorEditando={proveedorEditando}
          onGuardar={handleGuardar}
          onCancelar={handleCancelar}
        />
      )}

      {proveedorEliminando && (
        <ModalEliminar
          proveedor={proveedorEliminando}
          onConfirmar={handleConfirmarEliminar}
          onCancelar={() => setProveedorEliminando(null)}
        />
      )}
    </div>
  );
}
