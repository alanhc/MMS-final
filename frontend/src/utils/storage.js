import cookie from "react-cookies";
/**
 * keys
 */
export const LS_AUTH_TOKEN = "atk";
export const CK_WALLET_ADDR = "addr";

const storage = {};

Object.defineProperty(storage, "authToken", {
  get: () => localStorage.getItem(LS_AUTH_TOKEN),
  set: (value) => {
    localStorage.setItem(LS_AUTH_TOKEN, value);
  },
});

Object.defineProperty(storage, "walletAddress", {
  get: () => cookie.load(CK_WALLET_ADDR),
  set: (value) => {
    cookie.save(CK_WALLET_ADDR, value, { path: "/" });
  },
});

storage.clearAccountData = () => {
  localStorage.removeItem(LS_AUTH_TOKEN);
  cookie.remove(CK_WALLET_ADDR);
};

export default storage;
