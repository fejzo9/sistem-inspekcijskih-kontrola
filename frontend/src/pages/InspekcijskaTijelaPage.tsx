
import React, { useState, useEffect } from "react";
import InspekcijskoTijeloService from "../services/InspekcijskoTijeloService";
import { Inspektorat, Nadleznosti, InspektoratDisplay, NadleznostiDisplay } from "../types/InspekcijskoTijelo";
import type { InspekcijskoTijelo } from "../types/InspekcijskoTijelo";
import InspekcijskoTijeloModal from "../components/InspekcijskoTijeloModal";

const InspekcijskaTijelaPage: React.FC = () => {
    const [tijela, setTijela] = useState<InspekcijskoTijelo[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTijelo, setEditingTijelo] = useState<InspekcijskoTijelo | null>(null);

    // Filter states
    const [filterInspektorat, setFilterInspektorat] = useState<Inspektorat | "">("");
    const [filterNadleznost, setFilterNadleznost] = useState<Nadleznosti | "">("");

    useEffect(() => {
        loadTijela();
    }, [filterInspektorat, filterNadleznost]);

    const loadTijela = async () => {
        setLoading(true);
        try {
            let response;
            if (filterInspektorat && filterNadleznost) {
                response = await InspekcijskoTijeloService.getByFilter(filterInspektorat, filterNadleznost);
            } else if (filterInspektorat) {
                response = await InspekcijskoTijeloService.getByInspektorat(filterInspektorat);
            } else if (filterNadleznost) {
                response = await InspekcijskoTijeloService.getByNadleznost(filterNadleznost);
            } else {
                response = await InspekcijskoTijeloService.getAll();
            }
            setTijela(response.data);
        } catch (error) {
            console.error("Error loading inspection bodies", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Jeste li sigurni da želite obrisati ovo inspekcijsko tijelo?")) {
            try {
                await InspekcijskoTijeloService.remove(id);
                loadTijela();
            } catch (error) {
                alert("Greška prilikom brisanja.");
            }
        }
    };

    const openNewModal = () => {
        setEditingTijelo(null);
        setIsModalOpen(true);
    };

    const openEditModal = (tijelo: InspekcijskoTijelo) => {
        setEditingTijelo(tijelo);
        setIsModalOpen(true);
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-emerald-400 whitespace-nowrap">
                    Inspekcijska Tijela
                </h1>

                <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
                    {/* Filters */}
                    <select
                        value={filterInspektorat}
                        onChange={(e) => setFilterInspektorat(e.target.value as Inspektorat)}
                        className="flex-1 md:w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    >
                        <option value="">Svi Inspektorati</option>
                        {Object.entries(Inspektorat).map(([key, val]) => (
                            <option key={key} value={val}>
                                {InspektoratDisplay[val as Inspektorat]}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filterNadleznost}
                        onChange={(e) => setFilterNadleznost(e.target.value as Nadleznosti)}
                        className="flex-1 md:w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    >
                        <option value="">Sve Nadležnosti</option>
                        {Object.entries(Nadleznosti).map(([key, val]) => (
                            <option key={key} value={val}>
                                {NadleznostiDisplay[val as Nadleznosti]}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={openNewModal}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/50 whitespace-nowrap"
                    >
                        + Novo Tijelo
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center text-gray-400 mt-20">Učitavanje podataka...</div>
            ) : (
                <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                    <table className="min-w-full table-auto text-left">
                        <thead className="bg-gray-900 text-gray-400 uppercase text-sm font-medium">
                            <tr>
                                <th className="px-6 py-4">Naziv</th>
                                <th className="px-6 py-4">Inspektorat</th>
                                <th className="px-6 py-4">Nadležnost</th>
                                <th className="px-6 py-4">Kontakt Osoba</th>
                                <th className="px-6 py-4">Kontakt</th>
                                <th className="px-6 py-4 text-center">Akcije</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {tijela.length > 0 ? (
                                tijela.map((tijelo) => (
                                    <tr key={tijelo.id} className="hover:bg-gray-750 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">
                                            {tijelo.nazivInspekcijskogTijela}
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            {InspektoratDisplay[tijelo.inspektorat as Inspektorat] || tijelo.inspektorat}
                                        </td>
                                        <td className="px-6 py-4 text-emerald-400 text-sm">
                                            {NadleznostiDisplay[tijelo.nadleznosti as Nadleznosti] || tijelo.nadleznosti}
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            {tijelo.kontaktOsoba.ime} {tijelo.kontaktOsoba.prezime}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">
                                            <div>{tijelo.kontaktOsoba.email}</div>
                                            <div>{tijelo.kontaktOsoba.brojTelefona}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => openEditModal(tijelo)}
                                                    className="text-blue-400 hover:text-blue-300"
                                                >
                                                    Uredi
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(tijelo.id!)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    Obriši
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        Nema pronađenih inspekcijskih tijela.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <InspekcijskoTijeloModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={loadTijela}
                editingTijelo={editingTijelo}
            />
        </div>
    );
};

export default InspekcijskaTijelaPage;
