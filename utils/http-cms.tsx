import axios from "axios";

export default axios.create({
    baseURL: "https://v.so.fa.dog",
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        withCredentials: true,
    }
});