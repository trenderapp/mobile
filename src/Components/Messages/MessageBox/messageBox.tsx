import Clipboard from "@react-native-clipboard/clipboard";
import React from "react";
import Toast from 'react-native-toast-message';
import { useClient, useTheme } from "../../Container";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { BottomModal, ModalSection } from "../../../Other";
import SvgElement from "../../Elements/Svg";
import { MessageType } from "@flyerhq/react-native-chat-ui";

function MessageBox({ info, modalVisible, setModalVisible }: {
    info: MessageType.Text;
    setModalVisible: () => void;
    modalVisible: boolean;
}) {

    const { client } = useClient();
    const { colors } = useTheme();
    const { t } = useTranslation();

    const reportMessage = async () => {
        await client.message.report(info.id, 0);
        Toast.show({ text1: t("commons.success") as string })
    }

    const copyText = (text: string) => {
        Clipboard.setString(text);
        Toast.show({ text1: t("commons.success") as string })
    }

    return (
        <BottomModal onSwipeComplete={() => setModalVisible()} dismiss={() => setModalVisible()} isVisible={modalVisible}>
            <ModalSection onPress={() => copyText(info.id)}>
                <>
                    <SvgElement name="copy" margin={5} size={22} />
                    <Text>{t("messages.copy_id")}</Text>
                </>
            </ModalSection>
            <ModalSection onPress={() => copyText(info.text)}>
                <>
                    <SvgElement name="copy" margin={5} size={22} />
                    <Text>{t("messages.copy_message")}</Text>
                </>
            </ModalSection>
            <ModalSection onPress={() => reportMessage()}>
                <>
                    <SvgElement name="ban" margin={5} size={22} />
                    <Text>{t("messages.report_message")}</Text>
                </>
            </ModalSection>
            <ModalSection noDivider onPress={() => setModalVisible()}>
                <Text style={{ color: colors.warning_color }}>{t("commons.cancel")}</Text>
            </ModalSection>
        </BottomModal>
    )
}

export default MessageBox;