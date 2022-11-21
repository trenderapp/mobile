import React from "react";
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message';
import { Divider, Text } from "react-native-paper";
import Clipboard from "@react-native-clipboard/clipboard";

import { useClient, useTheme } from "../../../Container";
import { BottomModal, ModalSection } from "../../../../Other";
import SvgElement from "../../../Elements/Svg";

function ProfileUserModal({ setModalVisible, modalVisible, informations }) {

    const { t } = useTranslation('');
    const { colors } = useTheme();
    const { client } = useClient();

    const report = async () => {
        const response = await client.user.report(informations.user_info.user_id, 1);
        setModalVisible(false);
        if (response.error) return Toast.show({
            text1: t(`errors.${response.error.code}`)
        })
        Toast.show({
            text1: t("commons.success")
        })
    }

    const block = async () => {
        const response = await client.user.block.create(informations.user_info.user_id);
        setModalVisible(false);
        if (response.error) return Toast.show({
            text1: t(`errors.${response.error.code}`)
        })
        setInfo({ ...informations, following: false })
        Toast.show({
            text1: t("commons.success")
        })
    }

    const copyUserID = () => {
        Clipboard.setString(informations.user_info.user_id);
        Toast.show({
            text1: t("commons.success")
        })
    }


    return (
        <BottomModal onSwipeComplete={() => setModalVisible(false)} isVisible={modalVisible}>
            <ModalSection onPress={() => copyUserID()} >
                <SvgElement name="copy" margin={5} size={22} />
                <Text>{t("profile.copy_user_id")}</Text>
            </ModalSection>
            <Divider />
            <ModalSection onPress={() => report()} >
                <SvgElement name="shield" margin={5} size={22} />
                <Text>{t("commons.report")}</Text>
            </ModalSection>
            <Divider />
            <ModalSection onPress={() => block()} >
                <SvgElement name="ban" margin={5} size={22} />
                <Text>{t("profile.block")}</Text>
            </ModalSection>
            <Divider />
            <ModalSection onPress={() => setModalVisible(false)} >
                <Text style={{ color: colors.warning_color }}>{t("commons.cancel")}</Text>
            </ModalSection>
        </BottomModal>
    )
}

export default ProfileUserModal;