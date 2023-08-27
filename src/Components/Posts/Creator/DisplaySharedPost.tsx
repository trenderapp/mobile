import { View } from "react-native";
import React from "react";
import { Avatar, Username } from "../../Member";
import { useClient } from "../../Container";
import styles, { full_width } from "../../../Style/style";
import { PostInterface } from "trender-client";
import { Markdown } from "../../Elements/Text";
import { Divider } from "react-native-paper";

type SectionProps = {
    shared_post: PostInterface.postResponseSchema
}

export default function DisplaySharedPost({ shared_post }: SectionProps) {

    const { client, token } = useClient();

    return (
        <>
            <Divider bold={true} />
            <View style={{
                marginLeft: 40
            }}>
                <View style={[styles.row, { width: full_width, padding: 5 }]}>
                    <Avatar size={45} url={client.user.avatar(shared_post.from.user_id, shared_post.from.avatar)} />
                    <View style={[styles.column, { justifyContent: "flex-start", alignItems: "flex-start" }]}>
                        <Username created_at={shared_post.created_at} user={shared_post.from} lefComponent={undefined} />
                    </View>
                </View>
                <View style={{ padding: 5 }}>
                    <Markdown content={shared_post.content} token={token} />
                </View>
            </View>
        </>
    )
}