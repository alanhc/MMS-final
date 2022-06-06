import { createContext, Context } from "react";

export const AuthContext = createContext({
    authState: {
        isLoggedIn: false,
        walletAddres: ""
    },
    authDispatcher: () => {},
});