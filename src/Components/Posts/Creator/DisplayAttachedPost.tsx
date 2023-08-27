import { View } from "react-native";
import React from "react";
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

    const { client, token } = useClient();
    
    return (
        <View>
            <View style={[styles.row, { width: full_width, padding: 5 }]}>
                <Avatar size={45} url={client.user.avatar(attached_post.from.user_id, attached_post.from.avatar)} />
                <View style={[styles.column, { justifyContent: "flex-start", alignItems: "flex-start" }]}>
                    <Username created_at={attached_post.created_at} user={attached_post.from} lefComponent={undefined} />
                </View>
            </View>
            <View style={{ padding: 5 }}>
                <Markdown token={token} content={attached_post.content} />
            </View>
            <Divider bold={true} />
        </View>
    )
}