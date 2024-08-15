import Realm from "realm";
import { PostInterface, GlobalInterface } from "trender-client";

// Définition du schéma du post
export class postMainFeedSchema extends Realm.Object<PostInterface.postResponseSchema> {
  post_id!: string;
  content!: string;
  locale: string = "EN";
  type!: PostInterface.postTypes;
  attachments!: Array<GlobalInterface.attachments> | [];
  attached_post_id: string = "";
  embeds!: Array<GlobalInterface.embeds> | [];
  poll!: GlobalInterface.pollInterface;
  giveway: object = {};
  mentions!: Array<GlobalInterface.userInfo> | [];
  hashtags!: Array<string> | [];
  created_at!: Date;
  from!: GlobalInterface.userInfo;
  likes: number = 0;
  liked: number = 0;
  comments: number = 0;
  views!: number;

  static schema = {
    name: "PostMainFeed",
    primaryKey: "post_id",
    properties: {
      post_id: "string",
      content: "string",
      locale: "string",
      type: "string",
      attachments: "globalInterface.attachments[]",
      attached_post_id: "string",
      embeds: "globalInterface.embeds[]",
      poll: "globalInterface.pollInterface",
      giveway: "object",
      mentions: "globalInterface.userInfo[]",
      hashtags: "string[]",
      created_at: "date",
      from: "globalInterface.userInfo",
      likes: "int",
      liked: "int",
      comments: "int",
      views: "int",
    },
  };
}