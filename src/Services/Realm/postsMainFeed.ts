// This TS version of the Task model shows how to create Realm objects using
// TypeScript syntax, using `@realm/babel-plugin`
// (https://github.com/realm/realm-js/blob/master/packages/babel-plugin/).
//
// If you are not using TypeScript and `@realm/babel-plugin`, you instead need
// to defining a schema on the class - see `Task.js` in the Realm example app
// for an example of this.

import {Realm} from '@realm/react';
import * as Type from "trender-client/Managers/Interfaces/Post";

// To use a class as a Realm object type in Typescript with the `@realm/babel-plugin` plugin,
// simply define the properties on the class with the correct type and the plugin will convert
// it to a Realm schema automatically.
export class PostMainFeed extends Realm.Object<PostMainFeed> {

  params: Type.postResponseSchema | undefined;
  
  constructor(realm: Realm, params: Type.postResponseSchema) {
    super(realm, params);
  }
}