import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { Button, Divider, Text, Card } from "react-native-paper";
import { PostInterface } from "trender-client";
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from 'react-redux';
import RNScreenshotPrevent, { addListener } from 'react-native-screenshot-prevent';
import Toast from 'react-native-toast-message';

import { RootState, useAppDispatch, useAppSelector } from '../../Redux';
import { addPostTempSaveTrends } from '../../Redux/postTempSaveFeed/action';
import styles from "../../Style/style";
import { useClient, useNavigation, useTheme } from "../Container";
import SvgElement from "../Elements/Svg";
import { SinglePostContextProvider } from "./PostContext.js";
import PostNormal from "./Views/PostNormal";
import Postbottom from "./Views/Components/Postbottom";
import { Loader } from "../../Other";
import Postheader from "./Views/Components/Postheader";

type SectionProps = React.FC<{
    informations: PostInterface.postResponseSchema;
    pined?: boolean;
    comments?: boolean;
    is_comment?: boolean;
    is_share?: boolean;
    no_bottom?: boolean;
    is_original_post?: boolean;
    original_post_user?: any;
}>;

const DisplayPosts: SectionProps = ({
    informations,
    pined,
    comments,
    is_comment,
    is_share,
    no_bottom,
    is_original_post,
    original_post_user
}): JSX.Element => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { client } = useClient();
    const navigation = useNavigation();
    const savedPosts = useAppSelector((state) => state.postTempSaveFeed);
    const dispatch = useAppDispatch();
    const [attached_post, setAttachedPost] = useState<PostInterface.postResponseSchema | undefined | false>(undefined);
    const [commentLoad, setCommentLoad] = useState(false);

    const loadAttachedPosts = async (post_id: string) => {
        setCommentLoad(true);
        const findPost = savedPosts.find(p => p.post_id === post_id);
        if (findPost) {
            setCommentLoad(false);
            return setAttachedPost(findPost)
        } else {
            const response = await client.post.fetchOne(post_id);
            setCommentLoad(false);
            if (response.error || !response.data) return setAttachedPost(false);
            dispatch(addPostTempSaveTrends([response.data]));
            return setAttachedPost(response.data);
        }
    };
    useEffect(() => {
        if (informations.attached_post_id && comments) loadAttachedPosts(informations.attached_post_id);
    }, [informations]);

    const PinnedView = () => (
        <View style={{ marginLeft: 5 }}>
            <Text style={styles.pined}>
                <SvgElement name="pin" noColor size={12} margin={undefined} />{" "}
                {t("posts.pin")}
            </Text>
        </View>
    )

    const CategoriesBox = ({ c }: { c: number }) => (
        <View style={{
            backgroundColor: colors.bg_primary,
            borderWidth: 1,
            borderRadius: 60,
            padding: 3,
            paddingLeft: 6,
            marginLeft: 5,
        }}>
            <Text variant="labelSmall" style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
            }}>{t(`categories.${c}`)}</Text>
        </View>
    )

    const LeftComponent = () => (
        <View style={styles.row}>
            {informations.paid ? <MaterialIcons style={{ marginLeft: 3 }} size={20} color={colors.color_green} name={`cash`} /> : null}
        </View>
    )

    return (
        <Card mode="contained" style={{
            borderRadius: 10,
            margin: is_original_post ? 0 : 10
        }}>
            <SinglePostContextProvider
                informations={{
                    ...informations,
                    is_comment: is_comment,
                    is_share: is_share,
                    no_bottom: no_bottom,
                    original_post_user: original_post_user
                }}>
                <TouchableOpacity activeOpacity={0.7} onPress={() => comments ? null : navigation?.push("PostStack", { screen: "PostScreen", params: { post_id: informations.post_id } })}>
                    {attached_post ? <DisplayPosts is_original_post={true} comments informations={attached_post} /> : typeof attached_post !== "undefined" && <Button>{t("posts.deleted_post")}</Button>}

                    {commentLoad && <Loader />}

                    {pined && <PinnedView />}

                    <Postheader lefComponent={<LeftComponent />} info={informations.from} post_id={informations.post_id} created_at={informations.created_at} />
                    {informations.categories && informations.categories.length > 0 && <View style={[styles.row, { marginTop: -5, marginLeft: 5 }]}>{informations.categories.map((c, idx) => <CategoriesBox key={idx} c={c} />)}</View>}
                    <PostNormal maxLines={comments ? undefined : 5} />
                </TouchableOpacity>
                {informations.shared_post_id && !is_share && (
                    <View style={{ margin: 10, borderColor: colors.bg_primary, borderWidth: 1, borderRadius: 8 }}>
                        {informations.shared_post ? (
                            <DisplayPosts is_share={true} informations={{
                                ...informations.shared_post as any
                            }} />
                        ) : <Button>{t("posts.unavailable")}</Button>
                        }
                    </View>
                )}
                {!is_share && (
                    <>
                        <Postbottom />
                        {is_original_post && <Divider bold horizontalInset />}
                    </>
                )}
            </SinglePostContextProvider>
        </Card>
    );
};

const mapStateToProps = (state: RootState) => {
    return {
        mainFeed: state.mainFeed,
        notificationFeed: state.notificationFeed
    };
};

const mapDispatchToProps = {
    addPostTempSaveTrends,
};

export default memo(connect(mapStateToProps, mapDispatchToProps)(DisplayPosts));
