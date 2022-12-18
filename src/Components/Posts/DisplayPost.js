import React from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import styles from "../../Style/style";
import { useNavigation } from "../Container";
import SvgElement from "../Elements/Svg";
import { Text } from "react-native-paper";
import { SinglePostContextProvider } from "./PostContext";
import PostImage from "./Views/PostImage";
import PostNormal from "./Views/PostNormal";
import PostVideo from "./Views/PostVideo";

function DisplayPosts({ informations, pined, comments, is_comment }) {
    
    const { t } = useTranslation();
    const navigation = useNavigation();

    return (
        <SinglePostContextProvider informations={{
            ...informations,
            is_comment: is_comment
        }}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => comments ? null : navigation.push("PostStack", { screen: "PostScreen", params: { post_id: informations.post_id, informations: informations } })} >
            { pined && <View style={{ marginLeft: 5 }}><Text style={styles.pined}><SvgElement name="pin" noColor size={12} /> {t("posts.pin")}</Text></View> }
            {   
                !informations?.type || informations.type === 0 ? 
                <PostNormal /> 
                : informations.type === 1 ? 
                    <PostImage />
                    : informations.type === 2 ?
                        <PostVideo />
                        /*: informations.type === 3 ?
                            <PostAudio />*/
                            : <PostNormal />
            }
            </TouchableOpacity>
        </SinglePostContextProvider>
    )
}

export default DisplayPosts;