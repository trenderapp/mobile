import React, { useContext, useState } from "react";
import { TextStyle, View, ViewStyle } from 'react-native';
import { IconButton, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import styles from "../../../../../Style/style";
import LikeButton from "./LikeButton";
import { SinglePostContext } from "../../../PostContext.js";
import { NavigationContextI } from "../../../../Container/Navigation/NavigationContext";
import { postResponseSchema } from "trender-client/Managers/Interfaces/Post";
import BookmarkButton from "./BookmarkButton";
import { useTheme } from "../../../../Container";

function Postbottom() {

    const { info } = useContext<{ info: postResponseSchema }>(SinglePostContext);
    const navigation = useNavigation<NavigationContextI>();
    const { colors } = useTheme();

    const buttonStyle: ViewStyle = {
        ...styles.row
    }

    const textStyle: TextStyle = {
        color: colors.text_muted
    }

    return (
        <View>
            <View style={[styles.row, { justifyContent: "space-evenly" }]}>
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
        </View>
    )
}

export default Postbottom;