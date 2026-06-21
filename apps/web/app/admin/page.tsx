import React from 'react';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-leafGreen11 mb-8">Panel de Administración</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/plants" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold mb-2">Gestionar Plantas</h2>
          <p className="text-gray-600">Crear, editar y eliminar especímenes del catálogo.</p>
        </Link>

        <Link href="/admin/taxonomy" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold mb-2">Taxonomía</h2>
          <p className="text-gray-600">Administrar categorías, hábitats y usos.</p>
        </Link>

        <Link href="/admin/media" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold mb-2">Multimedia</h2>
          <p className="text-gray-600">Biblioteca de imágenes y archivos CDN.</p>
        </Link>
      </div>
    </main>
  );
}
