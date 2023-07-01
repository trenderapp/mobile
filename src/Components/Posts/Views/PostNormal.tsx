import React, { useContext } from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { PostInterface } from "trender-client";
import { Markdown } from "../../Elements/Text";
import { SinglePostContext } from "../PostContext.js";
import Postheader from "./Components/Postheader";
import Carroussel from "./Components/Carroussel";
import VideoPlayer from "./Components/VideoPlayer";
import { useClient } from "../../Container";

type PostNormalContext = {
    info: PostInterface.postResponseSchema & {
        is_comment?: boolean;
        is_share?: boolean;
        no_bottom?: boolean;
    }
}

function PostNormal() {
    
    const { info }: PostNormalContext = useContext(SinglePostContext);
    const { client } = useClient();

    return (
        <View>
            <Postheader info={info.from} created_at={info.created_at} />
                <View style={{ padding: 5 }}>
                    {
                        info.display_not_allowed ? <Button onPress={() => {}}>Subscribe to {info.from.username} to display</Button> : <Markdown content={info.content} />
                    }
                </View>
            {
                info?.type ?
                    info.type === 1 ? 
                        <Carroussel pictures={info.attachments} creator={undefined} changeList={undefined} />
                            : info.type === 2 ?
                                <VideoPlayer thumbnail={info.attachments[0]?.thumbnail ? client.post.file(info.from.user_id, info.post_id, info.attachments[0]?.thumbnail) : undefined} uri={client.post.file(info.from.user_id, info.post_id, info.attachments[0]?.name)} attachments={undefined} /> 
                                : null : null
            }
        </View>
    )
}

export default PostNormal;