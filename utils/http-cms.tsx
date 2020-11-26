import axios from "axios";

export default axios.create({
    baseURL: "https://v-int.so.fa.dog",
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        withCredentials: true,
    }
});