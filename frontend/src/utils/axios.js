import axios from "axios"
import { SERVER_URL } from "./config"

const instance = axios.create({ baseURL: SERVER_URL});

class SimpleFormData extends FormData {
    constructor(data) {
      super();
      for (let key in data) {
        this.append(key, data[key]);
      }
    }
};

export const getPayLoad = async (address) => {
    return await instance.get(`/login/${address}/payload`).then((res) => {
        return res.data.payload;
    });
}

export const login = async (_address, _signature) => {
    const config = {
        headers: {"Access-Control-Allow-Origin": "*"}
    };

    const param = {
        "address": _address,
        "signature": _signature
    };

    return await instance.post('/login', param, config).then((res) => {
        return res.data.access_token;
    });
}