import React, { useContext } from "react";
import { View } from "react-native";
import { useClient } from "../../Container";
import { Markdown } from "../../Elements/Text";
import { SinglePostContext } from "../PostContext";
import Postbottom from "./Components/Postbottom";
import Postheader from "./Components/Postheader";
import VideoPlayer from "./Components/VideoPlayer";


function PostVideo() {

    const { info } = useContext(SinglePostContext)
    const { client } = useClient()
    
    return (
        <View>
            <Postheader info={info.from} created_at={info.created_at} />
            <View style={{ padding: 5 }}><Markdown content={info.content} /></View>
            <VideoPlayer uri={`${client.post.file(info.from.user_id, info.post_id, info.attachments[0]?.name)}`} />
            <Postbottom info={info} />
        </View>
    )
}

export default PostVideo;