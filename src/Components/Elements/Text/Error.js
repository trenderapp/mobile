import React from "react";
import { Text } from "react-native";
import { useTheme } from "../../Container";

function TextError({ children, text, onPress }) {

    const { colors } = useTheme();

    return (
        <>
        {
            onPress ? <Text onPress={() => onPress ? onPress() : null}>
                        <Text style={{
                            textAlign: 'center',
                            fontSize: 14,
                            color: colors.warning_color
                        }}>{ text ?? children }</Text>
                    </Text> 
                        : <Text style={{
                                textAlign: 'center',
                                fontSize: 14,
                                color: colors.warning_color
                            }}>{ text ?? children }</Text>
        }
        </>
    )
}

export default TextError;