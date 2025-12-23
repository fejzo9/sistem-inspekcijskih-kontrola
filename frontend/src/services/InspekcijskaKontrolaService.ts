import axios from "axios";
import authHeader from "./auth-header";
import type { InspekcijskaKontrola } from "../types/inspekcijska-kontrola";

const API_URL = "http://localhost:8080/inspekcijske-kontrole";

const getAll = () => {
    return axios.get<InspekcijskaKontrola[]>(API_URL, { headers: authHeader() });
};

const getById = (id: number) => {
    return axios.get<InspekcijskaKontrola>(`${API_URL}/${id}`, { headers: authHeader() });
};

const create = (data: InspekcijskaKontrola) => {
    return axios.post<InspekcijskaKontrola>(API_URL, data, { headers: authHeader() });
};

const update = (id: number, data: InspekcijskaKontrola) => {
    return axios.put<InspekcijskaKontrola>(`${API_URL}/${id}`, data, { headers: authHeader() });
};

const remove = (id: number) => {
    return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
};

const getByPeriod = (startDatum: string, endDatum: string) => {
    return axios.get<InspekcijskaKontrola[]>(`${API_URL}/period`, {
        params: { startDatum, endDatum },
        headers: authHeader(),
    });
};

const getByTijelo = (tijeloId: number) => {
    return axios.get<InspekcijskaKontrola[]>(`${API_URL}/tijelo/${tijeloId}`, { headers: authHeader() });
};

const getByProizvod = (proizvodId: number) => {
    return axios.get<InspekcijskaKontrola[]>(`${API_URL}/proizvod/${proizvodId}`, { headers: authHeader() });
};

const getBySigurnost = (siguran: boolean) => {
    return axios.get<InspekcijskaKontrola[]>(`${API_URL}/sigurnost/${siguran}`, { headers: authHeader() });
};

const getByTijeloAndSigurnost = (tijeloId: number, siguran: boolean) => {
    return axios.get<InspekcijskaKontrola[]>(`${API_URL}/tijelo/${tijeloId}/sigurnost/${siguran}`, { headers: authHeader() });
};

const InspekcijskaKontrolaService = {
    getAll,
    getById,
    create,
    update,
    remove,
    getByPeriod,
    getByTijelo,
    getByProizvod,
    getBySigurnost,
    getByTijeloAndSigurnost,
};

export default InspekcijskaKontrolaService;
