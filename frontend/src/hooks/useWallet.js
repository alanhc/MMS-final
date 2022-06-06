import { TezosToolkit } from "@taquito/taquito"
import { BeaconWallet } from "@taquito/beacon-wallet"
import { SigningType } from "@airgap/beacon-sdk"
import { useState, useContext } from "react"
import { getPayLoad, login } from "../utils/axios"
import { AuthContext } from "../utils/context"
import { AuthDispatcherAction } from "../utils/AuthReducer"

const Tezos = new TezosToolkit("https://mainnet-tezos.giganode.io");
const wallet = new BeaconWallet({ 
    name: "Mutimedia-Security-Term-Project"
});

Tezos.setWalletProvider(wallet);

const useWallet = () => {
    const { authState, authDispatcher } = useContext(AuthContext);
    const [walletAddress, setWalletAdrress] = useState("");

    const connectWallet = async () => {
        try {
            // 1. Request permission
            const permissions = await wallet.client.requestPermissions();
            console.log("Got permissions: ", permissions.address);

            let address = permissions.address;
            setWalletAdrress(address);

            // 2. Get payload to sign in
            const payload = await getPayLoad(permissions.address);
            console.log("Got payload: ", payload);

            // 3. Sign payload
            const response = await wallet.client.requestSignPayload({
                signingType: SigningType.MICHELINE,
                payload: payload
            });
            console.log("Got signature: ", response.signature)

            let signature = response.signature;

            // 4. Log in
            await login(address, signature).then((authToken) => {
                console.log("Login Successful!");
                console.log(authToken);
                authDispatcher({
                    type: AuthDispatcherAction.LOGIN,
                    payload: {
                        walletAddress: address,
                        token: authToken
                    }
                });
            });

        } catch (error) {
            setWalletAdrress("");
            console.log("Got error: ", error);
        }
    }

    return { walletAddress, connectWallet };
};

export default useWallet;