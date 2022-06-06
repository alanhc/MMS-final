import axios from "axios"
import { SERVER_URL } from "./config"
import storage from "./storage"

const instance = axios.create({ baseURL: SERVER_URL});

instance.interceptors.request.use((config) => {
    const token = storage.authToken;
    config.headers["Authorization"] = token ? `Bearer ${token}` : "";
  
    return config;
});

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
    const param = new SimpleFormData({
        address: _address,
        signature: _signature,
    });

    return await instance.post('/login', param).then((res) => {
        return res.data.access_token;
    });
}

export const renewToken = async () => {
    return await instance.get('/renew_token').then((res) => {
        return res.data.access_token;
    });
}

export const getCollectionByAddress = async (address) => {
    return await instance.get(`/collections/${address}`).then((res) => {
        return res.data.result;
    });
}

export const activateTicket = async(contract, tokenId) => {
    return await instance.get(`/activate_ticket/${contract}/${tokenId}`, {responseType: 'blob'}).then((res) => {
        return res.data; 
    });
}

export const getQRcode = async(contract, tokenId, imgData) => {
    const param = new SimpleFormData({
        file: imgData
    });

    return await instance.post(`/qrcode/${contract}/${tokenId}`, param, {responseType: 'blob'}).then((res) => {
        return res.data;
    });
}

export const verifyQRcode = async(contract, tokenId, _file) => {
    const param = new SimpleFormData({
        file: _file
    });

    return await instance.post(`/verify/${contract}/${tokenId}`, param).then((res) => {
        return res.data;
    });
}