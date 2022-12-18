import Clipboard from "@react-native-clipboard/clipboard";
import React, { useState } from "react";
import Toast from 'react-native-toast-message';
import { TouchableHighlight, View } from "react-native";
import { messageFormatDate } from "../../../Services";
import { useClient, useTheme } from "../../Container";
import { Markdown } from "../../Elements/Text";
import { Text } from "react-native-paper";
import { Avatar } from "../../Member";
import { SinglePostContextProvider } from "../../Posts/PostContext";
import { useTranslation } from "react-i18next";
import { BottomModal, ModalSection } from "../../../Other";
import SvgElement from "../../Elements/Svg";

function MessageBox({ info }) {

    const { client } = useClient();
    const { colors } = useTheme();
    const { t } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);

    const reportMessage = () => {
        const request = client.message.report(info.message_id, 0);
        if(request.error) return Toast.show({ text1: t(`errors.${request.error.code}`)});
        Toast.show({ text1: t("commons.success") })
    }

    const copyText = (text) => {
        Clipboard.setString(text);
        Toast.show({ text1: t("commons.success") })
    }

    return (
        <SinglePostContextProvider informations={info}>
            <BottomModal onSwipeComplete={() => setModalVisible(false)} isVisible={modalVisible}>
                <ModalSection onPress={() => copyText(info.message_id)}>  
                    <SvgElement name="copy" margin={5} size={22} />
                    <Text>{t("messages.copy_id")}</Text>
                </ModalSection>
                <ModalSection onPress={() => copyText(info.content)}>  
                    <SvgElement name="copy" margin={5} size={22} />
                    <Text>{t("messages.copy_message")}</Text>
                </ModalSection>
                <ModalSection onPress={() => reportMessage()}>  
                    <SvgElement name="ban" margin={5} size={22} /> 
                    <Text>{t("messages.report_message")}</Text>
                </ModalSection>
                <ModalSection noDivider onPress={() => setModalVisible(false)}>
                    <Text style={{ color: colors.warning_color }}>{t("commons.cancel")}</Text>
                </ModalSection>
            </BottomModal>
            <TouchableHighlight onLongPress={() => setModalVisible(true)} underlayColor={colors.bg_secondary} style={{
                flexDirection: "row",
                padding: 5,
                margin: 5,
                position: "relative",
                paddingBottom: 20
            }}>
                <>
                    <Avatar url={client.user.avatar(info.from.user_id, info.from.avatar)} />
                    <View style={{
                        width: "89%",
                        marginRight: 10,
                        marginBottom: 2
                    }}>
                        <Text style={{ fontWeight:'600', color: /*info.from?.accent_color ?? */ colors.text_normal }}>{info.from.username}</Text>
                        <Markdown content={info.content} />
                    </View>
                    <Text style={{
                            fontSize: 12,
                            position: "absolute",
                            right: 5,
                            bottom: 5
                        }}>{messageFormatDate(info.created_at).fromNow()}</Text>
                    </>
            </TouchableHighlight>
        </SinglePostContextProvider>
    )
}

export default MessageBox;