import React from "react";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";

function LinkButtonText({ text, onPress }) {

    return (
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => onPress()}>
            <Text style={{
                paddingVertical: 10,
                fontSize: 16,
                textDecorationLine: "underline" 
                }}>{text}</Text>
        </TouchableOpacity>
    )
}

export default LinkButtonText;