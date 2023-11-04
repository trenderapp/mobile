import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Appbar, Text } from "react-native-paper";
import { Avatar } from "../Member";
import { full_width } from "../../Style/style";
import { useClient, useNavigation, useTheme } from "../Container";
import { guildI } from "../../Redux/guildList";

type sectionProps = {
    params: guildI;
}

export default function MessageBoxHeader({ params }: sectionProps) {

    const [users, setUsers] = useState(params.users)
    const { colors } = useTheme();
    const { client, user } = useClient();
    const navigation = useNavigation();

    useEffect(() => {
        setUsers(users.filter(u => u.user_id !== user.user_id))
    }, [params])

    return (
        <Appbar.Header style={{ width: full_width, flexDirection: "row", alignContent: "center", borderBottomColor: colors.bg_secondary, borderBottomWidth: 1 }}>
            <Appbar.BackAction color={colors.text_normal} onPress={() => navigation ? navigation.goBack() : null} />
            <TouchableOpacity onPress={() => params.type === 0 && navigation.navigate('ProfileStack', { screen: "ProfileScreen", params: { nickname: users[0].nickname } })} style={{ flexDirection: "row", alignItems: "center" }}>
                <Avatar url={client.user.avatar(users[0]?.user_id, users[0]?.avatar)} />
                <View>
                    <Text numberOfLines={1} style={{ fontSize: 16, fontWeight: '700', marginLeft: 5 }}>{`${users.map(u => u.username).join(", ")}`}</Text>
                    {params.type === 0 && <Text style={{ fontSize: 12, fontWeight: '700', marginLeft: 5 }}>{`@${users[0].nickname}`}</Text>}
                </View>
            </TouchableOpacity>
        </Appbar.Header>
    )
}