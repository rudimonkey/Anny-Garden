"use client";
import React from 'react';
import { usePlantStore } from '@plantitas/core';
import Link from 'next/link';

export default function AdminPlantsPage() {
  const { plants } = usePlantStore();

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-5xl font-black text-[#1b4332] tracking-tighter">Gestionar Plantas</h1>
        <button className="bg-[#2d6a4f] text-white px-8 py-4 rounded-2xl font-black hover:bg-[#1b4332] transition-all shadow-lg">
          + Nueva Planta
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-8 py-6 text-left text-[10px] font-black text-[#2d6a4f] uppercase tracking-[0.2em]">Nombre</th>
              <th className="px-8 py-6 text-left text-[10px] font-black text-[#2d6a4f] uppercase tracking-[0.2em]">Científico</th>
              <th className="px-8 py-6 text-left text-[10px] font-black text-[#2d6a4f] uppercase tracking-[0.2em]">Estado</th>
              <th className="px-8 py-6 text-right text-[10px] font-black text-[#2d6a4f] uppercase tracking-[0.2em]">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {plants.map((plant) => (
              <tr key={plant.slug} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-6 whitespace-nowrap font-black text-[#1b4332]">{plant.labelES}</td>
                <td className="px-8 py-6 whitespace-nowrap text-gray-400 italic font-medium">{plant.scientificName}</td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <span className="px-3 py-1 text-[9px] font-black tracking-widest uppercase rounded-full bg-[#f0f7ee] text-[#2d6a4f]">
                    Publicado
                  </span>
                </td>
                <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-black">
                  <Link href={`/admin/plants/${plant.slug}/edit`} className="text-[#2d6a4f] hover:text-[#1b4332] mr-6">EDITAR</Link>
                  <button className="text-[#c0392b] hover:text-red-900">ELIMINAR</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
