import React, { useContext, useState } from "react";
import { TextStyle, View, ViewStyle } from 'react-native';

import styles from "../../../../../Style/style";
import LikeButton from "./LikeButton";
import { SinglePostContext } from "../../../PostContext.js";
import { IconButton, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NavigationContextI } from "../../../../Container/Navigation/NavigationContext";
import { postResponseSchema } from "trender-client/Managers/Interfaces/Post";
import BookmarkButton from "./BookmarkButton";
import { useClient, useTheme } from "../../../../Container";
import Owner from "../Menu/Owner";
import User from "../Menu/User";
import SvgElement from "../../../../Elements/Svg";

function Postbottom() {

    const { info } = useContext<{ info: postResponseSchema }>(SinglePostContext);
    const navigation = useNavigation<NavigationContextI>();
    const { colors } = useTheme();
    const { user } = useClient();
    const [showModal, setShowModal] = useState(false);

    const buttonStyle: ViewStyle = {
        ...styles.row
    }

    const textStyle: TextStyle = {
        color: colors.text_muted
    }

    return (
        <View>
            <View style={[styles.row, { justifyContent: "space-between" }]}>
                <View style={[styles.row]}>
                    <View style={buttonStyle}>
                        <IconButton onPress={() => navigation?.navigate("CreateStack", {
                            screen: "PostCreatorScreen",
                            params: {
                                attached_post: info,
                                initFiles: [],
                                initContent: ""
                            }
                        }) as any} icon="comment-multiple" />
                        <Text style={textStyle}>{info?.comments ?? 0}</Text>
                    </View>
                    <View style={buttonStyle}>
                        <IconButton onPress={() => navigation?.navigate("CreateStack", {
                            screen: "PostCreatorScreen",
                            params: {
                                shared_post: info,
                                initFiles: [],
                                initContent: ""
                            }
                        }) as any} icon="share" />
                        <Text style={textStyle} onPress={() => navigation?.navigate("PostStack", {
                            screen: "PostScreenShares",
                            params: {
                                post_id: info.post_id
                            }
                        })}>{info?.shares ?? 0}</Text>
                    </View>
                    <View style={buttonStyle}>
                        <LikeButton />
                        <Text style={textStyle}>{info?.likes ?? 0}</Text>
                    </View>
                    <View style={buttonStyle}>
                        <BookmarkButton />
                        <Text style={textStyle}>{info?.bookmarks ?? 0}</Text>
                    </View>
                    <View style={buttonStyle}>
                        <IconButton icon="eye" />
                        <Text style={textStyle}>{info?.views ?? 1}</Text>
                    </View>
                </View>
                <IconButton onPress={() => setShowModal(true)} icon="dots-horizontal" />
                {info?.from.user_id === user?.user_id && <Owner pined={info.from?.pined_post} post_id={info.post_id} modalVisible={showModal} setModalVisible={() => setShowModal(false)} />}
                {info?.from.user_id !== user?.user_id && <User modalVisible={showModal} setModalVisible={() => setShowModal(false)} />}
            </View>
        </View>
    )
}

export default Postbottom;