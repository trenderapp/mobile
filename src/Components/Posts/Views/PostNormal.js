import React, { useContext } from "react";
import { View } from "react-native";
import { Markdown } from "../../Elements/Text";
import { SinglePostContext } from "../PostContext";
import Postbottom from "./Components/Postbottom";
import Postheader from "./Components/Postheader";
import Carroussel from "./Components/Carroussel";
import VideoPlayer from "./Components/VideoPlayer";
import { useClient } from "../../Container";


function PostNormal() {
    
    const { info } = useContext(SinglePostContext);
    const { client } = useClient();
    
    return (
        <View>
            <Postheader info={info.from} created_at={info.created_at} />
                <View style={{ padding: 5 }}>
                    <Markdown content={info.content} />
                </View>
            {
                !info?.type || info.type === 0 ?
                    null : info.type === 1 ? 
                        <Carroussel pictures={info.attachments} />
                            : info.type === 2 ?
                                <VideoPlayer thumbnail={info.attachments[0]?.thumbnail ? client.post.file(info.from.user_id, info.post_id, info.attachments[0]?.thumbnail): undefined} uri={client.post.file(info.from.user_id, info.post_id, info.attachments[0]?.name)} /> : null
            }
            <Postbottom info={info} />
        </View>
    )
}

export default PostNormal;