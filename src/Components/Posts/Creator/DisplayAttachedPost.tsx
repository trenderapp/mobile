import { View } from "react-native";
import { Avatar, Username } from "../../Member";
import { useClient } from "../../Container";
import styles, { full_width } from "../../../Style/style";
import { PostInterface } from "trender-client";
import { Markdown } from "../../Elements/Text";
import { Divider } from "react-native-paper";

type SectionProps = {
    attached_post: PostInterface.postResponseSchema
}

export default function DisplayAttachedPost({ attached_post }: SectionProps) {

    const { client, user } = useClient();
    
    return (
        <View>
            <View style={[styles.row, { width: full_width, padding: 5 }]}>
                <Avatar size={45} url={client.user.avatar(user.user_id, user.avatar)} />
                <View style={[styles.column, { justifyContent: "flex-start", alignItems: "flex-start" }]}>
                    <Username created_at={attached_post.created_at} user={attached_post.from} />
                </View>
            </View>
            <View style={{ padding: 5 }}>
                <Markdown content={attached_post.content} />
            </View>
            <Divider bold={true} />
        </View>
    )
}