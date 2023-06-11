import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import Toast from 'react-native-toast-message';
import { useClient, useTheme } from "../../../../Container";
import SvgElement from "../../../../Elements/Svg";
import { IconButton } from "react-native-paper";
import { SinglePostContext } from "../../../PostContext.js";

function LikeButton() {

    const { client } = useClient();
    const { t } = useTranslation('');
    const { info, setInfo } = useContext(SinglePostContext);
    const { colors } = useTheme();

    const createLike = async () => {
        const response = await client.post.like(info.post_id);
        if(response.error) return  Toast.show({ text1: t(`errors.${response.error.code}`) as string })
        setInfo({ ...info, likes: info?.likes > 0 ? info?.likes + 1 : 1, liked: true})
    }

    const deleteLike = async () => {
        const response = await client.post.unlike(info.post_id);
        if(response.error) return Toast.show({ text1: t(`errors.${response.error.code}`) as string })
        setInfo({ ...info, likes: info?.likes > 0 ? info?.likes - 1 : 0, liked: false})
    }

    return (
        <IconButton onPress={() => info?.liked ? deleteLike() : createLike()} icon={`${info?.liked ? "heart" : "heart-outline"}`} iconColor={info?.liked ? colors.badge_color : undefined} />
    )
}

export default LikeButton;