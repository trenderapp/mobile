import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Markdown } from "../Elements/Text";
import { Username, Avatar } from "../Member";
import { useNavigation } from '@react-navigation/native';
import { useClient, useTheme } from "../Container";
import styles, { full_width } from "../../Style/style";
import SvgElement from "../Elements/Svg";
import FastImage from "react-native-fast-image";
import { navigationProps } from "../../Services";

type notificationType = "likes" | "mentions" | "follows";

const DisplayNotifications = ({ info }: any) => {

    const { client } = useClient();
    const { colors } = useTheme();
    const navigation = useNavigation<navigationProps>();

    const svgName = (type: notificationType) => {
        switch (type) {
            case "likes":
                return "heart-solid"
            case "mentions":
                return "comment"
            case "follows":
                return "add-user"
            default:
                return ""
        }
    }

    const navigateScreen = (notification_type: notificationType) => {
        if(!navigation) return;
        switch (notification_type) {
            case "follows":
                return navigation.navigate("ProfileStack", { screen: "ProfileScreen", params: { nickname: info.from.nickname }})
            case "likes":
                return navigation.navigate("PostStack", { screen: "PostScreen", params: { post_id: info?.post.post_id }})
            default:
                return ""
        }
    }

    const DisplayAttachments = () => {
        if(!info?.post) return <View></View>;
        if(info.post.attachments.length < 1) return <View></View>;
        const type = info.post.type;
        const attachments = info.post.attachments;
        if(type === 1 || type === 2) return <View style={{
            backgroundColor: colors.bg_secondary
        }}>
            <FastImage
        resizeMode={"cover"}
        style={{
            width: full_width,
            height: 250
        }}
        source={{ uri: client.post.file(info?.target_id, info?.post.post_id, type === 1 ? attachments[0].name : attachments[0]?.thumbnail) }}/>
        </View>
        // if(type === 2) return <VideoPlayer uri={`${client.post.file(info.from.user_id, info.post.post_id, attachments[0]?.name)}`} />
        return <View></View>
    }

    return (
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigateScreen(info?.notification_type ?? "none")}>
            <View style={{
                padding: 5,
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                borderBottomColor: colors.bg_secondary,
                borderBottomWidth: 1
            }}>
                <View style={[styles.row, { justifyContent: "flex-start", alignItems: "flex-start" }]}>
                    <View style={{ position: "relative" }}>
                        <Avatar size={40} url={client.user.avatar(info?.from?.user_id, info?.from?.avatar)} />
                        <View style={{ bottom: -5, right: 5, width: 20, height: 20, position: "absolute", backgroundColor: colors.badge_color, borderRadius: 60/2, flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center" }}>
                            <SvgElement size={13} name={svgName(info.notification_type)} />
                        </View>
                    </View>
                    <Username user={info?.from} created_at={info?.created_at} />
                </View>
                <View style={{ paddingLeft: 5 }}>
                    <Markdown maxLine={3} content={info?.post?.content ?? ""} />
                </View>
            </View>
        </TouchableOpacity>
    )

}

export default DisplayNotifications;