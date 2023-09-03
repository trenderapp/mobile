import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, TouchableOpacity } from "react-native";
import styles from "../../../../Style/style";
import { useClient } from "../../../Container";
import { Avatar, Username } from "../../../Member";

function Postheader({ info, created_at }) { 
    
    const { client } = useClient();
    const navigation = useNavigation();
    
    return (
        <View style={{ 
                flex: 1, 
                width: styles.full_width,
                padding: 10,
                flexDirection: "row",
                justifyContent: "space-between"
            }}>
            <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate("ProfileStack" , {
                screen: "ProfileScreen",
                params: {
                  nickname: info.nickname
                }
              })} >
                <View style={[ styles.row, styles.align_left, {
                    justifyContent: "flex-start",
                    alignItems: "flex-start"
                } ]}>
                    <Avatar size={40} url={client.user.avatar(info?.user_id, info?.avatar)} />
                    <Username user={info} created_at={created_at} />
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default Postheader;