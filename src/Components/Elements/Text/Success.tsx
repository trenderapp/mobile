import React from "react";
import { Text } from "react-native";
import { useTheme } from "../../Container";

function TextSuccess({ text }: {
    text: string
}) {

    const { colors } = useTheme();

    return (
        <Text style={{
            textAlign: 'center',
            fontSize: 14,
            color: colors.good_color
        }}>{ text }</Text>
    )
}

export default TextSuccess;