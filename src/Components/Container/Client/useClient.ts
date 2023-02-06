import * as React from 'react';
import ClientContext from './ClientContext';

export default function useClient() {
  const client = React.useContext(ClientContext);

  return client;
}
