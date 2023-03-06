import EncryptedStorage from 'react-native-encrypted-storage';
import { MMKV } from 'react-native-mmkv'

export const localeStorage = new MMKV()

export interface settingsStorageI {
    theme?: "darkblue" | "auto" | "white" | "dark",
    locale?: string
}

export interface userStorageI {
    user_id: string;
    session_id: string;
    nickname?: string;
    username?: string;
    avatar?: string;
    token?: string;
    fcm_token?: string;
    locale?: string;
    nsfw_filter?: boolean;
}

export interface storageI {
    user_info?: userStorageI,
    settings?: settingsStorageI 
}

type localeStorageKeysT = 'user_info' | 'settings';

export const initStorage = async () => {
    let to_return: storageI = {};
    const alreadyInit = localeStorage.getAllKeys().find((k: string) => k === "user_info");
    const user_info_storage: any = await EncryptedStorage.getItem("user_info");    

    if(alreadyInit) {
        const user_info_storage = localeStorage.getString("user_info");
        const settings_storage = localeStorage.getString("settings");

        if(user_info_storage) to_return.user_info = JSON.parse(user_info_storage);
        if(settings_storage) to_return.settings = JSON.parse(settings_storage);

    } else if(!alreadyInit && user_info_storage) {    
        const mobile_storage: any = await EncryptedStorage.getItem("mobile_storage");
    
        if(user_info_storage) {
            to_return.user_info = JSON.parse(user_info_storage);
            localeStorage.set('user_info', user_info_storage);
        }
        if(mobile_storage) {
            to_return.settings = JSON.parse(mobile_storage);
            localeStorage.set('settings', mobile_storage);
        }
        await EncryptedStorage.clear();
    }

    return to_return;
}

const getAllStorage = () => {
    let to_return: storageI = {};

    const user_info_storage = localeStorage.getString("user_info");
    const settings_storage = localeStorage.getString("settings");

    if(user_info_storage) to_return.user_info = JSON.parse(user_info_storage);
    if(settings_storage) to_return.settings = JSON.parse(settings_storage);

    return to_return;
}

export const clearStorage = (key: localeStorageKeysT | 'all') => {
    if(key === "all") return localeStorage.clearAll();
    return localeStorage.delete(key)
}

export const getStorageInfo = (key: localeStorageKeysT | 'all'): userStorageI | settingsStorageI | storageI | undefined => {
    if(key === "all") return getAllStorage();
    const storage = localeStorage.getString(key);
    if(!storage) return undefined;
    return JSON.parse(storage)
}

export const setStorage = (key: localeStorageKeysT, value: string) => {
    return localeStorage.set(key, value)
}