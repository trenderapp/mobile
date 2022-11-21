import React from "react";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { useTheme } from "../../Container";

function NormalButton({ text, onPress, style }) {

    const { colors } = useTheme();

    return (
        <TouchableOpacity
        style={{
            alignItems: 'center',
            borderRadius: 5,
            marginLeft: 35,
            marginRight: 35,
            padding: 5,
            marginTop: 20,
            marginBottom: 25,
            backgroundColor: colors.bg_secondary, 
            color: colors.text_normal
        }}
        activeOpacity={0.5}
        onPress={() => onPress()}>
        <Text style={{ 
            paddingVertical: 10,
            fontSize: 16
        }}>{ text }</Text>
      </TouchableOpacity>
    )
}

export default NormalButton;