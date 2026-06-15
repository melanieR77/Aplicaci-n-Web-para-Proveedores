import React, { useState, useEffect, ChangeEvent, FocusEvent, FormEvent } from 'react';
import { X, Save, UserPlus } from 'lucide-react';
import {
  Proveedor,
  ProveedorFormData,
  CategoriaProveedor,
  ErroresFormulario,
} from '../types';

const CATEGORIAS: CategoriaProveedor[] = [
  'Alimentos', 'Electrónica', 'Limpieza', 'Papelería',
  'Ferretería', 'Tecnología', 'Ropa', 'Otro',
];

const CAMPOS_INICIALES: ProveedorFormData = {
  nombre:    '',
  contacto:  '',
  telefono:  '',
  email:     '',
  direccion: '',
  categoria: '' as CategoriaProveedor,
  notas:     '',
};

function validar(campos: ProveedorFormData): ErroresFormulario {
  const errores: ErroresFormulario = {};

  if (!campos.nombre.trim())
    errores.nombre = 'El nombre es obligatorio.';
  else if (campos.nombre.trim().length < 3)
    errores.nombre = 'Mínimo 3 caracteres.';

  if (!campos.contacto.trim())
    errores.contacto = 'El nombre de contacto es obligatorio.';

  if (!campos.telefono.trim())
    errores.telefono = 'El teléfono es obligatorio.';
  else if (!/^[\d\s\-+()]{7,15}$/.test(campos.telefono.trim()))
    errores.telefono = 'Formato inválido (7–15 dígitos).';

  if (!campos.email.trim())
    errores.email = 'El correo es obligatorio.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campos.email.trim()))
    errores.email = 'Correo electrónico inválido.';

  if (!campos.direccion.trim())
    errores.direccion = 'La dirección es obligatoria.';

  if (!campos.categoria)
    errores.categoria = 'Seleccione una categoría.';

  return errores;
}

interface Props {
  proveedorEditando: Proveedor | null;
  onGuardar: (datos: ProveedorFormData) => void;
  onCancelar: () => void;
}

export default function FormularioProveedor({ proveedorEditando, onGuardar, onCancelar }: Props): JSX.Element {
  const [campos, setCampos]   = useState<ProveedorFormData>(CAMPOS_INICIALES);
  const [errores, setErrores] = useState<ErroresFormulario>({});
  const [tocados, setTocados] = useState<Partial<Record<keyof ProveedorFormData, boolean>>>({});

  useEffect(() => {
    if (proveedorEditando) {
      setCampos({
        nombre:    proveedorEditando.nombre,
        contacto:  proveedorEditando.contacto,
        telefono:  proveedorEditando.telefono,
        email:     proveedorEditando.email,
        direccion: proveedorEditando.direccion,
        categoria: proveedorEditando.categoria,
        notas:     proveedorEditando.notas,
      });
    } else {
      setCampos(CAMPOS_INICIALES);
    }
    setErrores({});
    setTocados({});
  }, [proveedorEditando]);

  const cambiar = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    const nuevos = { ...campos, [name]: value } as ProveedorFormData;
    setCampos(nuevos);
    if (tocados[name as keyof ProveedorFormData]) {
      setErrores(validar(nuevos));
    }
  };

  const tocar = (e: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const t = { ...tocados, [e.target.name]: true };
    setTocados(t);
    setErrores(validar(campos));
  };

  const manejarEnvio = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const todosTocados = (Object.keys(campos) as Array<keyof ProveedorFormData>)
      .reduce<Partial<Record<keyof ProveedorFormData, boolean>>>(
        (acc, k) => ({ ...acc, [k]: true }), {}
      );
    setTocados(todosTocados);
    const errs = validar(campos);
    setErrores(errs);
    if (Object.keys(errs).length > 0) return;
    onGuardar(campos);
  };

  const fieldClass = (nombre: keyof ProveedorFormData): string =>
    `w-full rounded-lg border px-3 py-2.5 text-sm bg-gray-800 text-gray-100 placeholder-gray-500 outline-none transition focus:ring-2 ${
      errores[nombre] && tocados[nombre]
        ? 'border-red-500 focus:ring-red-500/30'
        : 'border-gray-600 focus:border-indigo-500 focus:ring-indigo-500/30'
    }`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
              {proveedorEditando
                ? <Save size={17} className="text-white" />
                : <UserPlus size={17} className="text-white" />}
            </div>
            <h2 className="font-display font-bold text-lg text-white">
              {proveedorEditando ? 'Editar Proveedor' : 'Nuevo Proveedor'}
            </h2>
          </div>
          <button onClick={onCancelar}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white transition">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={manejarEnvio} noValidate>
          <div className="px-6 py-5 grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">

            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Nombre de la empresa *</label>
              <input name="nombre" value={campos.nombre} onChange={cambiar} onBlur={tocar}
                placeholder="Ej. Distribuidora El Norte S.A." className={fieldClass('nombre')} />
              {errores.nombre && tocados.nombre && <p className="text-red-400 text-xs mt-1">{errores.nombre}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Persona de contacto *</label>
              <input name="contacto" value={campos.contacto} onChange={cambiar} onBlur={tocar}
                placeholder="Nombre completo" className={fieldClass('contacto')} />
              {errores.contacto && tocados.contacto && <p className="text-red-400 text-xs mt-1">{errores.contacto}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Categoría *</label>
              <select name="categoria" value={campos.categoria} onChange={cambiar} onBlur={tocar}
                className={fieldClass('categoria')}>
                <option value="">Seleccionar...</option>
                {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errores.categoria && tocados.categoria && <p className="text-red-400 text-xs mt-1">{errores.categoria}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Teléfono *</label>
              <input name="telefono" value={campos.telefono} onChange={cambiar} onBlur={tocar}
                placeholder="+504 0000-0000" className={fieldClass('telefono')} />
              {errores.telefono && tocados.telefono && <p className="text-red-400 text-xs mt-1">{errores.telefono}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Correo electrónico *</label>
              <input name="email" type="email" value={campos.email} onChange={cambiar} onBlur={tocar}
                placeholder="proveedor@email.com" className={fieldClass('email')} />
              {errores.email && tocados.email && <p className="text-red-400 text-xs mt-1">{errores.email}</p>}
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Dirección *</label>
              <input name="direccion" value={campos.direccion} onChange={cambiar} onBlur={tocar}
                placeholder="Col. Kennedy, Tegucigalpa" className={fieldClass('direccion')} />
              {errores.direccion && tocados.direccion && <p className="text-red-400 text-xs mt-1">{errores.direccion}</p>}
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Notas internas <span className="text-gray-600">(opcional)</span>
              </label>
              <textarea name="notas" value={campos.notas} onChange={cambiar} rows={2}
                placeholder="Condiciones de pago, días de entrega..."
                className={`${fieldClass('notas')} resize-none`} />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-700 flex gap-3 justify-end">
            <button type="button" onClick={onCancelar}
              className="px-4 py-2 text-sm rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition font-medium">
              Cancelar
            </button>
            <button type="submit"
              className="px-5 py-2 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition font-medium flex items-center gap-2">
              <Save size={15} />
              {proveedorEditando ? 'Guardar cambios' : 'Registrar proveedor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
