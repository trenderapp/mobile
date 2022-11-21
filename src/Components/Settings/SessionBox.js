import React from "react";
import dayjs from 'dayjs';
import { useTranslation } from "react-i18next";
import { useTheme } from "../Container";
import { Text } from "react-native-paper";
import SvgElement from "../Elements/Svg";
import { View } from "react-native";

function SessionBox({ item, session_id, self, onPress }) {

    const { colors } = useTheme();
    const { i18n } = useTranslation();

    const deviceIcon = (name) => {

        if(name.match(/android/gi)) {
            return "android-icon"
        } else if(name.match(/apple/gi) || name.match(/ios/gi)) {
            return "apple-icon"
        } else if(name.match(/edge/gi)) {
            return "ms-edge"
        } else if(name.match(/chrome/gi)) {
            return "google-chrome"
        } else {
            return "fesses"
        }
    }
    
    return (
        <View style={{ flexDirection: "row", alignItems: "center", padding: 10, justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", borderColor: colors.text_normal, borderWidth: 1, padding: 5, borderRadius: 60 / 2 }}>
                <SvgElement noColor size={22} name={deviceIcon(item.device_name)} />
            </View>
            <View style={{ flexDirection: "column", alignItems: "flex-start", padding: 5, paddingLeft: 10, justifyContent: "flex-start", width: `80%` }}>
                <Text style={{ flex: 1, flexWrap: 'wrap' }} >{`${item.device_name}`}</Text>
                <Text>{`${item.from?.city}, ${item.from?.country}`}</Text>
                <Text>{`${dayjs(item.created_at).locale(i18n.language).fromNow()}`}</Text>
            </View>
            { session_id !== item.session_id && <SvgElement onPress={() => onPress()} size={22} name={"close"} /> }
        </View>
    )
}

export default SessionBox;