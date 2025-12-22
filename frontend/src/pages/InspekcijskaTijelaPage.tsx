
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

    // Search states
    const [searchNaziv, setSearchNaziv] = useState("");
    const [searchIme, setSearchIme] = useState("");
    const [searchPrezime, setSearchPrezime] = useState("");
    const [searchEmail, setSearchEmail] = useState("");
    const [searchTelefon, setSearchTelefon] = useState("");

    useEffect(() => {
        loadTijela();
    }, [filterInspektorat, filterNadleznost]);

    const loadTijela = async () => {
        setLoading(true);
        try {
            let response;

            // Search takes priority over filters
            if (searchNaziv) {
                response = await InspekcijskoTijeloService.searchByName(searchNaziv);
            } else if (searchIme && searchPrezime) {
                response = await InspekcijskoTijeloService.searchByContactPerson(searchIme, searchPrezime);
            } else if (searchEmail) {
                const res = await InspekcijskoTijeloService.searchByEmail(searchEmail);
                // Wrap single result in array or empty array if null (though 404 handled in catch likely)
                response = { data: res.data ? [res.data] : [] };
            } else if (searchTelefon) {
                const res = await InspekcijskoTijeloService.searchByPhone(searchTelefon);
                response = { data: res.data ? [res.data] : [] };
            } else if (filterInspektorat && filterNadleznost) {
                response = await InspekcijskoTijeloService.getByFilter(filterInspektorat, filterNadleznost);
            } else if (filterInspektorat) {
                response = await InspekcijskoTijeloService.getByInspektorat(filterInspektorat);
            } else if (filterNadleznost) {
                response = await InspekcijskoTijeloService.getByNadleznost(filterNadleznost);
            } else {
                response = await InspekcijskoTijeloService.getAll();
            }

            setTijela(response.data || []);
        } catch (error) {
            console.error("Error loading inspection bodies", error);
            // If 404 for single item searches, clear the list
            setTijela([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadTijela();
    };

    const handleReset = () => {
        setSearchNaziv("");
        setSearchIme("");
        setSearchPrezime("");
        setSearchEmail("");
        setSearchTelefon("");
        setFilterInspektorat("");
        setFilterNadleznost("");
        setLoading(true);
        InspekcijskoTijeloService.getAll().then(res => {
            setTijela(res.data);
            setLoading(false);
        });
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
            <div className="flex flex-col mb-8 gap-6">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                    <h1 className="text-3xl font-bold text-emerald-400 whitespace-nowrap">
                        Inspekcijska Tijela
                    </h1>
                    <button
                        onClick={openNewModal}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/50 whitespace-nowrap"
                    >
                        + Novo Tijelo
                    </button>
                </div>

                {/* Search & Filter Section */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-400 mb-1">Pretraga po nazivu</label>
                                <input
                                    type="text"
                                    value={searchNaziv}
                                    onChange={(e) => setSearchNaziv(e.target.value)}
                                    placeholder="Unesite naziv..."
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-emerald-500 text-sm"
                                />
                            </div>

                            <div className="w-full md:w-56">
                                <label className="block text-xs font-medium text-gray-400 mb-1">Inspektorat</label>
                                <select
                                    value={filterInspektorat}
                                    onChange={(e) => setFilterInspektorat(e.target.value as Inspektorat)}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-emerald-500 text-sm"
                                >
                                    <option value="">Svi Inspektorati</option>
                                    {Object.entries(Inspektorat).map(([key, val]) => (
                                        <option key={key} value={val}>
                                            {InspektoratDisplay[val as Inspektorat]}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-full md:w-56">
                                <label className="block text-xs font-medium text-gray-400 mb-1">Nadležnost</label>
                                <select
                                    value={filterNadleznost}
                                    onChange={(e) => setFilterNadleznost(e.target.value as Nadleznosti)}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-emerald-500 text-sm"
                                >
                                    <option value="">Sve Nadležnosti</option>
                                    {Object.entries(Nadleznosti).map(([key, val]) => (
                                        <option key={key} value={val}>
                                            {NadleznostiDisplay[val as Nadleznosti]}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="px-4 py-2 text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm border border-gray-600"
                                >
                                    Poništi
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors shadow-lg text-sm font-medium"
                                >
                                    Pretraži
                                </button>
                            </div>
                        </div>
                    </form>
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
