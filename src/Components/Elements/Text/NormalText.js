import React from "react";
import { Text } from "react-native-paper";
import { useTheme } from "../../Container";

function NormalText({ text, style, children, maxLine, onPress }) {

    const { colors } = useTheme();

    return (
        <>
        {
            onPress ? <Text style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
            }} onPress={() => onPress ? onPress() : null}>
                    <Text numberOfLines={maxLine} style={{
                        color: colors.text_normal,
                        ...style
                    }}>
                        { text ?? children }
                    </Text>
                </Text> 
                : <Text numberOfLines={maxLine} style={{
                        color: colors.text_normal,
                        ...style
                    }}>
                        { text ?? children }
                    </Text>
        }
        </>
    )
}

export default NormalText;