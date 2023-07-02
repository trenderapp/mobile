import React, { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, TouchableOpacity} from "react-native";
import { Chip } from "react-native-paper";
import styles from "../../../../Style/style";
import { useClient, useTheme } from "../../../Container";
import SvgElement from "../../../Elements/Svg";
import { Avatar, Username } from "../../../Member";
import Owner from "./Menu/Owner";
import { SinglePostContext } from "../../PostContext.js";
import User from "./Menu/User";

function Postheader({ info, created_at }) { 
    
    const [showModal, setShowModal] = useState(false);
    const { client, user } = useClient();
    const { colors } = useTheme();
    const navigation = useNavigation();
    const post = useContext(SinglePostContext);

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
                    <Username user={info} created_at={created_at} lefComponent={post.info.paid && <Chip textStyle={{ fontSize: 10 }} theme={{ colors: { secondaryContainer: colors.off_color }}}>Premium</Chip>} />
                </View>
            </TouchableOpacity>
            <SvgElement onPress={() => setShowModal(true)} size={22} name="ellipsis" />
            { info?.user_id === user?.user_id && <Owner pined={info.pined_post} post_id={post.info.post_id} modalVisible={showModal} setModalVisible={() => setShowModal(!showModal)} /> }
            { info?.user_id !== user?.user_id && <User post_id={post.info.post_id} modalVisible={showModal}  setModalVisible={() => setShowModal(!showModal)} /> }
        </View>
    )
}

export default Postheader;