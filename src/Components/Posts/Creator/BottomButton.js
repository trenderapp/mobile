import React from "react";
import { View, TouchableOpacity } from "react-native";

import SvgElement from "../../Elements/Svg";
import { full_width } from "../../../Style/style";
import { useTheme } from "../../Container";

function BottomButtonPostCreator({ addFiles, setCameraVisible }) {

    const { colors } = useTheme();

    const buttons = [
        {
            icon: "images",
            onPress: () => addFiles("photo"),
            text: "commons.images",
            middle: false
        },
        {
            icon: "camera",
            onPress: () => setCameraVisible(true),
            text: "commons.images",
            middle: true
        },
        {
            icon: "videos",
            onPress: () => addFiles("video"),
            text: "commons.videos",
            middle: false
        }
    ]
    return (
        <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            padding: 10,
            borderWidth: 2,
            borderColor: colors.bg_secondary
        }}>
            {
                buttons.map((b, idx) => (
                    b.middle ? (
                        <TouchableOpacity onPress={b.onPress} style={{
                            position: "absolute",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: colors.bg_secondary,
                            width: 60,
                            height: 60,
                            borderRadius: 60 / 2,
                            left: full_width / 2.4,
                            bottom: 22
                        }} key={idx}>
                            <SvgElement key={idx} onPress={b.onPress} name={b.icon} size={30} />
                        </TouchableOpacity> ) : <SvgElement key={idx} onPress={b.onPress} name={b.icon} size={25} />
                ))
            }
        </View>
    )
}

export default BottomButtonPostCreator;