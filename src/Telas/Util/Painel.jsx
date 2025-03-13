import React from "react";

export default function Painel({ isOpen, onClose }) {
  return (
    isOpen && (
      <div className="overlay">
        <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-lg p-6 transition-transform transform translate-x-0">
          <h2 className="text-lg font-bold">Nova Conta</h2>
          <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded">
            Fechar
          </button>
        </div>
      </div>
    )
  );
  
}
