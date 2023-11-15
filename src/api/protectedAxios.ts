import axios from 'axios'
import { decrypt, encrypt } from '../utils/cryptography';
import { defaultUserState } from '@/context/UserProvider';

const ProtectedAxios = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });


// Before making request, do the following
ProtectedAxios.interceptors.request.use(
    (config) => {

        let UserData
        let accessToken
        let refreshToken

        //fetching the encrypted text
        const encryptedText = localStorage.getItem('UserData')

        //decrypt the text
        const decryptedText = decrypt(encryptedText)

        //check if data is valid, if, then save in state
        if (JSON.parse(decryptedText)?.accessToken) {
            UserData = JSON.parse(decryptedText);
            accessToken = UserData.accessToken
            refreshToken = UserData.refreshToken
            // console.log("refreshToken - ", UserData.refreshToken);
        }

        if (accessToken && refreshToken) {
            config.headers["authorization"] = 'Bearer ' + accessToken + ' ' + refreshToken;
        }

        console.log("request intercepted", accessToken);

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// With response data, do the following
ProtectedAxios.interceptors.response.use(
    (res) => {
        const newAccessToken = res.headers['x-new-access-token'];

        // If a new access token is found, update it in local storage
        if (newAccessToken) {
            // Update the new access token in local storage
            const encryptedText = localStorage.getItem('UserData');
            if (encryptedText) {
                const decryptedText = decrypt(encryptedText);
                const userData = JSON.parse(decryptedText);
                userData.accessToken = newAccessToken;
                localStorage.setItem('UserData', encrypt(JSON.stringify(userData)));
            }
        }

        return res;
    },
    async (err) => {
        let UserData
        let accessToken

        console.log(accessToken);


        //fetching the encrypted text
        const encryptedText = localStorage.getItem('UserData')

        //decrypt the text
        const decryptedText = decrypt(encryptedText)

        //check if data is valid, if, then save in state
        if (JSON.parse(decryptedText)?.accessToken) {
            UserData = JSON.parse(decryptedText);
            accessToken = UserData.accessToken
        }
        const originalConfig = err.config;

        if (err.response) {
            if (err.response.status === 498 && !originalConfig._retry && UserData.accessToken) {    // access token expired
                // handle infinite loop
                originalConfig._retry = true;

                try {
                    localStorage.setItem('UserData', encrypt(JSON.stringify(
                        defaultUserState.user
                    )));
                    let pathname = window.location.pathname
                    window.location.href = `/?sessionExpired=true&redirectTo=${pathname}`
                } catch (_error) {
                    return Promise.reject(_error);
                }
            }
        }

        return Promise.reject(err);
    }
);

export default ProtectedAxios;