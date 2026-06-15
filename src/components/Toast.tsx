import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { ToastItem, ToastType } from '../types';

let toastQueue: ToastItem[] = [];
let listeners: Array<(items: ToastItem[]) => void> = [];

export function toast(message: string, type: ToastType = 'success'): void {
  const id = Date.now() + Math.random();
  const item: ToastItem = { id, message, type };
  toastQueue = [...toastQueue, item];
  listeners.forEach(fn => fn([...toastQueue]));
  setTimeout(() => {
    toastQueue = toastQueue.filter(t => t.id !== id);
    listeners.forEach(fn => fn([...toastQueue]));
  }, 3500);
}

toast.success = (msg: string) => toast(msg, 'success');
toast.error   = (msg: string) => toast(msg, 'error');
toast.info    = (msg: string) => toast(msg, 'info');

export function Toaster(): JSX.Element {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    listeners.push(setToasts);
    return () => { listeners = listeners.filter(l => l !== setToasts); };
  }, []);

  const remove = useCallback((id: number) => {
    toastQueue = toastQueue.filter(t => t.id !== id);
    listeners.forEach(fn => fn([...toastQueue]));
  }, []);

  const icons: Record<ToastType, JSX.Element> = {
    success: <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />,
    error:   <XCircle    size={18} className="text-red-400 flex-shrink-0" />,
    info:    <AlertCircle size={18} className="text-blue-400 flex-shrink-0" />,
  };

  const bars: Record<ToastType, string> = {
    success: 'bg-emerald-400',
    error:   'bg-red-400',
    info:    'bg-blue-400',
  };

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 w-80">
      {toasts.map(t => (
        <div key={t.id} className="relative overflow-hidden bg-gray-900 text-white rounded-xl shadow-2xl flex items-start gap-3 p-4 border border-gray-700 animate-slide-in">
          {icons[t.type]}
          <span className="text-sm leading-snug flex-1">{t.message}</span>
          <button onClick={() => remove(t.id)} className="text-gray-500 hover:text-gray-300 transition flex-shrink-0">
            <X size={14} />
          </button>
          <div className={`absolute bottom-0 left-0 h-0.5 w-full ${bars[t.type]} animate-shrink`} />
        </div>
      ))}
      <style>{`
        @keyframes slide-in { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes shrink   { from { width:100%; } to { width:0%; } }
        .animate-slide-in { animation: slide-in 0.25s ease-out; }
        .animate-shrink   { animation: shrink 3.5s linear forwards; }
      `}</style>
    </div>
  );
}
