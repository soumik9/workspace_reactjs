import { getLocalStorageData, removeLocalStorageData, setLocalStorageData } from './common.helper';

export const setLocalStorage = setLocalStorageData;
export const getLocalStorage = getLocalStorageData;
export const removeLocalStorage = removeLocalStorageData;

export const isTokenValid = (token: string): boolean => {
    try {
        const payload = token.split('.')[1];
        if (!payload) return false;
        const { exp } = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
        return typeof exp === 'number' && exp * 1000 > Date.now();
    } catch {
        return false;
    }
};
