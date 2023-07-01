import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { Button, Divider, Text } from "react-native-paper";
import { PostInterface } from "trender-client";

import styles from "../../Style/style";
import { useClient, useNavigation, useTheme } from "../Container";
import SvgElement from "../Elements/Svg";
import { SinglePostContextProvider } from "./PostContext.js";
import PostNormal from "./Views/PostNormal";
import Postbottom from "./Views/Components/Postbottom";
import { Loader } from "../../Other";

type SectionProps = React.FC<{
    informations: PostInterface.postResponseSchema;
    pined?: boolean;
    comments?: boolean;
    is_comment?: boolean;
    is_share?: boolean;
    no_bottom?: boolean;
    is_original_post?: boolean;
}>;

const DisplayPosts: SectionProps = ({
    informations,
    pined,
    comments,
    is_comment,
    is_share,
    no_bottom,
    is_original_post,
}): JSX.Element => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { client } = useClient();
    const navigation = useNavigation();
    const [attached_post, setAttachedPost] = useState<PostInterface.postResponseSchema | undefined | false>(undefined);
    const [commentLoad, setCommentLoad] = useState(false);

    const loadAttachedPosts = async (post_id: string) => {
        setCommentLoad(true);
        const response = await client.post.fetchOne(post_id);
        setCommentLoad(false);
        if (response.error || !response.data) return setAttachedPost(false);
        return setAttachedPost(response.data);
    };

    useEffect(() => {
        if (informations.attached_post_id && comments) loadAttachedPosts(informations.attached_post_id);
    }, [informations]);

    return (
        <SinglePostContextProvider
            informations={{
                ...informations,
                is_comment: is_comment,
                is_share: is_share,
                no_bottom: no_bottom,
            }}
        >
            <TouchableOpacity activeOpacity={0.7} onPress={() => (comments ? null : navigation?.push("PostStack", { screen: "PostScreen", params: { post_id: informations.post_id } }))}>
                {attached_post ? (
                    <DisplayPosts is_original_post={true} informations={attached_post} />
                ) : typeof attached_post !== "undefined" && (
                    <Button>{t("posts.deleted_post")}</Button>
                )}
                {commentLoad && <Loader />}

                {pined && (
                    <View style={{ marginLeft: 5 }}>
                        <Text style={styles.pined}>
                            <SvgElement name="pin" noColor size={12} margin={undefined} />{" "}
                            {t("posts.pin")}
                        </Text>
                    </View>
                )}

                <PostNormal />
            </TouchableOpacity>
            {informations.shared_post_id && !is_share && (
                <View style={{ marginLeft: 40, borderColor: colors.bg_secondary, borderWidth: 1, borderRadius: 8, padding: 10 }}>
                    {informations.shared_post && informations.shared_user ? (
                        <DisplayPosts is_share={true} informations={{
                            from: informations.shared_user,
                            ...informations.shared_post as any
                        }} />
                        ) : typeof informations.shared_user === "object" ? <Button onPress={() => navigation?.push("PostStack", { screen: "PostScreen", params: { post_id: informations.shared_post_id } })}>{t("posts.hidden")}</Button>
                            : <Button>{t("posts.unavailable")}</Button>
                    }
                </View>
            )}
            {!is_share && (
                <>
                    <Postbottom />
                    {is_original_post ? <Divider bold horizontalInset /> : <Divider bold />}
                </>
            )}
        </SinglePostContextProvider>
    );
};

export default memo(DisplayPosts);
