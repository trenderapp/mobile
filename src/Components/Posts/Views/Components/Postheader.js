import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, TouchableOpacity } from "react-native";
import { IconButton } from "react-native-paper";

import Owner from "./Menu/Owner";
import User from "./Menu/User";
import styles from "../../../../Style/style";
import { useClient } from "../../../Container";
import { Avatar, Username } from "../../../Member";

function Postheader({ info, created_at, post_id }) { 
    
    const { client, user } = useClient();
    const navigation = useNavigation();
    const [showModal, setShowModal] = useState(false);
    
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
            <IconButton style={{ marginTop: -5 }} onPress={() => setShowModal(true)} icon="dots-horizontal" />
            {info?.user_id === user?.user_id && <Owner pined={info.from?.pined_post} post_id={post_id} modalVisible={showModal} setModalVisible={() => setShowModal(false)} />}
            {info?.user_id !== user?.user_id && <User modalVisible={showModal} setModalVisible={() => setShowModal(false)} />}
        </View>
    )
}

export default Postheader;