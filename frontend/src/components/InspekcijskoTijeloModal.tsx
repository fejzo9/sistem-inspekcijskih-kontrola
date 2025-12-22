import React, { useState, useEffect } from "react";
import InspekcijskoTijeloService from "../services/InspekcijskoTijeloService";
import { Inspektorat, Nadleznosti, InspektoratDisplay, NadleznostiDisplay } from "../types/InspekcijskoTijelo";
import type { InspekcijskoTijelo, Osoba } from "../types/InspekcijskoTijelo";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    editingTijelo: InspekcijskoTijelo | null;
}

const countryCodes = [
    { code: "+387", country: "Bosna i Hercegovina" },
    { code: "+385", country: "Hrvatska" },
    { code: "+381", country: "Srbija" },
    { code: "+382", country: "Crna Gora" },
];

const InspekcijskoTijeloModal: React.FC<Props> = ({ isOpen, onClose, onSave, editingTijelo }) => {
    const [naziv, setNaziv] = useState("");
    const [inspektorat, setInspektorat] = useState<Inspektorat | "">("");
    const [nadleznost, setNadleznost] = useState<Nadleznosti | "">("");

    // Kontakt Osoba
    const [ime, setIme] = useState("");
    const [prezime, setPrezime] = useState("");
    const [email, setEmail] = useState("");
    const [phonePrefix, setPhonePrefix] = useState("+387");
    const [phoneNumber, setPhoneNumber] = useState("");

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (editingTijelo) {
            setNaziv(editingTijelo.nazivInspekcijskogTijela);
            setInspektorat(editingTijelo.inspektorat as Inspektorat);
            setNadleznost(editingTijelo.nadleznosti as Nadleznosti);
            setIme(editingTijelo.kontaktOsoba.ime);
            setPrezime(editingTijelo.kontaktOsoba.prezime);
            setEmail(editingTijelo.kontaktOsoba.email);

            // Parse phone number
            const fullPhone = editingTijelo.kontaktOsoba.brojTelefona;
            const prefix = countryCodes.find(c => fullPhone.startsWith(c.code))?.code || "+387";
            setPhonePrefix(prefix);
            setPhoneNumber(fullPhone.replace(prefix, ""));
        } else {
            resetForm();
        }
    }, [editingTijelo, isOpen]);

    const resetForm = () => {
        setNaziv("");
        setInspektorat("");
        setNadleznost("");
        setIme("");
        setPrezime("");
        setEmail("");
        setPhonePrefix("+387");
        setPhoneNumber("");
        setErrors({});
    };

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!naziv.trim()) newErrors.naziv = "Naziv je obavezan.";
        if (!inspektorat) newErrors.inspektorat = "Inspektorat je obavezan.";
        if (!nadleznost) newErrors.nadleznost = "Nadležnost je obavezna.";
        if (!ime.trim()) newErrors.ime = "Ime je obavezno.";
        if (!prezime.trim()) newErrors.prezime = "Prezime je obavezno.";

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            newErrors.email = "Email je obavezan.";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Neispravan format emaila.";
        }

        // Phone validation
        if (!phoneNumber.trim()) {
            newErrors.phone = "Broj telefona je obavezan.";
        } else if (!/^\d+$/.test(phoneNumber)) {
            newErrors.phone = "Broj telefona mora sadržavati samo cifre.";
        } else if ((phonePrefix + phoneNumber).length < 9 || (phonePrefix + phoneNumber).length > 15) {
            newErrors.phone = "Neispravna dužina broja telefona.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const kontaktOsoba: Osoba = {
            ime,
            prezime,
            email,
            brojTelefona: phonePrefix + phoneNumber
        };

        const tijelo: InspekcijskoTijelo = {
            id: editingTijelo?.id,
            nazivInspekcijskogTijela: naziv,
            inspektorat: inspektorat as Inspektorat,
            nadleznosti: nadleznost as Nadleznosti,
            kontaktOsoba
        };

        try {
            if (editingTijelo?.id) {
                await InspekcijskoTijeloService.update(editingTijelo.id, tijelo);
            } else {
                await InspekcijskoTijeloService.create(tijelo);
            }
            onSave();
            onClose();
        } catch (error) {
            console.error("Error saving inspection body", error);
            alert("Došlo je do greške prilikom spremanja.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl overflow-y-auto max-h-[90vh]">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">
                        {editingTijelo ? "Uredi Inspekcijsko Tijelo" : "Dodaj Novo Inspekcijsko Tijelo"}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Osnovni Podaci */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-emerald-400 border-b border-gray-700 pb-2">Osnovni Podaci</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Naziv Tijela</label>
                                <input
                                    type="text"
                                    value={naziv}
                                    onChange={(e) => setNaziv(e.target.value)}
                                    className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-emerald-500 ${errors.naziv ? "border-red-500" : "border-gray-600"}`}
                                />
                                {errors.naziv && <p className="text-red-500 text-sm mt-1">{errors.naziv}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Inspektorat</label>
                                    <select
                                        value={inspektorat}
                                        onChange={(e) => setInspektorat(e.target.value as Inspektorat)}
                                        className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-emerald-500 ${errors.inspektorat ? "border-red-500" : "border-gray-600"}`}
                                    >
                                        <option value="">Odaberi...</option>
                                        {Object.entries(Inspektorat).map(([key, val]) => (
                                            <option key={key} value={val}>
                                                {InspektoratDisplay[val as Inspektorat]}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.inspektorat && <p className="text-red-500 text-sm mt-1">{errors.inspektorat}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Nadležnost</label>
                                    <select
                                        value={nadleznost}
                                        onChange={(e) => setNadleznost(e.target.value as Nadleznosti)}
                                        className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-emerald-500 ${errors.nadleznost ? "border-red-500" : "border-gray-600"}`}
                                    >
                                        <option value="">Odaberi...</option>
                                        {Object.entries(Nadleznosti).map(([key, val]) => (
                                            <option key={key} value={val}>
                                                {NadleznostiDisplay[val as Nadleznosti]}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.nadleznost && <p className="text-red-500 text-sm mt-1">{errors.nadleznost}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Kontakt Osoba */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-emerald-400 border-b border-gray-700 pb-2">Kontakt Osoba</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Ime</label>
                                    <input
                                        type="text"
                                        value={ime}
                                        onChange={(e) => setIme(e.target.value)}
                                        className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-emerald-500 ${errors.ime ? "border-red-500" : "border-gray-600"}`}
                                    />
                                    {errors.ime && <p className="text-red-500 text-sm mt-1">{errors.ime}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Prezime</label>
                                    <input
                                        type="text"
                                        value={prezime}
                                        onChange={(e) => setPrezime(e.target.value)}
                                        className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-emerald-500 ${errors.prezime ? "border-red-500" : "border-gray-600"}`}
                                    />
                                    {errors.prezime && <p className="text-red-500 text-sm mt-1">{errors.prezime}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-emerald-500 ${errors.email ? "border-red-500" : "border-gray-600"}`}
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Broj Telefona</label>
                                <div className="flex gap-2">
                                    <select
                                        value={phonePrefix}
                                        onChange={(e) => setPhonePrefix(e.target.value)}
                                        className="w-24 px-2 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                                    >
                                        {countryCodes.map(c => (
                                            <option key={c.code} value={c.code}>{c.code}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                        placeholder="61123456"
                                        className={`flex-1 px-4 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-emerald-500 ${errors.phone ? "border-red-500" : "border-gray-600"}`}
                                    />
                                </div>
                                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-700">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
                            >
                                Odustani
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors shadow-lg"
                            >
                                Spremite
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InspekcijskoTijeloModal;
