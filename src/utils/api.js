import axios from "axios";
import store from "../app/store";

const axiosInstance = axios.create({
    baseURL : "http://localhost:3000",
    headers: {
        "Content-Type":"application/json",
    },
})

axiosInstance.interceptors.request.use((config)=>{
    const state = store.getState();
    const token = state.auth.token;
    // const token = localStorage.getItem("token")
    console.log("token- interceptors",token)
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},(error)=>Promise.reject(error))

export default axiosInstance;

