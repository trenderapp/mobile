import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import Toast from 'react-native-toast-message';
import Clipboard from "@react-native-clipboard/clipboard";

import { BottomModal, ModalSection } from "../../../../../Other";
import styles from "../../../../../Style/style";
import { useClient, useTheme } from "../../../../Container";
import SvgElement from "../../../../Elements/Svg";
import { Divider, Text } from "react-native-paper";
import { deletePosts, ProfilePostsListContext } from "../../../../Profile/ProfileContext";
import { useNavigation } from "@react-navigation/native";

function Owner({ modalVisible, setModalVisible, pined, post_id }) {

    const { t } = useTranslation();
    const { client } = useClient();
    const { dispatch } = useContext(ProfilePostsListContext);
    const { colors } = useTheme();
    const navigation = useNavigation();

    const deletePost = async () => {
        const response = await client.post.delete(post_id);
        if (response.error) return Toast.show({
            text1: t(`errors.${response.error.code}`)
        })
        if(navigation.getState().routeNames[0] === "PostScreen") {
            if(navigation.canGoBack()) return navigation.goBack();
        } else {
            dispatch(deletePosts(post_id));
            setModalVisible(false);
        }
    }

    const pinPost = async () => {
        const response = await client.post.pin(post_id);
        if (response.error) return Toast.show({
            text1: t(`errors.${response.error.code}`)
        })
        Toast.show({
            text1: t("commons.success")
        })
        setModalVisible(false)
    }

    const unPinPost = async () => {
        const response = await client.post.unPin(post_id);
        if (response.error) return Toast.show({
            text1: t(`errors.${response.error.code}`)
        })
        Toast.show({
            text1: t("commons.success")
        })
        setModalVisible(false)
    }

    const copyPostID = () => {
        Clipboard.setString(post_id);
        Toast.show({
            text1: t("commons.success")
        })
        setModalVisible(false)
    }

    return (
        <BottomModal onSwipeComplete={() => setModalVisible(false)} isVisible={modalVisible}>
            <ModalSection onPress={() => copyPostID()}>
                <SvgElement name="copy" margin={5} size={22} />
                <Text style={styles.row}>
                    <Text>{t("posts.copy_post_id")}</Text>
                </Text>
            </ModalSection>
            <Divider />
            <ModalSection onPress={() => deletePost()}>
                <SvgElement name="delete" margin={5} size={22} />
                <Text style={styles.row}>
                    <Text>{t("posts.delete")}</Text>
                </Text>
            </ModalSection>
            <Divider />
            {pined && pined === post_id && <ModalSection onPress={() => unPinPost()}>
                <SvgElement name="pin" margin={5} size={22} />
                <Text>{t("posts.unpin")}</Text>
            </ModalSection>
            }
            {!pined || pined !== post_id ? <ModalSection onPress={() => pinPost()}>
                <SvgElement name="pin" margin={5} size={22} />
                <Text>{t("posts.pin")}</Text>
            </ModalSection> : null

            }
            <Divider />
            <ModalSection onPress={() => setModalVisible(false)}>
                <Text style={{ color: colors.warning_color }}>{t("commons.cancel")}</Text>
            </ModalSection>
        </BottomModal>
    )
}

export default Owner;