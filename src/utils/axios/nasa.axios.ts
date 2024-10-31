import axios from "axios";
import nasa from "../../consts/api/nasa.const";

const nasaAxios = axios.create({
    baseURL: nasa.host,
    headers: {
        "Content-Type": "application/json"
    }
})

export default nasaAxios