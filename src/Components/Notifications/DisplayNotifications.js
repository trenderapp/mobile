import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Markdown } from "../Elements/Text";
import { Username, Avatar } from "../Member";
import { useClient, useTheme, useNavigation } from "../Container";
import styles from "../../Style/style";
import SvgElement from "../Elements/Svg";

function DisplayNotifications({ info }) {

    const { client } = useClient();
    const { colors } = useTheme();
    const navigation = useNavigation();

    const svgName = (type) => {
        switch (type) {
            case "likes":
                return "heart-solid"
            case "mentions":
                return "comment"
            default:
                return ""
        } 
    }

    return (
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.push("PostStack", { screen: "PostScreen", params: { post_id: info.post.post_id, informations: {
            ...info,
            content: info.post.content
        } } })}>
            <View style={{
                padding: 5,
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                borderBottomColor: colors.bg_secondary,
                borderBottomWidth: 1
            }}>
                <View style={[ styles.row, styles.align_left, {
                        justifyContent: "flex-start",
                        alignItems: "flex-start"
                    } ]}>
                        <SvgElement size={16} name={svgName(info.notification_type)} />
                        <Avatar size={33} url={client.user.avatar(info?.from?.user_id, info?.from?.avatar)} />
                        <Username user={info.from} created_at={info.created_at} />
                </View>
                <Markdown maxLine={1} content={info.post.content} />
            </View>
        </TouchableOpacity>
    )

}

export default DisplayNotifications;