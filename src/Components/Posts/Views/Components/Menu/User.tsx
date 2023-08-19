import React, { useContext } from "react";
import { Share } from 'react-native';
import { useTranslation } from "react-i18next";
import Toast from 'react-native-toast-message';
import Clipboard from "@react-native-clipboard/clipboard";

import { BottomModal } from "../../../../../Other";
import { useClient, useTheme } from "../../../../Container";
import { Button, Divider } from "react-native-paper";
import { SinglePostContext } from "../../../PostContext.js";
import { posturl } from "../../../../../Services/constante";

type SectionProps = {
    modalVisible: boolean, 
    setModalVisible: (bool: boolean) => any
}

function User({ modalVisible, setModalVisible }: SectionProps) {

    const { t } = useTranslation();
    const { client } = useClient();
    const { info } = useContext(SinglePostContext);
    const { colors } = useTheme();

    const block = async () => {
        const response = await client.user.block.create(info.from.user_id);
        if(response.error) return Toast.show({ text1: t(`errors.${response.error.code}`) as string })
        Toast.show({ text1: t("commons.success") as string })
        setModalVisible(false)
    }

    const report = async () => {
        const response = await client.post.report(info.post_id, 1);
        if(response.error) return Toast.show({ text1: t(`errors.${response.error.code}`) as string })
        Toast.show({ text1: t("commons.success") as string })
        setModalVisible(false)
    }

    const copyPostID = () => {
        Clipboard.setString(info.post_id);
        Toast.show({ text1: t("commons.success") as string })
        setModalVisible(false)
    }

    const onShare = async () => {
        await Share.share({
            message: `${posturl}/${info.post_id}`,
            url: `${posturl}/${info.post_id}`
        });
    }

    return (
        <BottomModal onSwipeComplete={() => setModalVisible(false)} isVisible={modalVisible}>
            <Button uppercase onPress={() => onShare()} icon="share-variant">{t("posts.share")}</Button>
            <Divider bold theme={{ colors: { outlineVariant: colors.bg_primary } }} />
            <Button uppercase onPress={() => copyPostID()} icon="content-copy">{t("posts.copy_post_id")}</Button>
            <Divider bold theme={{ colors: { outlineVariant: colors.bg_primary } }} />
            <Button uppercase onPress={() => report()} icon="shield-alert-outline">{t("commons.report")}</Button>
            <Divider bold theme={{ colors: { outlineVariant: colors.bg_primary } }} />
            <Button uppercase onPress={() => block()} icon="block-helper">{t("profile.block")}</Button>
            <Divider bold theme={{ colors: { outlineVariant: colors.bg_primary } }} />
            <Button uppercase textColor={colors.warning_color} onPress={() => setModalVisible(false)} icon="keyboard-return">{t("commons.cancel")}</Button>
        </BottomModal>
    )
}

export default User;