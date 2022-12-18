import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import Toast from 'react-native-toast-message';
import Clipboard from "@react-native-clipboard/clipboard";

import { BottomModal, ModalSection } from "../../../../../Other";
import { useClient, useTheme } from "../../../../Container";
import SvgElement from "../../../../Elements/Svg";
import { Text } from "react-native-paper";
import { SinglePostContext } from "../../../PostContext";

function User({ modalVisible, setModalVisible }) {

    const { t } = useTranslation();
    const { client } = useClient();
    const { info } = useContext(SinglePostContext);
    const { colors } = useTheme();

    const block = async () => {
        const response = await client.user.block.create(info.from.user_id);
        if(response.error) return Toast.show({
            text1: t(`errors.${response.error.code}`)
        })
        Toast.show({
            text1: t("commons.success")
        })
        setModalVisible(false)
    }

    const report = async () => {
        const response = await client.post.report(info.post_id, 1);
        if(response.error) return Toast.show({
            text1: t(`errors.${response.error.code}`)
        })
        Toast.show({
            text1: t("commons.success")
        })
        setModalVisible(false)
    }

    const copyPostID = () => {
        Clipboard.setString(info.post_id);
        Toast.show({
            text1: t("commons.success")
        })
        setModalVisible(false)
    }

    return (
        <BottomModal onSwipeComplete={() => setModalVisible(false)} isVisible={modalVisible}>
            <ModalSection onPress={() => copyPostID()}>
                <SvgElement name="copy" margin={5} size={22} />
                <Text>{t("posts.copy_post_id")}</Text>
            </ModalSection>
            <ModalSection onPress={() => report()}>
                <SvgElement name="shield" margin={5} size={22} /> 
                <Text>{t("commons.report")}</Text>
            </ModalSection>
            <ModalSection onPress={() => block()} >
                <SvgElement name="ban" margin={5} size={22} /> 
                <Text>{t("profile.block")}</Text>
            </ModalSection>
            <ModalSection noDivider onPress={() => setModalVisible(false)} >
                <Text style={{ color: colors.warning_color }}>{t("commons.cancel")}</Text>
            </ModalSection>
        </BottomModal>
    )
}

export default User;