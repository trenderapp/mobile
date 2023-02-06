import {Realm} from '@realm/react';
import { PostInterface } from "trender-client";

export class PostMainFeed extends Realm.Object<PostMainFeed> {

  params: PostInterface.postResponseSchema | undefined;
  
  constructor(realm: Realm, params: PostInterface.postResponseSchema) {
    super(realm, params);
  }
}