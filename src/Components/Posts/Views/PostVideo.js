import React, { useContext } from "react";
import { View } from "react-native";
import { useClient } from "../../Container";
import { Markdown } from "../../Elements/Text";
import { SinglePostContext } from "../PostContext.js";
import Postbottom from "./Components/Postbottom";
import Postheader from "./Components/Postheader";
import VideoPlayer from "./Components/VideoPlayer";


function PostVideo() {

    const { info } = useContext(SinglePostContext)
    const { client, token } = useClient()
    
    return (
        <View>
            <Postheader info={info.from} created_at={info.created_at} />
            <View style={{ padding: 5 }}><Markdown token={token} content={info.content} /></View>
            <VideoPlayer attachments={info.attachments[0]} uri={`${client.post.file(info.from.user_id, info.post_id, info.attachments[0]?.name)}`} />
            <Postbottom info={info} />
        </View>
    )
}

export default PostVideo;