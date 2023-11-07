import { MessageType } from "../../Components/Chat";
import { ADD_GUILD_MESSAGES, INIT_GUILD_MESSAGES, RESET_GUILD_MESSAGES, ADD_SCROLL_GUILD_MESSAGES } from "./actionTypes";

export type IguildMessages = {
    [guild_id: string]: MessageType.Any[];
}

export type IguildMessagesv2 = {
    [guild_id: string]: {
        pagination_key: string;
        input: {
            text: string;
        };
        data: MessageType.Any[]
    };
}

export const guildMessagesReducer = (state: IguildMessages = {}, action: {
    type: string;
    info: any
}): IguildMessages => {
    const type = action.type;

    if (type === ADD_GUILD_MESSAGES) {
        const newMessages = { ...state }; // Crée une copie de l'état actuel

        // Vérifie si guild_id existe déjà, sinon crée une entrée vide pour ce guild_id
        action.info.forEach((message: any) => {
          const guildId = message.guild_id;
          if (!newMessages[guildId]) {
            newMessages[guildId] = [];
          }
          // Crée une nouvelle copie du tableau de messages pour guild_id et ajoute le nouveau message
          newMessages[guildId] = [message, ...newMessages[guildId]];
        });
    
        return newMessages; // Retourne la nouvelle copie de l'état
    } else if (type === ADD_SCROLL_GUILD_MESSAGES) {
        const newMessages = { ...state }; // Crée une copie de l'état actuel

        // Ajoute de nouveaux messages à ceux existants pour un guild_id spécifique
        action.info.forEach((message: any) => {
            const guildId = message.guild_id;
            if (!newMessages[guildId]) {
                newMessages[guildId] = [];
            }
            newMessages[guildId] = newMessages[guildId].concat(message);
        });

        return newMessages;
    } else if (type === INIT_GUILD_MESSAGES) {
        // Initialise les messages de la guilde avec les nouvelles données
        const newMessages = action.info.reduce((acc: IguildMessages, message: any) => {
            const guildId = message.guild_id;

            if (!acc[guildId]) {
                acc[guildId] = [];
            }

            acc[guildId].push(message);
            return acc;
        }, {});

        return newMessages;
    } else if (type === RESET_GUILD_MESSAGES) {
        return {}; // Réinitialise l'état des messages de la guilde à un objet vide
    }
    return state;
};
