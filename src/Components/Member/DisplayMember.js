import React from "react";

import { View, TouchableOpacity} from "react-native";
import styles from "../../Style/style";
import { Avatar } from "./";
import Username from "./Username";
import { useClient, useNavigation } from "../Container";
import { Markdown } from "../Elements/Text";

function DisplayMember({ informations, onPress, full_width, noDescription, LeftComponent }) {

    const { client } = useClient();
    const navigation = useNavigation();

    return (
        <View style={{ 
                flex: 1,
                width: full_width && styles.full_width,
                padding: 10
            }}>
            <TouchableOpacity activeOpacity={0.5} onPress={() => onPress ? onPress() : navigation.push('ProfileStack', {
                screen: "ProfileScreen",
                params: {
                  nickname: informations.nickname
                }})} 
                style={[ styles.row ]}
                >
                <Avatar size={45} url={client.user.avatar(informations.user_id, informations.avatar)} />
                <View style={[ styles.column, styles.align_left, {
                    justifyContent: "flex-start",
                    alignItems: "flex-start"
                } ]}>
                    <Username user={informations} />
                    { !noDescription && informations?.description ? <Markdown maxLine={1} content={informations.description} /> : null  }
                </View>
                { LeftComponent && LeftComponent }
            </TouchableOpacity>
        </View>
    );
}

export default DisplayMember;