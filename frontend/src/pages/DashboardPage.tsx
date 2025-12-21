import React, { useState, useEffect } from "react";
import ProizvodService, { type Proizvod } from "../services/proizvod.service";
import ProizvodModal from "../components/ProizvodModal";

const DashboardPage: React.FC = () => {
    const [proizvodi, setProizvodi] = useState<Proizvod[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchProizvodjac, setSearchProizvodjac] = useState("");
    const [drzave, setDrzave] = useState<string[]>([]);
    const [selectedDrzava, setSelectedDrzava] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProizvod, setEditingProizvod] = useState<Proizvod | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProizvodi();
        loadDrzave();
    }, []);

    const loadProizvodi = async () => {
        setLoading(true);
        try {
            const response = await ProizvodService.getAll();
            setProizvodi(response.data);
        } catch (error) {
            console.error("Error loading products", error);
        } finally {
            setLoading(false);
        }
    };

    const loadDrzave = async () => {
        try {
            const response = await ProizvodService.getDrzave();
            setDrzave(response.data);
        } catch (error) {
            console.error("Error loading countries", error);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        // Reset controls
        setSearchProizvodjac("");
        setSelectedDrzava("");

        if (!searchQuery.trim()) {
            loadProizvodi();
            return;
        }
        try {
            setLoading(true);
            const response = await ProizvodService.findByNaziv(searchQuery);
            setProizvodi(response.data);
        } catch (error) {
            console.error("Error searching", error);
        } finally {
            setLoading(false);
        }
    };

    const handleProizvodjacSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        // Reset controls
        setSearchQuery("");
        setSelectedDrzava("");

        if (!searchProizvodjac.trim()) {
            loadProizvodi();
            return;
        }
        try {
            setLoading(true);
            const response = await ProizvodService.searchByProizvodjac(searchProizvodjac);
            setProizvodi(response.data);
        } catch (error) {
            console.error("Error searching manufacturer", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDrzavaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setSelectedDrzava(val);
        // Reset other controls
        setSearchQuery("");
        setSearchProizvodjac("");

        if (!val) {
            loadProizvodi();
            return;
        }

        try {
            setLoading(true);
            const response = await ProizvodService.findByDrzava(val);
            setProizvodi(response.data);
        } catch (error) {
            console.error("Error filtering by country", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Jeste li sigurni da želite obrisati ovaj proizvod?")) {
            try {
                await ProizvodService.remove(id);
                // Simple reload for now
                loadProizvodi();
            } catch (error) {
                alert("Greška prilikom brisanja.");
            }
        }
    };

    const openNewModal = () => {
        setEditingProizvod(null);
        setIsModalOpen(true);
    };

    const openEditModal = (p: Proizvod) => {
        setEditingProizvod(p);
        setIsModalOpen(true);
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-emerald-400 whitespace-nowrap">
                    Evidencija Proizvoda
                </h1>

                <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
                    {/* Search by Name */}
                    <form onSubmit={handleSearch} className="flex-1 md:w-64">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Pretraga po nazivu..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-4 pr-10 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                            />
                            <button type="submit" className="absolute right-2 top-2 text-gray-400 hover:text-white">
                                🔍
                            </button>
                        </div>
                    </form>

                    {/* Search by Manufacturer */}
                    <form onSubmit={handleProizvodjacSearch} className="flex-1 md:w-64">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Proizvođač..."
                                value={searchProizvodjac}
                                onChange={(e) => setSearchProizvodjac(e.target.value)}
                                className="w-full pl-4 pr-10 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                            />
                            <button type="submit" className="absolute right-2 top-2 text-gray-400 hover:text-white">
                                🔍
                            </button>
                        </div>
                    </form>

                    {/* Filter by Country */}
                    <div className="flex-1 md:w-48">
                        <select
                            value={selectedDrzava}
                            onChange={handleDrzavaChange}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                        >
                            <option value="">Sve države</option>
                            {drzave.map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={openNewModal}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/50 whitespace-nowrap"
                    >
                        + Dodaj Proizvod
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
                                <th className="px-6 py-4">Naziv Proizvoda</th>
                                <th className="px-6 py-4">Proizvođač</th>
                                <th className="px-6 py-4">Serijski Broj</th>
                                <th className="px-6 py-4">Država</th>
                                <th className="px-6 py-4 text-center">Akcije</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {proizvodi.length > 0 ? (
                                proizvodi.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-750 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">
                                            {product.nazivProizvoda}
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            {product.proizvodjac}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-emerald-400 text-sm">
                                            {product.serijskiBroj}
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            {product.drzavaPorijekla}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => openEditModal(product)}
                                                    className="text-blue-400 hover:text-blue-300"
                                                >
                                                    Uredi
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id!)}
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
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        Nema pronađenih proizvoda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <ProizvodModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={loadProizvodi}
                editingProizvod={editingProizvod}
            />
        </div>
    );
};

export default DashboardPage;
