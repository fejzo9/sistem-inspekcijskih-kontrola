import React, { useState, useEffect, useRef } from "react";
import InspekcijskaKontrolaService from "../services/InspekcijskaKontrolaService";
import InspekcijskoTijeloService from "../services/InspekcijskoTijeloService";
import type { InspekcijskaKontrola } from "../types/inspekcijska-kontrola";
import type { InspekcijskoTijelo } from "../types/InspekcijskoTijelo";

const IzvjestajPage: React.FC = () => {
    const [tijela, setTijela] = useState<InspekcijskoTijelo[]>([]);
    const [kontrole, setKontrole] = useState<InspekcijskaKontrola[]>([]);
    const [loading, setLoading] = useState(false);
    const [reportGenerated, setReportGenerated] = useState(false);

    // Filter params
    const [filterTijeloId, setFilterTijeloId] = useState<number | "">("");
    const [filterStartDatum, setFilterStartDatum] = useState("");
    const [filterEndDatum, setFilterEndDatum] = useState("");

    // Detail view
    const [selectedKontrola, setSelectedKontrola] = useState<InspekcijskaKontrola | null>(null);
    const [showDetailReport, setShowDetailReport] = useState(false);

    const reportRef = useRef<HTMLDivElement>(null);
    const detailReportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadTijela();
    }, []);

    const loadTijela = async () => {
        try {
            const response = await InspekcijskoTijeloService.getAll();
            setTijela(response.data);
        } catch (err) {
            console.error("Error loading tijela", err);
        }
    };

    const handleGenerateReport = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setReportGenerated(false);

        try {
            const params: {
                tijeloId?: number;
                startDatum?: string;
                endDatum?: string;
            } = {};

            if (filterTijeloId) params.tijeloId = Number(filterTijeloId);
            if (filterStartDatum) params.startDatum = filterStartDatum;
            if (filterEndDatum) params.endDatum = filterEndDatum;

            const response = await InspekcijskaKontrolaService.filter(params);
            setKontrole(response.data);
            setReportGenerated(true);
        } catch (err) {
            console.error("Error generating report", err);
        } finally {
            setLoading(false);
        }
    };

    const handlePrintReport = () => {
        window.print();
    };

    const openDetailReport = (kontrola: InspekcijskaKontrola) => {
        setSelectedKontrola(kontrola);
        setShowDetailReport(true);
    };

    const handlePrintDetail = () => {
        window.print();
    };

    const getSelectedTijeloName = () => {
        if (!filterTijeloId) return "Sva inspekcijska tijela";
        const tijelo = tijela.find(t => t.id === Number(filterTijeloId));
        return tijelo?.nazivInspekcijskogTijela || "N/A";
    };

    const getStatistics = () => {
        const total = kontrole.length;
        const safe = kontrole.filter(k => k.proizvodSiguran).length;
        const unsafe = total - safe;
        return { total, safe, unsafe };
    };

    const stats = getStatistics();

    // Detail Report View (Zahtjev 5)
    if (showDetailReport && selectedKontrola) {
        return (
            <div className="min-h-screen bg-gray-950">
                {/* Print-only header */}
                <style>{`
                    @media print {
                        .no-print { display: none !important; }
                        .print-only { display: block !important; }
                        body { background: white !important; }
                        .print-content { 
                            background: white !important; 
                            color: black !important;
                            padding: 20px !important;
                        }
                        .print-content * { color: black !important; border-color: #ccc !important; }
                    }
                    @media screen {
                        .print-only { display: none; }
                    }
                `}</style>

                {/* Screen Header - No Print */}
                <div className="no-print container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center mb-6">
                        <button
                            onClick={() => setShowDetailReport(false)}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        >
                            ← Nazad na izvještaj
                        </button>
                        <button
                            onClick={handlePrintDetail}
                            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Štampaj
                        </button>
                    </div>
                </div>

                {/* Printable Content */}
                <div ref={detailReportRef} className="print-content container mx-auto px-6 py-4 bg-gray-900">
                    <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                        {/* Report Header */}
                        <div className="text-center border-b border-gray-700 pb-6 mb-6">
                            <h1 className="text-3xl font-bold text-emerald-400 mb-2">
                                IZVJEŠTAJ O INSPEKCIJSKOJ KONTROLI
                            </h1>
                            <p className="text-gray-400">
                                Datum generiranja: {new Date().toLocaleDateString('bs-BA')} u {new Date().toLocaleTimeString('bs-BA')}
                            </p>
                        </div>

                        {/* Control Details */}
                        <div className="space-y-6">
                            {/* Datum kontrole */}
                            <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                                <h2 className="text-lg font-semibold text-emerald-400 mb-3 border-b border-gray-600 pb-2">
                                    Datum i vrijeme kontrole
                                </h2>
                                <p className="text-2xl font-bold text-white">
                                    {selectedKontrola.datumInspekcijskeKontrole}
                                </p>
                            </div>

                            {/* Proizvod Details */}
                            <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                                <h2 className="text-lg font-semibold text-emerald-400 mb-3 border-b border-gray-600 pb-2">
                                    Detalji kontrolisanog proizvoda
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase tracking-wider">Naziv proizvoda</label>
                                        <p className="text-lg font-medium text-white mt-1">
                                            {selectedKontrola.kontrolisaniProizvod?.nazivProizvoda}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase tracking-wider">Serijski broj</label>
                                        <p className="text-lg font-medium text-white mt-1">
                                            {selectedKontrola.kontrolisaniProizvod?.serijskiBroj}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase tracking-wider">Zemlja porijekla</label>
                                        <p className="text-lg font-medium text-white mt-1">
                                            {selectedKontrola.kontrolisaniProizvod?.drzavaPorijekla}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-gray-700">
                                    <label className="text-xs text-gray-500 uppercase tracking-wider">Proizvođač</label>
                                    <p className="text-md text-white mt-1">
                                        {selectedKontrola.kontrolisaniProizvod?.proizvodjac}
                                    </p>
                                </div>
                            </div>

                            {/* Nadlezno Tijelo */}
                            <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                                <h2 className="text-lg font-semibold text-emerald-400 mb-3 border-b border-gray-600 pb-2">
                                    Nadležno inspekcijsko tijelo
                                </h2>
                                <p className="text-lg font-medium text-white">
                                    {selectedKontrola.nadleznoInspekcijskoTijelo?.nazivInspekcijskogTijela}
                                </p>
                                <p className="text-sm text-gray-400 mt-1">
                                    Inspektorat: {selectedKontrola.nadleznoInspekcijskoTijelo?.inspektorat} |
                                    Nadležnost: {selectedKontrola.nadleznoInspekcijskoTijelo?.nadleznosti}
                                </p>
                            </div>

                            {/* Sigurnost */}
                            <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                                <h2 className="text-lg font-semibold text-emerald-400 mb-3 border-b border-gray-600 pb-2">
                                    Status sigurnosti proizvoda
                                </h2>
                                <span className={`inline-block px-4 py-2 rounded-full text-lg font-semibold ${selectedKontrola.proizvodSiguran
                                        ? 'bg-green-900/30 text-green-400 border border-green-800'
                                        : 'bg-red-900/30 text-red-400 border border-red-800'
                                    }`}>
                                    {selectedKontrola.proizvodSiguran ? '✓ PROIZVOD JE SIGURAN' : '✗ PROIZVOD NIJE SIGURAN'}
                                </span>
                            </div>

                            {/* Rezultati */}
                            <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                                <h2 className="text-lg font-semibold text-emerald-400 mb-3 border-b border-gray-600 pb-2">
                                    Rezultati kontrole
                                </h2>
                                <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg">
                                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                                        {selectedKontrola.rezultatiKontrole}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-500 text-sm">
                            <p>Ovaj izvještaj je automatski generiran iz sistema PING</p>
                            <p>ID kontrole: {selectedKontrola.id}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Main Report View (Zahtjev 4)
    return (
        <div className="min-h-screen bg-gray-950">
            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    body { background: white !important; }
                    .print-content { 
                        background: white !important; 
                        color: black !important;
                        padding: 20px !important;
                    }
                    .print-content * { color: black !important; border-color: #ccc !important; }
                    .print-content table { width: 100%; border-collapse: collapse; }
                    .print-content th, .print-content td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                    .print-content th { background: #f0f0f0 !important; }
                }
                @media screen {
                    .print-only { display: none; }
                }
            `}</style>

            <div className="container mx-auto px-6 py-8">
                {/* Page Header */}
                <h1 className="text-3xl font-bold text-emerald-400 mb-6 no-print">
                    Izvještaji Inspekcijskih Kontrola
                </h1>

                {/* Parametric Form (Zahtjev 4) */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg mb-6 no-print">
                    <h2 className="text-xl font-semibold text-white mb-4">Parametri izvještaja</h2>
                    <form onSubmit={handleGenerateReport}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    Inspekcijsko Tijelo
                                </label>
                                <select
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-emerald-500"
                                    value={filterTijeloId}
                                    onChange={(e) => setFilterTijeloId(e.target.value ? Number(e.target.value) : "")}
                                >
                                    <option value="">Sva tijela</option>
                                    {tijela.map((t) => (
                                        <option key={t.id} value={t.id}>{t.nazivInspekcijskogTijela}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    Od Datuma
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-emerald-500"
                                    value={filterStartDatum}
                                    onChange={(e) => setFilterStartDatum(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    Do Datuma
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-emerald-500"
                                    value={filterEndDatum}
                                    onChange={(e) => setFilterEndDatum(e.target.value)}
                                />
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors shadow-lg font-medium disabled:opacity-50"
                                >
                                    {loading ? "Generiranje..." : "Generiši Izvještaj"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Report Content */}
                {reportGenerated && (
                    <div ref={reportRef} className="print-content">
                        {/* Print Button */}
                        <div className="flex justify-end mb-4 no-print">
                            <button
                                onClick={handlePrintReport}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Štampaj Izvještaj
                            </button>
                        </div>

                        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                            {/* Report Header */}
                            <div className="p-6 border-b border-gray-700 bg-gray-900/50">
                                <h2 className="text-2xl font-bold text-emerald-400 text-center mb-2">
                                    IZVJEŠTAJ O INSPEKCIJSKIM KONTROLAMA
                                </h2>
                                <div className="text-center text-gray-400 space-y-1">
                                    <p><strong>Inspekcijsko tijelo:</strong> {getSelectedTijeloName()}</p>
                                    <p>
                                        <strong>Period:</strong> {filterStartDatum || "N/A"} - {filterEndDatum || "N/A"}
                                    </p>
                                    <p><strong>Datum generiranja:</strong> {new Date().toLocaleDateString('bs-BA')} u {new Date().toLocaleTimeString('bs-BA')}</p>
                                </div>
                            </div>

                            {/* Statistics */}
                            <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-700 bg-gray-850">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-white">{stats.total}</p>
                                    <p className="text-sm text-gray-400">Ukupno kontrola</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-green-400">{stats.safe}</p>
                                    <p className="text-sm text-gray-400">Sigurnih proizvoda</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-red-400">{stats.unsafe}</p>
                                    <p className="text-sm text-gray-400">Nesigurnih proizvoda</p>
                                </div>
                            </div>

                            {/* Data Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gray-900 text-gray-400 uppercase text-sm">
                                        <tr>
                                            <th className="px-6 py-3 text-left">R.br.</th>
                                            <th className="px-6 py-3 text-left">Datum</th>
                                            <th className="px-6 py-3 text-left">Proizvod</th>
                                            <th className="px-6 py-3 text-left">Serijski Broj</th>
                                            <th className="px-6 py-3 text-left">Inspekcijsko Tijelo</th>
                                            <th className="px-6 py-3 text-left">Sigurnost</th>
                                            <th className="px-6 py-3 text-left no-print">Akcija</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {kontrole.length > 0 ? (
                                            kontrole.map((kontrola, index) => (
                                                <tr key={kontrola.id} className="hover:bg-gray-750 transition-colors">
                                                    <td className="px-6 py-3 text-gray-400">{index + 1}</td>
                                                    <td className="px-6 py-3 text-white font-medium">
                                                        {kontrola.datumInspekcijskeKontrole}
                                                    </td>
                                                    <td className="px-6 py-3 text-emerald-400 font-medium">
                                                        {kontrola.kontrolisaniProizvod?.nazivProizvoda}
                                                    </td>
                                                    <td className="px-6 py-3 text-gray-300">
                                                        {kontrola.kontrolisaniProizvod?.serijskiBroj}
                                                    </td>
                                                    <td className="px-6 py-3 text-gray-300">
                                                        {kontrola.nadleznoInspekcijskoTijelo?.nazivInspekcijskogTijela}
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${kontrola.proizvodSiguran
                                                                ? 'bg-green-900/30 text-green-400'
                                                                : 'bg-red-900/30 text-red-400'
                                                            }`}>
                                                            {kontrola.proizvodSiguran ? 'SIGURAN' : 'NESIGURAN'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-3 no-print">
                                                        <button
                                                            onClick={() => openDetailReport(kontrola)}
                                                            className="text-blue-400 hover:text-blue-300 underline"
                                                        >
                                                            Detalji
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                                    Nema pronađenih kontrola za odabrane parametre.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-gray-700 bg-gray-900/50 text-center text-gray-500 text-sm">
                                <p>Izvještaj generiran automatski iz sistema PING</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Initial State */}
                {!reportGenerated && !loading && (
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-400 mb-2">Odaberite parametre izvještaja</h3>
                        <p className="text-gray-500">Odaberite inspekcijsko tijelo i/ili vremenski period, zatim kliknite "Generiši Izvještaj"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IzvjestajPage;
