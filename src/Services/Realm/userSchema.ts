import { Realm } from '@realm/react';
import { MeInterface } from 'trender-client';

export class userSchema extends Realm.Object<userSchema> {

  params: MeInterface.myInformationInterface | undefined;
  
  constructor(realm: Realm, params: MeInterface.myInformationInterface) {
    super(realm, params);
  }
}