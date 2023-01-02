import React, { useEffect, useReducer } from "react";
import { useConnectionCallback, useMessageCallback } from "./eventHandlers";
import { initialWebSocketState, reducer } from "./reducer";
import { useWebLocalsocket } from "./websocketUtils";
import WebSocketContext from "./webSocketContext";
import useClient from "../Client/useClient";
import { webSocketRoutes } from "trender-client";

const RealmProvider = ({ children }) => {
    const client = useClient()
    const [notification, dispatch] = useReducer(reducer, initialWebSocketState);

    const onOpen = useConnectionCallback();
    const onMessage = useMessageCallback(dispatch);
    const [connect, sendMessage] = useWebLocalsocket(onOpen,onMessage);

    useEffect(() => {
        if(client.state === "loged") {
            connect()
        }
    }, [client.state])

    useEffect(() => {
        if(notification.code === webSocketRoutes.CONNECT) return sendMessage({
            code: webSocketRoutes.CHECK_CONNECTION,
            token: client.token
        })
    }, [notification])

    return <WebSocketContext.Provider value={{notification, sendMessage, dispatch}}>{children}</WebSocketContext.Provider>
}

export default RealmProvider;