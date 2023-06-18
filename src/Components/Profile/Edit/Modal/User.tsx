import React from "react";
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message';
import { Button, Divider } from "react-native-paper";
import Clipboard from "@react-native-clipboard/clipboard";

import { useClient, useTheme } from "../../../Container";
import { BottomModal } from "../../../../Other";
import { profileInformationsInterface } from "trender-client/Managers/Interfaces/User";

type SectionProps = {
    modalVisible: boolean;
    setModalVisible: (bool: boolean) => any;
    informations: profileInformationsInterface;
    setInfo: any
}

function ProfileUserModal({ modalVisible, setModalVisible, informations, setInfo }: SectionProps) {

    const { t } = useTranslation('');
    const { colors } = useTheme();
    const { client } = useClient();

    const report = async () => {
        const response = await client.user.report(informations.user_id, 1);
        setModalVisible(false);
        if (response.error) return Toast.show({ text1: t(`errors.${response.error.code}`) as string})
        Toast.show({ text1: t("commons.success") as string })
        setModalVisible(false)
    }

    const block = async () => {
        const response = await client.user.block.create(informations.user_id);
        setModalVisible(false);
        if (response.error) return Toast.show({ text1: t(`errors.${response.error.code}`) as string })
        setInfo({ ...informations, followed: false })
        Toast.show({ text1: t("commons.success") as string })
        setModalVisible(false)
    }

    const copyUserID = () => {
        Clipboard.setString(informations.user_id);
        Toast.show({ text1: t("commons.success") as string })
        setModalVisible(false)
    }


    return (
        <BottomModal onSwipeComplete={() => setModalVisible(false)} isVisible={modalVisible}>
            <Button uppercase onPress={() => copyUserID()} icon="content-copy">{t("profile.copy_user_id")}</Button>
            <Divider bold theme={{ colors: { outlineVariant: colors.bg_primary } }} />
            <Button uppercase onPress={() => report()} icon="shield-alert-outline">{t("commons.report")}</Button>
            <Divider bold theme={{ colors: { outlineVariant: colors.bg_primary } }} />
            <Button uppercase onPress={() => block()} icon="block-helper">{t("profile.block")}</Button>
            <Divider bold theme={{ colors: { outlineVariant: colors.bg_primary } }} />
            <Button uppercase textColor={colors.warning_color} onPress={() => setModalVisible(false)} icon="keyboard-return">{t("commons.cancel")}</Button>
        </BottomModal>
    )
}

export default ProfileUserModal;