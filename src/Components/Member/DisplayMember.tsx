import React from "react";

import { View, TouchableOpacity } from "react-native";
import styles, { full_width as screenFullWidth } from "../../Style/style";
import { Avatar } from "./";
import Username from "./Username";
import { useClient, useNavigation } from "../Container";
import { Markdown } from "../Elements/Text";

function DisplayMember({ informations, onPress, full_width, noDescription, LeftComponent }: any) {

    const { client, token } = useClient();
    const navigation = useNavigation();

    return (
        <View style={{
            flex: 1,
            width: full_width && screenFullWidth,
            padding: 10
        }}>
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => onPress ? onPress() : navigation.push('ProfileStack', {
                    screen: "ProfileScreen",
                    params: {
                        nickname: informations.nickname
                    }
                })}
                style={[styles.row]}>
                <Avatar size={45} url={client.user.avatar(informations.user_id, informations.avatar)} />
                <Username user={informations} created_at={undefined} lefComponent={undefined} />
                {LeftComponent && LeftComponent}
            </TouchableOpacity>
        </View>
    );
}

export default DisplayMember;