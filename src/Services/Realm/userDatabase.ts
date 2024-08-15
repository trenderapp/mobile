import Realm from "realm";
import { MeInterface } from "trender-client";

// Définition de la classe utilisateur
export class userStoreSchema extends Realm.Object<MeInterface.myInformationInterface> {
  user_id!: string;
  nickname!: string;
  username!: string;
  avatar!: string;
  session_id!: string;
  token!: string;
  nsfw_filter: boolean = false;
  locale: string = "EN";
  premium_type!: number;
  flags!: number;
  banner?: string;
  language_spoken: Array<string> = [];
  accent_color?: string;
  payout_enabled!: boolean;
  birthday?: Date;

  // Définir le nom et la clé primaire du schéma
  static primaryKey = "user_id";
}

// Créez un schéma Realm en utilisant la classe
const UserStoreRealmSchema: Realm.ObjectSchema = {
  name: "UserStore",
  primaryKey: userStoreSchema.primaryKey,
  properties: {
    user_id: "string",
    nickname: "string",
    username: "string",
    avatar: "string",
    session_id: "string",
    token: "string",
    nsfw_filter: "bool",
    locale: "string",
    premium_type: "int",
    flags: "int",
    banner: "string?",
    language_spoken: "string[]",
    accent_color: "string?",
    payout_enabled: "bool",
    birthday: "date",
  },
};

// Fonctions CRUD

// Ajouter un utilisateur
export const addUser = (realm: Realm, user: Partial<MeInterface.myInformationInterface>) => {
  realm.write(() => {
    realm.create<userStoreSchema>("UserStore", user, Realm.UpdateMode.Modified);
  });
};

// Modifier un utilisateur
export const updateUser = (realm: Realm, user_id: string, updatedData: Partial<MeInterface.myInformationInterface>) => {
  realm.write(() => {
    const user = realm.objectForPrimaryKey<userStoreSchema>("UserStore", user_id);
    if (user) {
      Object.keys(updatedData).forEach((key) => {
        (user as any)[key] = (updatedData as any)[key];
      });
    }
  });
};

// Supprimer un utilisateur
export const deleteUser = (realm: Realm, user_id: string) => {
  realm.write(() => {
    const user = realm.objectForPrimaryKey<userStoreSchema>("UserStore", user_id);
    if (user) {
      realm.delete(user);
    }
  });
};

// Récupérer tous les utilisateurs
export const getAllUsers = (realm: Realm) => {
  return realm.objects<userStoreSchema>("UserStore");
};

// Récupérer un utilisateur par ID
export const getUserById = (realm: Realm, user_id: string) => {
  return realm.objectForPrimaryKey<userStoreSchema>("UserStore", user_id);
};

export default UserStoreRealmSchema;