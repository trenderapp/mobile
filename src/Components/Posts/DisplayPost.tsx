import React from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import styles from "../../Style/style";
import { useNavigation } from "../Container";
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
    const navigation = useNavigation();

    return (
        <SinglePostContextProvider informations={{
            ...informations,
            is_comment: is_comment,
        }}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => comments ? null : navigation?.push("PostStack", { screen: "PostScreen", params: { post_id: informations.post_id } })} >
                { pined && <View style={{ marginLeft: 5 }}><Text style={styles.pined}><SvgElement name="pin" noColor size={12} margin={undefined} /> {t("posts.pin")}</Text></View> } 
                <PostNormal /> 
            </TouchableOpacity>
        </SinglePostContextProvider>
    )
}

export default DisplayPosts;