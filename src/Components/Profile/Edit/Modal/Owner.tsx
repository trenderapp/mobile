import React from "react";
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message';
import { Button, Divider } from "react-native-paper";
import Clipboard from "@react-native-clipboard/clipboard";

import { useTheme } from "../../../Container";
import { BottomModal } from "../../../../Other";
import { profileInformationsInterface } from "trender-client/Managers/Interfaces/User";

type SectionProps = {
    modalVisible: boolean;
    setModalVisible: (bool: boolean) => any;
    informations: profileInformationsInterface;
}

function ProfileOwnerModal({ modalVisible, setModalVisible, informations }: SectionProps) {

    const { t } = useTranslation('');
    const { colors } = useTheme();

    const copyUserID = () => {
        Clipboard.setString(informations.user_id);
        Toast.show({ text1: t("commons.success") as string })
    }


    return (
        <BottomModal onSwipeComplete={() => setModalVisible(false)} isVisible={modalVisible}>
            <Button uppercase onPress={() => copyUserID()} icon="content-copy">{t("profile.copy_user_id")}</Button>
            <Divider bold theme={{ colors: { outlineVariant: colors.bg_primary } }} />
            <Button uppercase textColor={colors.warning_color} onPress={() => setModalVisible(false)} icon="keyboard-return">{t("commons.cancel")}</Button>
        </BottomModal>
    )
}

export default ProfileOwnerModal;