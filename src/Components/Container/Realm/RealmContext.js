import * as React from 'react';
import { initialWebSocketState } from './reducer';

const RealmContext = React.createContext({
    notification: initialWebSocketState,
    dispatch: () => {},
    sendMessage: () => {}
});

RealmContext.displayName = 'RealmContext';

export default RealmContext;