import axios from "axios";
import { baseUrl } from "./config";
const accessToken = localStorage.getItem("accessToken");

const newRequest = axios.create({
    baseURL: baseUrl,
    headers: {
        Authorization: `Bearer ${accessToken}`,
    },
});

export default newRequest;
