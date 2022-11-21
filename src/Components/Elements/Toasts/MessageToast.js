import React from "react";
import { Text } from "react-native-paper";
import { useTheme, useClient } from "../../Container";

export default function MessageToast({ text1, props }) {
    const { colors } = useTheme();
    const { client, user } = useClient();

    return (
        <View style={{ padding: 10, width: '100%', height: 60, backgroundColor: colors.bg_secondary, borderLeftColor: colors.fa_primary }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Avatar url={client.user.avatar(user.user_id, user.avatar)} />
            <View>
                <Text style={{ fontSize: 16, fontWeight:'700', marginLeft: 5 }}>{text1}</Text>
                <Text style={{ fontSize: 12, fontWeight:'700', marginLeft: 5 }}>{`le message mais sans plus quoi`}</Text>
            </View>
            </View>
        </View>
    )
}