import { Realm } from '@realm/react';
import { ISO_639_CODE_LIST } from 'trender-client/utils/ISO-369-1';

interface userInterface {
  user_id: string;
  nickname: string;
  avatar: string;
  token: string;
  locale: ISO_639_CODE_LIST;
}

export class userSchema extends Realm.Object<userSchema> {

  params: userInterface | undefined;
  
  constructor(realm: Realm, params: userInterface) {
    super(realm, params);
  }
}