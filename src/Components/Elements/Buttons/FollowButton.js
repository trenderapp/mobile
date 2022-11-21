import React from "react";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { useTheme } from "../../Container";

function FollowButton({ text, onPress, style }) {

    const { colors } = useTheme();

    return (
        <TouchableOpacity
        style={{
            borderRadius: 5,
            minWidth: 100,
            padding: 10,
            backgroundColor: colors.bg_secondary, 
            color: colors.text_normal,
            ...style
        }}
        activeOpacity={0.5}
        onPress={() => onPress()}>
        <Text style={{
            textAlign: "center"
        }}>{ text }</Text>
      </TouchableOpacity>
    )
}

export default FollowButton;