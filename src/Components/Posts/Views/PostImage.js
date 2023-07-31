import React, { useContext } from "react";
import { View } from "react-native";
import { Markdown } from "../../Elements/Text";
import { SinglePostContext } from "../PostContext.js";
import Postbottom from "./Components/Postbottom";
import Postheader from "./Components/Postheader";
import Carroussel from "./Components/Carroussel";
import { useClient } from "../../Container";

function PostImage() {
    
    const { info } = useContext(SinglePostContext);
    const { token } = useClient()

    return (
        <View>
            <Postheader info={info.from} created_at={info.created_at} />
            <View style={{ padding: 5 }}><Markdown token={token} content={info.content} /></View>
            <Carroussel pictures={info.attachments} />
            <Postbottom info={info} />
        </View>
    )
}

export default PostImage;