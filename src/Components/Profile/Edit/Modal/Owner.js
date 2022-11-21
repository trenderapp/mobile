import React from "react";
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message';
import { Divider, Text } from "react-native-paper";
import Clipboard from "@react-native-clipboard/clipboard";

import { useTheme } from "../../../Container";
import { BottomModal, ModalSection } from "../../../../Other";
import SvgElement from "../../../Elements/Svg";

function ProfileOwnerModal({ setModalVisible, modalVisible, informations }) {

    const { t } = useTranslation('');
    const { colors } = useTheme();

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
            <ModalSection onPress={() => setModalVisible(false)} >
                <Text style={{ color: colors.warning_color }}>{t("commons.cancel")}</Text>
            </ModalSection>
        </BottomModal>
    )
}

export default ProfileOwnerModal;