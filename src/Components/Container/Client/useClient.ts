import { useContext } from 'react';
import ClientContext from './ClientContext';

export default function useClient() {
  const client = useContext(ClientContext);

  return client;
}
