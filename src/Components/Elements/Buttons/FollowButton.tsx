import React from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import { Text } from "react-native-paper";
import { useTheme } from "../../Container";

type SectionProps = {
    text: string;
    onPress: () => any;
    style?: ViewStyle
}

function FollowButton({ text, onPress, style }: SectionProps) {

    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={{
                borderRadius: 5,
                minWidth: 100,
                padding: 10,
                backgroundColor: colors.bg_secondary,
                ...style
            }}
            activeOpacity={0.5}
            onPress={() => onPress()}>
            <Text style={{
                textAlign: "center"
            }}>{text}</Text>
        </TouchableOpacity>
    )
}

export default FollowButton;