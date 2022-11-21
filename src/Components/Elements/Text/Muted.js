import React from "react";
import { Text } from "react-native";
import { useTheme } from "../../Container";

function TextMuted({ text }) {

    const { colors } = useTheme();

    return (
        <Text style={{
            textAlign: 'center',
            fontSize: 12,
            color: colors.text_muted
        }}>{ text }</Text>
    )
}

export default TextMuted;