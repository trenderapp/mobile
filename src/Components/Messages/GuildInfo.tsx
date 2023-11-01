import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text, Badge, Card } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Clipboard from "@react-native-clipboard/clipboard";
import { useTranslation } from "react-i18next";
import { full_width } from "../../Style/style";
import { useClient, useTheme } from "../Container";
import { Avatar } from "../Member";
import { BottomModal, ModalSection } from "../../Other";
import { MultipleAvatar } from "../Guilds";
import SvgElement from "../Elements/Svg";
import { connect, useDispatch } from "react-redux";
import { RootState } from "../../Redux";
import { deleteGuildList } from "../../Redux/guildList/action";
import { NavigationContextI } from "../Container/Navigation/NavigationContext";
import { guildI } from "../../Redux/guildList";
import { GuildInterface } from "trender-client";

type sectionProps = {
    info: guildI;
}

function GuildInfo({ info }: sectionProps) {

    const { client, user } = useClient();
    const { colors } = useTheme();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation<NavigationContextI>();
    const [users, setUsers] = useState<GuildInterface.userInfo[]>([user])

    const leaveDm = async () => {
        await client.guild.leave(info.guild_id);
        dispatch(deleteGuildList(info.guild_id));
        setModalVisible(false)
    }

    const copyText = (text: string) => {
        Clipboard.setString(text);
        Toast.show({ text1: t(`commons.success`) as string });
    }

    useEffect(() => {
        setUsers(info.users.filter(u => u.user_id !== user.user_id))
    }, [info])

    return (
        <>
            <BottomModal onSwipeComplete={() => setModalVisible(false)} dismiss={() => setModalVisible(false)} isVisible={modalVisible}>
                <ModalSection onPress={() => copyText(info?.guild_id)}>
                    <>
                        <SvgElement name="copy" margin={5} size={22} />
                        <Text>{t("messages.copy_id")}</Text>
                    </>
                </ModalSection>
                <ModalSection onPress={() => leaveDm()}>
                    <>
                        <SvgElement name="disconnect" margin={5} size={22} />
                        <Text>{t("messages.leave_conversation")}</Text>
                    </>
                </ModalSection>
                <ModalSection noDivider onPress={() => setModalVisible(false)} >
                    <Text style={{ color: colors.warning_color }}>{t("commons.cancel")}</Text>
                </ModalSection>
            </BottomModal>
            <Card mode="contained" style={{
                margin: 10,
                backgroundColor: info.unread ? colors.bg_third : colors.bg_secondary,
                padding: 5, borderRadius: 5, marginBottom: 5
            }}>
                <TouchableOpacity
                    onPress={() => navigation?.navigate("MessagesStack", {
                        screen: "MessageScreen",
                        params: info
                    })}
                    onLongPress={() => setModalVisible(true)}>
                    <View style={{ flexDirection: "row", alignItems: "center", width: full_width, position: "relative" }}>
                        {info.unread && <Badge style={{ position: "absolute", top: 2, left: -2, zIndex: 2 }} size={10} />}
                        {users.length >= 2 ? <MultipleAvatar url={client.user.avatar(users[0].user_id, users[0].avatar)} number={info.users.length} /> : <Avatar url={client.user.avatar(users[0].user_id, users[0].avatar)} />}
                        <View>
                            <Text numberOfLines={1} textBreakStrategy="balanced">{users.map(u => u.username).join(", ")}</Text>
                            {
                                info.last_message && (
                                    <Text
                                        style={{
                                            color: colors.text_muted
                                        }}
                                        numberOfLines={1}
                                        textBreakStrategy="balanced">{info?.last_message?.content}</Text>
                                )
                            }
                        </View>
                    </View>
                </TouchableOpacity>
            </Card>
        </>
    )
}

const mapStateToProps = (state: RootState) => {
    return {
        guildListFeed: state.guildListFeed,
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GuildInfo);