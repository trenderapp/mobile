import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { emojies_defs } from "../Elements/Text/Markdown/emojis";

type sectionProps = {
    name: string;
    noName?: boolean;
}

function DisplayEmojis({ name, noName }: sectionProps) {

    return (
        <View style={{
            margin: 10
        }}>
            <Text>{noName ? "" : `:${name}: ` }{emojies_defs[name]}</Text>
        </View>
    )
}

export default DisplayEmojis;