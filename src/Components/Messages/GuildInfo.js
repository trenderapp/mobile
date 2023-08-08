import React, { useContext, useEffect, useState } from "react";
import { TouchableHighlight, View } from "react-native";
import { Text, Badge } from "react-native-paper";
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Clipboard from "@react-native-clipboard/clipboard";
import { useTranslation } from "react-i18next";
import { full_width } from "../../Style/style";
import { useClient, useTheme } from "../Container";
import { Avatar } from "../Member";
import { BottomModal, ModalSection } from "../../Other";
import { deleteDmGroup, DmGroupListContext } from "../../Context/DmGuildListContext";
import { MultipleAvatar } from "../Guilds";
import SvgElement from "../Elements/Svg";

function GuildInfo({ info }) {

    const { client } = useClient();
    const { colors } = useTheme();
    const { t } = useTranslation();
    const isFocused = useIsFocused();
    const { dispatch, unreads, groups } = useContext(DmGroupListContext);
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();
    const [read, setRead] = useState(false);
    
    const leaveDm = async () => {
        const request = client.guild.leave(info.guild_id);
        if(request.error) return Toast.show({ text1: t(`errors.${request.error.code}`)});
        dispatch(deleteDmGroup(info.guild_id));
        setModalVisible(false)
    }

    const copyText = (text) => {
        Clipboard.setString(text);
        Toast.show({ text1: t(`commons.success`)});
    }

    useEffect(() => {
        setRead(!info?.last_message?.message_id ? true : unreads.some(u => u.message_id === info?.last_message?.message_id) ? true : false)
    }, [isFocused, unreads, groups]);

    return (
        <>
            <BottomModal onSwipeComplete={() => setModalVisible(false)} isVisible={modalVisible}>
                <ModalSection onPress={() => copyText(info?.guild_id)}>
                    <SvgElement name="copy" margin={5} size={22} /> 
                    <Text>{t("messages.copy_id")}</Text>
                </ModalSection>
                <ModalSection onPress={() => leaveDm()}>
                    <SvgElement name="disconnect" margin={5} size={22} /> 
                    <Text>{t("messages.leave_conversation")}</Text>
                </ModalSection>
                <ModalSection noDivider onPress={() => setModalVisible(false)} >
                    <Text style={{ color: colors.warning_color }}>{t("commons.cancel")}</Text>
                </ModalSection>
            </BottomModal>
            <TouchableHighlight onLongPress={() => setModalVisible(true)} onPress={() => navigation.navigate("MessagesStack", {
                screen: "MessageScreen",
                params: info
            })} underlayColor={colors.bg_secondary} style={{ padding: 5, borderRadius: 5, marginBottom: 5,  backgroundColor:!read ? colors.bg_third : undefined  }}>
                <View style={{flexDirection: "row", alignItems: "center", width: full_width, position: "relative" }}>
                     { !read && <Badge style={{ position: "absolute", top: 2, left: -2, zIndex: 2 }} size={10}  /> }
                     { info.users.length >= 2 ? <MultipleAvatar url={client.user.avatar(info.users[0]?.user_id, info.users[0]?.avatar)} number={info.users.length} /> : <Avatar url={client.user.avatar(info.users[0]?.user_id, info.users[0]?.avatar)} /> }
                    <View>
                        <Text numberOfLines={1} textBreakStrategy="balanced">{info?.users.map(u => u.username).join(", ")}</Text>
                        { info?.last_message && <Text style={{
                            color: colors.text_muted
                        }} numberOfLines={1} textBreakStrategy="balanced">{info?.last_message?.content}</Text> }
                    </View>
                </View>
            </TouchableHighlight>
        </>
    )
}

export default GuildInfo;