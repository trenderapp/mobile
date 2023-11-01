import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { messageFormatDate } from "../../../Services";
import { useClient, useTheme } from "../../Container";
import { Markdown } from "../../Elements/Text";
import { Avatar } from "../../Member";

function FakeMessageBox({ content }: {
    content: string
}) {

    const { client, user } = useClient();
    const { colors } = useTheme();

    return (
        <View style={{
            flexDirection: "row",
            padding: 5,
            margin: 5,
            position: "relative",
            paddingBottom: 20,
            backgroundColor: colors.bg_secondary
        }}>
            <Avatar url={client.user.avatar(user.user_id, user.avatar)} />
            <View style={{
                width: "89%",
                marginRight: 10,
                marginBottom: 2
            }}>
                <Text style={{ fontWeight:'700' }}>{user.username}</Text>
                <Markdown token={user.token} content={content} />
            </View>
            <Text style={{
                    fontSize: 12,
                    position: "absolute",
                    right: 5,
                    bottom: 5
                }}>{messageFormatDate(new Date()).fromNow()}</Text>
        </View>
    )
}

export default FakeMessageBox;