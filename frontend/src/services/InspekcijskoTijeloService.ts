import axios from "axios";
import authHeader from "./auth-header";
import { Inspektorat, Nadleznosti } from "../types/InspekcijskoTijelo";
import type { InspekcijskoTijelo } from "../types/InspekcijskoTijelo";

const API_URL = "http://localhost:8080/inspekcijska-tijela";

const getAll = () => {
    return axios.get<InspekcijskoTijelo[]>(API_URL, { headers: authHeader() });
};

const getById = (id: number) => {
    return axios.get<InspekcijskoTijelo>(`${API_URL}/${id}`, { headers: authHeader() });
};

const create = (data: InspekcijskoTijelo) => {
    return axios.post<InspekcijskoTijelo>(API_URL, data, { headers: authHeader() });
};

const update = (id: number, data: InspekcijskoTijelo) => {
    return axios.put<InspekcijskoTijelo>(`${API_URL}/${id}`, data, { headers: authHeader() });
};

const remove = (id: number) => {
    return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
};

const getByInspektorat = (inspektorat: Inspektorat) => {
    return axios.get<InspekcijskoTijelo[]>(`${API_URL}/inspektorat/${inspektorat}`, { headers: authHeader() });
};

const getByNadleznost = (nadleznost: Nadleznosti) => {
    return axios.get<InspekcijskoTijelo[]>(`${API_URL}/nadleznost/${nadleznost}`, { headers: authHeader() });
};

const getByFilter = (inspektorat: Inspektorat, nadleznost: Nadleznosti) => {
    return axios.get<InspekcijskoTijelo[]>(`${API_URL}/filter`, {
        params: { inspektorat, nadleznost },
        headers: authHeader()
    });
};

const InspekcijskoTijeloService = {
    getAll,
    getById,
    create,
    update,
    remove,
    getByInspektorat,
    getByNadleznost,
    getByFilter,
};

export default InspekcijskoTijeloService;
