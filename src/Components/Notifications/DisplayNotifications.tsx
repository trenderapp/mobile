import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Markdown } from "../Elements/Text";
import { Username, Avatar } from "../Member";
import { useNavigation } from '@react-navigation/native';
import { useClient, useTheme } from "../Container";
import styles from "../../Style/style";
import { navigationProps } from "../../Services";
import { notificationTypeInterface } from "trender-client/Managers/Interfaces/Global";
import { IconButton } from "react-native-paper";
import { NotificationInterface } from "trender-client";

type sectionProps = {
    info: NotificationInterface.notificationFetchResponseSchema;
    readOneNotification: (notification_id: string) => Promise<void>;
}

const DisplayNotifications = ({ info, readOneNotification }: sectionProps) => {

    const { client, token } = useClient();
    const { colors } = useTheme();
    const navigation = useNavigation<navigationProps>();

    const svgName = (type: notificationTypeInterface) => {
        switch (type) {
            case "likes":
                return "heart"
            case "mentions":
                return "at"
            case "shares":
                return "share"
            case "follows":
                return "account-plus"
            case "comments":
                return "comment"
            default:
                return ""
        }
    }

    const navigateScreen = async (notification_type: notificationTypeInterface) => {
        if(!navigation) return;
        await readOneNotification(info.notification_id)
        switch (notification_type) {
            case "follows":
                return navigation.navigate("ProfileStack", { screen: "ProfileScreen", params: { nickname: info.from.nickname }})
            case "likes":
                return navigation.navigate("PostStack", { screen: "PostScreen", params: { post_id: info?.post.post_id }})
            case "mentions":
                return navigation.navigate("PostStack", { screen: "PostScreen", params: { post_id: info?.post.post_id }})
            case "comments":
                return navigation.navigate("PostStack", { screen: "PostScreen", params: { post_id: info?.post.post_id }})
            case "shares":
                return navigation.navigate("PostStack", { screen: "PostScreen", params: { post_id: info?.post.post_id }})
            default:
                return ""
        }
    }

    return (
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigateScreen(info?.notification_type ?? "none")}>
            <View style={{
                padding: 5,
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                borderBottomColor: colors.bg_secondary,
                backgroundColor: info?.readed ? undefined : colors.bg_secondary,
                borderBottomWidth: 1
            }}>
                <View style={[styles.row, { justifyContent: "flex-start", alignItems: "flex-start" }]}>
                    <View style={{ position: "relative" }}>
                        <Avatar size={40} url={client.user.avatar(info?.from?.user_id, info?.from?.avatar)} />
                        <View style={{ bottom: -5, right: 5, width: 20, height: 20, position: "absolute", backgroundColor: colors.badge_color, borderRadius: 60/2, flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center" }}>
                            <IconButton icon={svgName(info.notification_type)} size={13}/>
                        </View>
                    </View>
                    <Username user={info?.from} created_at={info?.created_at} lefComponent={undefined} />
                </View>
                <View style={{ paddingLeft: 5 }}>
                    <Markdown token={token} maxLine={3} content={info?.post?.content ?? ""} />
                </View>
            </View>
        </TouchableOpacity>
    )

}

export default DisplayNotifications;