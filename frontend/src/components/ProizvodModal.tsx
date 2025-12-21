import React, { useState, useEffect } from "react";
import ProizvodService, { type Proizvod } from "../services/proizvod.service";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    editingProizvod?: Proizvod | null;
}

const ProizvodModal: React.FC<Props> = ({ isOpen, onClose, onSave, editingProizvod }) => {
    const [proizvod, setProizvod] = useState<Proizvod>({
        nazivProizvoda: "",
        proizvodjac: "",
        drzavaPorijekla: "",
        opis: ""
    });
    const [drzave, setDrzave] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            loadDrzave();
            if (editingProizvod) {
                setProizvod(editingProizvod);
            } else {
                setProizvod({
                    nazivProizvoda: "",
                    proizvodjac: "",
                    drzavaPorijekla: "",
                    opis: ""
                });
            }
            setError(null);
        }
    }, [isOpen, editingProizvod]);

    const loadDrzave = async () => {
        try {
            const response = await ProizvodService.getDrzave();
            setDrzave(response.data);
        } catch (err) {
            console.error("Failed to load countries", err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProizvod(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (editingProizvod && editingProizvod.id) {
                await ProizvodService.update(editingProizvod.id, proizvod);
            } else {
                await ProizvodService.create(proizvod);
            }
            onSave();
            onClose();
        } catch (err: any) {
            const msg = err.response?.data?.error || "Došlo je do greške prilikom spremanja.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold text-emerald-400 mb-6">
                    {editingProizvod ? "Uredi Proizvod" : "Novi Proizvod"}
                </h2>

                {error && (
                    <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-100 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2">Naziv Proizvoda</label>
                        <input
                            type="text"
                            name="nazivProizvoda"
                            value={proizvod.nazivProizvoda}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-emerald-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2">Proizvođač</label>
                        <input
                            type="text"
                            name="proizvodjac"
                            value={proizvod.proizvodjac}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-emerald-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2">Država Porijekla</label>
                        <select
                            name="drzavaPorijekla"
                            value={proizvod.drzavaPorijekla}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-emerald-500"
                        >
                            <option value="">-- Odaberite državu --</option>
                            {drzave.map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2">Opis (Opcionalno)</label>
                        <textarea
                            name="opis"
                            value={proizvod.opis || ""}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-emerald-500 h-24"
                        />
                    </div>

                    {editingProizvod && (
                        <div className="mb-4">
                            <label className="block text-gray-300 text-sm font-bold mb-2">Serijski Broj (Generisan)</label>
                            <input
                                type="text"
                                value={editingProizvod.serijskiBroj || ""}
                                disabled
                                className="w-full px-3 py-2 bg-gray-800 text-gray-400 border border-gray-700 rounded cursor-not-allowed"
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                        >
                            Odustani
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-500 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Spremanje..." : "Spremi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProizvodModal;
