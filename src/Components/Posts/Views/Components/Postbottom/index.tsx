import React, { useContext } from "react";
import { Share, View } from 'react-native';

import styles from "../../../../../Style/style";
import LikeButton from "./LikeButton";
import { SinglePostContext } from "../../../PostContext.js";
import { IconButton, Text, Tooltip } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NavigationContextI } from "../../../../Container/Navigation/NavigationContext";
import { postResponseSchema } from "trender-client/Managers/Interfaces/Post";
import { posturl } from "../../../../../Services/constante";

function Postbottom() {

    const { info } = useContext<{ info: postResponseSchema }>(SinglePostContext);
    const navigation = useNavigation<NavigationContextI>();

    const onShare = async () => {
        await Share.share({
            message: `${posturl}/${info.post_id}`,
            url: `${posturl}/${info.post_id}`
        });
    }

    return (
        <View>
            <View
                style={[styles.row, { justifyContent: "space-evenly" }]}>
                <View style={styles.row}>
                    <IconButton onPress={() => navigation?.navigate("CreateStack", {
                        screen: "PostCreatorScreen",
                        params: {
                            attached_post: info,
                            initFiles: [],
                            initContent: ""
                        }
                    }) as any} icon="comment-multiple" />
                    <Text>{info?.comments ?? 0}</Text>
                </View>
                <View style={styles.row}>
                    <IconButton onPress={() => navigation?.navigate("CreateStack", {
                        screen: "PostCreatorScreen",
                        params: {
                            shared_post: info,
                            initFiles: [],
                            initContent: ""
                        }
                    }) as any} icon="share" />
                    <Text>{info?.shares ?? 0}</Text>
                </View>
                <View style={styles.row}>
                    <LikeButton />
                    <Text>{info?.likes ?? 0}</Text>
                </View>
                <View style={styles.row}>
                    <IconButton onLongPress={() => {}} icon="eye" />
                    <Text>{info?.views ?? 1}</Text>
                </View>
                <IconButton onPress={() => onShare()} icon="share-variant" />
            </View>
        </View>
    )
}

export default Postbottom;