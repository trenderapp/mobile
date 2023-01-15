import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Markdown } from "../Elements/Text";
import { Username, Avatar } from "../Member";
import { useClient, useTheme, useNavigation } from "../Container";
import styles, { full_width } from "../../Style/style";
import SvgElement from "../Elements/Svg";
import VideoPlayer from "../Posts/Views/Components/VideoPlayer";
import { Text } from "react-native-paper";
import FastImage from "react-native-fast-image";

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
            case "follows":
                return "add-user"
            default:
                return ""
        }
    }

    const navigateScreen = (notification_type) => {
        switch (notification_type) {
            case "follows":
                return navigation.navigate("ProfileStack", {
                    screen: "ProfileScreen",
                    params: {
                        nickname: info.from.nickname
                    }
                })
            default:
                return ""
        }
    }

    const DisplayAttachments = () => {
        if(!info?.post) return <View></View>;
        if(info.post.attachments.length < 1) return <View></View>;
        const type = info.post.type;
        const attachments = info.post.attachments;
        if(type === 1) return <FastImage 
        resizeMode={"cover"}
        style={{
            width: full_width,
            height: 100
        }}
        source={{ uri: client.post.file(info?.target_id, info?.post.post_id, attachments[0].name) }}/>
        if(type === 2) return <Text>Video</Text> // <VideoPlayer uri={`${client.post.file(info.from.user_id, info.post.post_id, attachments[0]?.name)}`} />
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
                <View style={[styles.row, styles.align_left, {
                    justifyContent: "flex-start",
                    alignItems: "flex-start"
                }]}>
                    <SvgElement size={16} name={svgName(info.notification_type)} />
                    <Avatar size={33} url={client.user.avatar(info?.from?.user_id, info?.from?.avatar)} />
                    <Username user={info?.from} created_at={info?.created_at} />
                </View>
                <Markdown maxLine={1} content={info?.post?.content ?? ""} />
                <DisplayAttachments />
            </View>
        </TouchableOpacity>
    )

}

export default DisplayNotifications;