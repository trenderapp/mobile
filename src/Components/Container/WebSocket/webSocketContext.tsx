import * as React from 'react';
import { initialWebSocketState } from './reducer';

const webSocketContext = React.createContext({
    notification: initialWebSocketState,
    dispatch: () => {},
    sendMessage: (_params: any) => {}
});

webSocketContext.displayName = 'webSocketContext';

export default webSocketContext;