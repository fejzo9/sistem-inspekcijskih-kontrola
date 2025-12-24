import React, { useState, useEffect } from "react";
import InspekcijskaKontrolaService from "../services/InspekcijskaKontrolaService";
import InspekcijskoTijeloService from "../services/InspekcijskoTijeloService";
import ProizvodService from "../services/proizvod.service";
import type { InspekcijskaKontrola } from "../types/inspekcijska-kontrola";
import type { InspekcijskoTijelo } from "../types/InspekcijskoTijelo";
import type { Proizvod } from "../types/proizvod";

const InspekcijskeKontrolePage: React.FC = () => {
    const [kontrole, setKontrole] = useState<InspekcijskaKontrola[]>([]);
    const [tijela, setTijela] = useState<InspekcijskoTijelo[]>([]);
    const [proizvodi, setProizvodi] = useState<Proizvod[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [filterStartDatum, setFilterStartDatum] = useState("");
    const [filterEndDatum, setFilterEndDatum] = useState("");
    const [filterTijeloId, setFilterTijeloId] = useState<number | "">("");
    const [filterSigurnost, setFilterSigurnost] = useState<"all" | "safe" | "unsafe">("all");

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [currentKontrola, setCurrentKontrola] = useState<Partial<InspekcijskaKontrola>>({
        datumInspekcijskeKontrole: "",
        rezultatiKontrole: "",
        proizvodSiguran: true,
    });
    const [selectedKontrola, setSelectedKontrola] = useState<InspekcijskaKontrola | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        loadInitialData();
        loadOptions();
    }, []);




    const loadInitialData = async () => {
        setLoading(true);
        try {
            // Load all data sorted by date (newest first) using the filter endpoint with no params
            const response = await InspekcijskaKontrolaService.filter({});
            setKontrole(response.data);
        } catch (err) {
            console.error("Error loading inspections", err);
        } finally {
            setLoading(false);
        }
    };

    const loadOptions = async () => {
        try {
            const [tijelaRes, proizvodiRes] = await Promise.all([
                InspekcijskoTijeloService.getAll(),
                ProizvodService.getAll(),
            ]);
            setTijela(tijelaRes.data);
            setProizvodi(proizvodiRes.data);
        } catch (err) {
            console.error("Error loading options", err);
        }
    };

    const handleFilter = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Build filter params - all filters work together now
            const params: {
                tijeloId?: number;
                startDatum?: string;
                endDatum?: string;
                siguran?: boolean;
            } = {};

            if (filterTijeloId) {
                params.tijeloId = Number(filterTijeloId);
            }
            if (filterStartDatum) {
                params.startDatum = filterStartDatum;
            }
            if (filterEndDatum) {
                params.endDatum = filterEndDatum;
            }
            if (filterSigurnost !== "all") {
                params.siguran = filterSigurnost === "safe";
            }

            const response = await InspekcijskaKontrolaService.filter(params);
            setKontrole(response.data);
        } catch (err) {
            console.error("Error filtering", err);
        } finally {
            setLoading(false);
        }
    };

    const handleResetFilter = () => {
        setFilterStartDatum("");
        setFilterEndDatum("");
        setFilterTijeloId("");
        setFilterSigurnost("all");
        loadInitialData();
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Jeste li sigurni da želite obrisati ovu kontrolu?")) {
            try {
                await InspekcijskaKontrolaService.remove(id);
                loadInitialData();
            } catch (err) {
                console.error("Error deleting", err);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate date not in future
        if (new Date(currentKontrola.datumInspekcijskeKontrole!) > new Date()) {
            setError("Datum ne može biti u budućnosti!");
            return;
        }

        try {
            const payload = {
                ...currentKontrola,
                nadleznoInspekcijskoTijelo: { id: Number(currentKontrola.nadleznoInspekcijskoTijelo?.id) } as any,
                kontrolisaniProizvod: { id: Number(currentKontrola.kontrolisaniProizvod?.id) } as any,
            } as InspekcijskaKontrola;

            if (currentKontrola.id) {
                await InspekcijskaKontrolaService.update(currentKontrola.id, payload);
            } else {
                await InspekcijskaKontrolaService.create(payload);
            }
            setShowModal(false);
            loadInitialData();
        } catch (err) {
            console.error("Error saving", err);
            setError("Došlo je do greške prilikom spašavanja.");
        }
    };

    const openEditModal = (kontrola: InspekcijskaKontrola) => {
        setCurrentKontrola({
            id: kontrola.id,
            datumInspekcijskeKontrole: kontrola.datumInspekcijskeKontrole,
            rezultatiKontrole: kontrola.rezultatiKontrole,
            proizvodSiguran: kontrola.proizvodSiguran,
            nadleznoInspekcijskoTijelo: { id: kontrola.nadleznoInspekcijskoTijelo.id } as any,
            kontrolisaniProizvod: { id: kontrola.kontrolisaniProizvod.id } as any,
        });
        setShowModal(true);
    };

    const openNewModal = () => {
        setCurrentKontrola({
            datumInspekcijskeKontrole: new Date().toISOString().split('T')[0],
            rezultatiKontrole: "",
            proizvodSiguran: true,
            // @ts-ignore
            nadleznoInspekcijskoTijelo: { id: "" },
            // @ts-ignore
            kontrolisaniProizvod: { id: "" },
        });
        setShowModal(true);
    };

    const openDetailsModal = (kontrola: InspekcijskaKontrola) => {
        setSelectedKontrola(kontrola);
        setShowDetailsModal(true);
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col mb-8 gap-6">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                    <h1 className="text-3xl font-bold text-emerald-400 whitespace-nowrap">
                        Inspekcijske Kontrole
                    </h1>
                    <button
                        onClick={openNewModal}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/50 whitespace-nowrap flex items-center"
                    >
                        <span className="mr-2">+</span> Nova Kontrola
                    </button>
                </div>

                {/* Filter Section */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
                    <form onSubmit={handleFilter} className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-400 mb-1">Od Datuma</label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-emerald-500 text-sm"
                                    value={filterStartDatum}
                                    onChange={(e) => setFilterStartDatum(e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-400 mb-1">Do Datuma</label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-emerald-500 text-sm"
                                    value={filterEndDatum}
                                    onChange={(e) => setFilterEndDatum(e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-400 mb-1">Inspekcijsko Tijelo</label>
                                <select
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-emerald-500 text-sm"
                                    value={filterTijeloId}
                                    onChange={(e) => setFilterTijeloId(Number(e.target.value))}
                                >
                                    <option value="">Sva tijela</option>
                                    {tijela.map((t) => (
                                        <option key={t.id} value={t.id}>{t.nazivInspekcijskogTijela}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-400 mb-1">Sigurnost Proizvoda</label>
                                <select
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-emerald-500 text-sm"
                                    value={filterSigurnost}
                                    onChange={(e) => setFilterSigurnost(e.target.value as any)}
                                >
                                    <option value="all">Svi proizvodi</option>
                                    <option value="safe">Sigurni proizvodi</option>
                                    <option value="unsafe">Nesigurni proizvodi</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleResetFilter}
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

            {/* List View - Table */}
            {loading ? (
                <div className="text-center text-gray-400 mt-20">Učitavanje podataka...</div>
            ) : (
                <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                    <table className="min-w-full table-auto text-left">
                        <thead className="bg-gray-900 text-gray-400 uppercase text-sm font-medium">
                            <tr>
                                <th className="px-6 py-4">Datum</th>
                                <th className="px-6 py-4">Proizvod</th>
                                <th className="px-6 py-4">Inspekcijsko Tijelo</th>
                                <th className="px-6 py-4">Sigurnost</th>
                                <th className="px-6 py-4">Rezultat</th>
                                <th className="px-6 py-4 text-center">Akcije</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {kontrole.length > 0 ? (
                                kontrole.map((kontrola: InspekcijskaKontrola) => (
                                    <tr key={kontrola.id} className="hover:bg-gray-750 transition-colors">
                                        <td className="px-6 py-4 text-white font-medium whitespace-nowrap">
                                            {kontrola.datumInspekcijskeKontrole}
                                        </td>
                                        <td className="px-6 py-4 text-emerald-400 font-medium">
                                            {kontrola.kontrolisaniProizvod?.nazivProizvoda}
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            {kontrola.nadleznoInspekcijskoTijelo?.nazivInspekcijskogTijela}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${kontrola.proizvodSiguran ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'}`}>
                                                {kontrola.proizvodSiguran ? 'SIGURAN' : 'NESIGURAN'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm max-w-xs truncate" title={kontrola.rezultatiKontrole}>
                                            {kontrola.rezultatiKontrole}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => openDetailsModal(kontrola)}
                                                    className="text-gray-400 hover:text-white transition-colors"
                                                    title="Detalji"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 5 8.268 7.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(kontrola)}
                                                    className="text-blue-400 hover:text-blue-300"
                                                >
                                                    Uredi
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(kontrola.id!)}
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
                                        Nema pronađenih inspekcijskih kontrola.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailsModal && selectedKontrola && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
                            <h2 className="text-2xl font-bold text-emerald-400">Detalji Kontrole</h2>
                            <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Datum Kontrole</label>
                                    <p className="text-lg font-medium text-white">{selectedKontrola.datumInspekcijskeKontrole}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sigurnost</label>
                                    <div className="mt-1">
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${selectedKontrola.proizvodSiguran ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'}`}>
                                            {selectedKontrola.proizvodSiguran ? 'SIGURAN' : 'NESIGURAN'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                                <h3 className="font-semibold text-gray-300 mb-3 border-b border-gray-600 pb-2">Kontrolisani Proizvod</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-500">Naziv</label>
                                        <p className="font-medium text-white">{selectedKontrola.kontrolisaniProizvod?.nazivProizvoda}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Serijski Broj</label>
                                        <p className="font-medium text-white">{selectedKontrola.kontrolisaniProizvod?.serijskiBroj}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Zemlja Porijekla</label>
                                        <p className="font-medium text-white">{selectedKontrola.kontrolisaniProizvod?.drzavaPorijekla}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Proizvođač</label>
                                        <p className="font-medium text-white">{selectedKontrola.kontrolisaniProizvod?.proizvodjac}</p>
                                    </div>
                                </div>
                                {selectedKontrola.kontrolisaniProizvod?.opis && (
                                    <div className="mt-4 pt-3 border-t border-gray-700">
                                        <label className="text-xs text-gray-500">Opis Proizvoda</label>
                                        <p className="text-sm text-gray-300 mt-1">{selectedKontrola.kontrolisaniProizvod.opis}</p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                                <h3 className="font-semibold text-gray-300 mb-3 border-b border-gray-600 pb-2">Nadležno Tijelo</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="text-xs text-gray-500">Naziv Tijela</label>
                                        <p className="font-medium text-white">{selectedKontrola.nadleznoInspekcijskoTijelo?.nazivInspekcijskogTijela}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Inspektorat</label>
                                        <p className="font-medium text-white">{selectedKontrola.nadleznoInspekcijskoTijelo?.inspektorat}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Nadležnost</label>
                                        <p className="font-medium text-white">{selectedKontrola.nadleznoInspekcijskoTijelo?.nadleznosti}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Rezultati Kontrole</label>
                                <p className="mt-2 text-gray-300 whitespace-pre-wrap bg-gray-900 border border-gray-700 p-4 rounded-lg text-sm">
                                    {selectedKontrola.rezultatiKontrole}
                                </p>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-700 flex justify-end bg-gray-900/50">
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors border border-gray-600"
                            >
                                Zatvori
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 max-w-md w-full">
                        <div className="p-6 border-b border-gray-700 bg-gray-900/50">
                            <h2 className="text-2xl font-bold text-emerald-400">
                                {currentKontrola.id ? "Uredi Kontrolu" : "Nova Kontrola"}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {error && (
                                <div className="bg-red-900/30 text-red-400 p-3 rounded-md text-sm border border-red-800">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Datum Kontrole</label>
                                <input
                                    type="date"
                                    required
                                    max={new Date().toISOString().split('T')[0]} // Prevent future dates via HTML5
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-emerald-500 text-sm"
                                    value={currentKontrola.datumInspekcijskeKontrole}
                                    onChange={(e) => setCurrentKontrola({ ...currentKontrola, datumInspekcijskeKontrole: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Inspekcijsko Tijelo</label>
                                <select
                                    required
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-emerald-500 text-sm"
                                    value={currentKontrola.nadleznoInspekcijskoTijelo?.id || ""}
                                    onChange={(e) => setCurrentKontrola({
                                        ...currentKontrola,
                                        nadleznoInspekcijskoTijelo: { id: Number(e.target.value) } as any
                                    })}
                                >
                                    <option value="">Odaberite tijelo</option>
                                    {tijela.map((t) => (
                                        <option key={t.id} value={t.id}>{t.nazivInspekcijskogTijela}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Kontrolisani Proizvod</label>
                                <select
                                    required
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-emerald-500 text-sm"
                                    value={currentKontrola.kontrolisaniProizvod?.id || ""}
                                    onChange={(e) => setCurrentKontrola({
                                        ...currentKontrola,
                                        kontrolisaniProizvod: { id: Number(e.target.value) } as any
                                    })}
                                >
                                    <option value="">Odaberite proizvod</option>
                                    {proizvodi.map((p) => (
                                        <option key={p.id} value={p.id}>{p.nazivProizvoda} ({p.serijskiBroj})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Rezultati Kontrole</label>
                                <textarea
                                    required
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-emerald-500 text-sm min-h-[100px]"
                                    value={currentKontrola.rezultatiKontrole}
                                    onChange={(e) => setCurrentKontrola({ ...currentKontrola, rezultatiKontrole: e.target.value })}
                                    placeholder="Unesite opis i rezultate kontrole..."
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="siguran"
                                    className="h-5 w-5 bg-gray-700 border-gray-600 rounded text-emerald-600 focus:ring-emerald-500 focus:ring-offset-gray-800"
                                    checked={currentKontrola.proizvodSiguran}
                                    onChange={(e) => setCurrentKontrola({ ...currentKontrola, proizvodSiguran: e.target.checked })}
                                />
                                <label htmlFor="siguran" className="ml-2 block text-sm font-medium text-gray-300">
                                    Proizvod je siguran za upotrebu
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-700 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600"
                                >
                                    Otkaži
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors shadow-lg"
                                >
                                    Sačuvaj
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InspekcijskeKontrolePage;
