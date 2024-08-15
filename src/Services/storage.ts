import { MMKV } from 'react-native-mmkv'
import { Ithemes } from '../Components/Container/Theme/Themes';

export const localeStorage = new MMKV()

export interface settingsStorageI {
    theme?: Ithemes;
    locale?: string;
    fcm_token?: string;
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

    if(alreadyInit) {
        const user_info_storage = localeStorage.getString("user_info");
        const settings_storage = localeStorage.getString("settings");

        if(user_info_storage) to_return.user_info = JSON.parse(user_info_storage);
        if(settings_storage) to_return.settings = JSON.parse(settings_storage);
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

export const setStorage = (key: localeStorageKeysT, value: object) => {
    return localeStorage.set(key, JSON.stringify(value))
}