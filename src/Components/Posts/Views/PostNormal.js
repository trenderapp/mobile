import React, { useContext } from "react";
import { View } from "react-native";
import { Markdown } from "../../Elements/Text";
import { SinglePostContext } from "../PostContext";
import Postbottom from "./Components/Postbottom";
import Postheader from "./Components/Postheader";


function PostNormal() {
    
    const { info } = useContext(SinglePostContext)

    return (
        <View>
            <Postheader info={info.from} created_at={info.created_at} />
            <View style={{ padding: 5 }}>
                <Markdown content={info.content} />
            </View>
            <Postbottom info={info} />
        </View>
    )
}

export default PostNormal;