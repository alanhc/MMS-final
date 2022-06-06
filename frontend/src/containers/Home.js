import { useEffect, useReducer, useState } from 'react';
import jwt from "jsonwebtoken";
import HeaderBar from '../components/HeaderBar.js'
import Collection from '../components/Collection';
import { renewToken } from '../utils/axios';
import storage, { LS_AUTH_TOKEN } from '../utils/storage';
import { authStatusReducer, AuthDispatcherAction } from '../utils/AuthReducer';
import { AuthContext } from '../utils/context';

const Home = () => {
  // const location = useLocation();

  const initAuthState = () => {
    const authToken = storage.authToken;
    if (authToken && storage.walletAddress) {
      const { address } = jwt.decode(authToken) ?? {};
      if (address === storage.walletAddress) {
        return {
          isLoggedIn: true,
          walletAddress: address,
        }
      }
    }

    storage.clearAccountData();
    return {
      isLoggedIn: false,
      walletAddress: "",
    }
  }

  const [authState, authDispatcher] = useReducer(authStatusReducer, {}, initAuthState)

  const checkJwt = () => {
    renewToken()
      .then((token) => {
        if (jwt.decode(token)?.address !== storage.walletAddress) {
          throw new Error("Inconsistent address");
        }
        authDispatcher({
          type: AuthDispatcherAction.AUTO_SYNC,
          payload: {
            token
          }
        });
      })
      .catch((e) => {
        authDispatcher({ type: AuthDispatcherAction.LOGOUT });
        window.location.reload();
      });
  }

  useEffect(() => {
    if (storage.authToken && storage.walletAddress) {
      checkJwt();
    } else {
      authDispatcher({
        type: AuthDispatcherAction.LOGOUT,
      })
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    function checkLocalStorage(e) {
      switch (e.key) {
        case LS_AUTH_TOKEN:
          onJwtChanged(e.newValue);
          break;
        default:
          break;
      }
    }

    const onJwtChanged = (authToken) => {
      if (authToken && storage.walletAddress) {
        const { address } = jwt.decode(authToken);

        if (address === storage.walletAddress) {
          authDispatcher({
            type: AuthDispatcherAction.AUTO_SYNC,
            payload: {
              walletAddress: address,
              token: authToken,
            }
          });
          return;
        }
      }

      authDispatcher({
        type: AuthDispatcherAction.LOGOUT,
      });
    };

    window.addEventListener("storage", checkLocalStorage);

    return () => {
      window.removeEventListener("storage", checkLocalStorage);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ authState, authDispatcher }}>
      <HeaderBar />
      <Collection />
    </AuthContext.Provider>
  )
}

export default Home;
