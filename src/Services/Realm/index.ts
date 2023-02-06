import { createRealmContext } from "@realm/react";

import { PostMainFeed } from "./postsMainFeed";

export const RealmContext = createRealmContext({
    schema: [
        PostMainFeed
    ]
});