import {Realm} from '@realm/react';
import * as Type from "trender-client/Managers/Interfaces/Post";

export class PostMainFeed extends Realm.Object<PostMainFeed> {

  params: Type.postResponseSchema | undefined;
  
  constructor(realm: Realm, params: Type.postResponseSchema) {
    super(realm, params);
  }
}