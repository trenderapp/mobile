import * as React from 'react';
import Client, { MeInterface } from 'trender-client';

export interface ClientContextI {
    client: Client,
    token: string,
    user: MeInterface.myInformationInterface,
    state: "loading" | "loged" | "logout" | "switch_user",
    setValue: (params: any) => {} | any
}

export const clientContextPlaceholder: ClientContextI = {
    client: new Client({
        token: ""
    }),
    token: "",
    user: {
        avatar: "base1.png",
        locale: "US",
        session_id: "",
        username: "...",
        nickname: "...",
        premium_type: 0,
        flags: 0,
        token: "",
        user_id: "00000000",
        payout_enabled: false
    },
    state: "loading",
    setValue: () => {}
}

const ClientContext = React.createContext<ClientContextI>(clientContextPlaceholder);

ClientContext.displayName = 'ClientContext';

export default ClientContext;