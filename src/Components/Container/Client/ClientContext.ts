import * as React from 'react';
import Client, { MeInterface } from 'trender-client';


export interface ClientContextI {
    client: Client,
    token: string,
    user: MeInterface.myInformationInterface,
    state: "loading" | "loged" | "logout",
    setValue: (params: { [x: string]: any }) => {} | any
}

const ClientContext = React.createContext<ClientContextI>({
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
        user_id: "00000000"
    },
    state: "loading",
    setValue: () => {}
});

ClientContext.displayName = 'ClientContext';

export default ClientContext;