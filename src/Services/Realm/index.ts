import { Realm, createRealmContext } from '@realm/react';
import { PostInterface, MeInterface, GlobalInterface } from "trender-client";

// https://github.com/realm/realm-js/tree/master/templates/react-native-template-realm-ts/template/app

export class postMainFeedSchema extends Realm.Object<PostInterface.postResponseSchema> {

    post_id!: string;
    content!: string;
    locale = "EN";
    type!: PostInterface.postTypes;
    attachments!: Array<GlobalInterface.attachments> | [];
    attached_post_id = "";
    embeds!: Array<GlobalInterface.embeds> | [];
    poll!: GlobalInterface.pollInterface;
    giveway = {};
    mentions!: Array<GlobalInterface.userInfo> | [];
    hashtags!: Array<string> | [];
    created_at!: Date;
    from!: GlobalInterface.userInfo;
    likes = 0;
    liked = 0;
    comments = 0;
    views!: number;

    constructor(realm: Realm, params: PostInterface.postResponseSchema) {
        super(realm, params);
    }
}

export class userStoreSchema extends Realm.Object<MeInterface.myInformations> {

    user_id!: string;
    nickname!: string;
    avatar!: string;
    token!: string;
    locale = "EN";

    constructor(realm: Realm, params: MeInterface.myInformations) {
        super(realm, params);
    }
}

export const realmContext = createRealmContext({
    schemaVersion: 6,
    path: "realmDatabase",
    schema: [
        postMainFeedSchema,
        userStoreSchema
    ]
})