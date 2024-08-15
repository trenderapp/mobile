import { createRealmContext } from '@realm/react';
import UserStoreRealmSchema from './userDatabase';

// Configuration du contexte Realm
export const realmContext = createRealmContext({
  schemaVersion: 1, // Increment this whenever you make a schema change
  path: "realmDatabase",
  schema: [
    UserStoreRealmSchema,
  ],
});