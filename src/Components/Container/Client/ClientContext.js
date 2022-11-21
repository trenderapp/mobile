import * as React from 'react';
import Client from 'trender-client';

const ClientContext = React.createContext({
    client: new Client("nothing"),
    token: null,
    user: null,
    state: "loading",
    setValue: () => {}
});

ClientContext.displayName = 'ClientContext';

export default ClientContext;