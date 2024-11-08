import axios from "axios";

const instance = axios.create({
    baseURL: "https://localhost:7059/api/",
});

instance.interceptors.request.use(request => {
    const token = localStorage.getItem("AccessToken");
    if (token) {
        request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
});

export default instance;