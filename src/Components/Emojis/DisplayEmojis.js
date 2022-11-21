import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { emojies_defs } from "../Elements/Text/Markdown/emojis";

function DisplayEmojis({ name, noName }) {

    return (
        <View style={{
            margin: 10
        }}>
            <Text>{noName ? "" : `:${name}: ` }{emojies_defs[name]}</Text>
        </View>
    )
}

export default DisplayEmojis;