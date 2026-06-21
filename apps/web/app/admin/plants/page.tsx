import React from 'react';
import { mockPlants } from '@plantitas/core';
import Link from 'next/link';

export default function AdminPlantsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-leafGreen11">Gestionar Plantas</h1>
        <button className="bg-leafGreen9 text-white px-4 py-2 rounded-md hover:bg-leafGreen11 transition-colors">
          + Nueva Planta
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Científico</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockPlants.map((plant) => (
              <tr key={plant.slug}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{plant.labelES}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500 italic">{plant.scientificName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Publicado
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/admin/plants/${plant.slug}/edit`} className="text-leafGreen9 hover:text-leafGreen11 mr-4">Editar</Link>
                  <button className="text-red-600 hover:text-red-900">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
