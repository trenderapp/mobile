import { useContext } from "react";
import WebSocketContext from "./webSocketContext";

export default function useWebSocket() {
    const websocket = useContext(WebSocketContext);
    
    return websocket;
}