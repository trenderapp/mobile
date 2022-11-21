import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import Toast from 'react-native-toast-message';
import { useClient } from "../../../../Container";
import SvgElement from "../../../../Elements/Svg";
import { SinglePostContext } from "../../../PostContext";

function LikeButton() {

    const { client } = useClient();
    const { t } = useTranslation('');
    const { info, setInfo } = useContext(SinglePostContext)

    const createLike = async () => {
        const response = await client.post.like(info.post_id);
        if(response.error) return  Toast.show({
            text1: t(`errors.${response.error.code}`)
        })
        setInfo({ ...info, likes: { total: info?.likes?.total > 0 ? info?.likes?.total + 1 : 1 }, liked: true})
    }

    const deleteLike = async () => {
        const response = await client.post.unlike(info.post_id);
        if(response.error) return Toast.show({
            text1: t(`errors.${response.error.code}`)
        })
        setInfo({ ...info, likes: { total: info?.likes?.total > 0 ? info?.likes?.total - 1 : 0 }, liked: undefined})
    }

    return (
        <SvgElement onPress={() => info?.liked ? deleteLike() : createLike()} margin={10} size={22} name={`${info?.liked ? "heart-solid" : "heart"}`} />
    )
}

export default LikeButton;