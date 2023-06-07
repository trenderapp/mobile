import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import Toast from 'react-native-toast-message';
import { Button } from "react-native-paper";
import styles from "../../Style/style";
import { useClient, useNavigation } from "../Container";
import SvgElement from "../Elements/Svg";
import { Text } from "react-native-paper";
import { SinglePostContextProvider } from "./PostContext";
import PostNormal from "./Views/PostNormal";
import { PostInterface } from "trender-client";

type SectionProps = React.FC<{
    informations: PostInterface.postResponseSchema, 
    pined?: boolean, 
    comments?: boolean, 
    is_comment?: boolean
}>

const DisplayPosts: SectionProps = ({ informations, pined, comments, is_comment }): JSX.Element => {
    
    const { t } = useTranslation();
    const { client } = useClient();
    const navigation = useNavigation();
    const [attached_post, setAttachedPost] = useState<PostInterface.postResponseSchema | undefined>(undefined);
    const [loader, setLoader] = useState(false)

    const loadAttachedPosts = async (post_id: string) => {
        setLoader(true)
        if(loader) return;
        const response = await client.post.fetchOne(post_id);
        setLoader(false);    
        if(response.error || !response.data) return;
        setAttachedPost(response.data)
        return;
    }

    return (
        <SinglePostContextProvider informations={{
            ...informations,
            is_comment: is_comment,
        }}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => comments ? null : navigation?.push("PostStack", { screen: "PostScreen", params: { post_id: informations.post_id } })}>
                { attached_post && <DisplayPosts informations={attached_post} /> }
                { informations?.attached_post_id && !attached_post && comments ? <Button loading={loader} onPress={() => loadAttachedPosts(informations.attached_post_id ?? "")}>{t("posts.load_attached")}</Button> : undefined }
                { pined && <View style={{ marginLeft: 5 }}><Text style={styles.pined}><SvgElement name="pin" noColor size={12} margin={undefined} /> {t("posts.pin")}</Text></View> }
                <PostNormal /> 
            </TouchableOpacity>
        </SinglePostContextProvider>
    )
}

export default DisplayPosts;