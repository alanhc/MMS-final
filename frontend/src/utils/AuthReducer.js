import storage from "./storage"

const authStatusReducer = (state, {type, payload}) => {
    console.log("Dispatcher state: ", type);
    let walletAddress = payload?.walletAddress ?? "";
    let token = payload?.token;

    switch (type) {
        case AuthDispatcherAction.AUTO_SYNC:
            if (token) {
                storage.authToken = token;
                return state;
            }
            else {
                return state;
            }
        
        case AuthDispatcherAction.LOGIN:
            storage.authToken = token;
            storage.walletAddress = walletAddress;
            return {
                isLoggedIn: true,
                walletAddress
            };

        case AuthDispatcherAction.LOGOUT:
            storage.clearAccountData();
            return {
                isLoggedIn: false,
                walletAddress: ""
            }
        
        default:
            return state;
    }
};

const AuthDispatcherAction = {
    AUTO_SYNC: 0,
    LOGIN: 1,
    LOGOUT: 2
}

export { authStatusReducer, AuthDispatcherAction }