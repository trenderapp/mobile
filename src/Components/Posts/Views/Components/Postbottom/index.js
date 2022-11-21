import React, { useContext, useState } from "react";
import { View, Share } from 'react-native';

import styles from "../../../../../Style/style";
import LikeButton from "./LikeButton";
import { SinglePostContext } from "../../../PostContext";
import { Text } from "react-native-paper";
import SvgElement from "../../../../Elements/Svg";
import { posturl } from "../../../../../Services/constante";
import PostCreatorScreen from "../../../Creator/PostCreatorScreen";
import { useTheme } from "../../../../Container";
import { useNavigation } from "@react-navigation/native";

function Postbottom() {

    const { info } = useContext(SinglePostContext);
    const [createPost, setCreatePost] = useState(false);
    const { colors } = useTheme();
    const navigation = useNavigation();

    const onShare = async () => {
        await Share.share({
            message: `${posturl}/${info.post_id}`,
            url: `${posturl}/${info.post_id}`
        });
    };

    return (
        <View style={{
            borderBottomColor: colors.bg_secondary,
            borderBottomWidth: 1
        }}>
            <PostCreatorScreen changeVisibilty={setCreatePost} visible={createPost} attached_post_id={info.post_id} />
            <View
                style={[ styles.row, { 
                    justifyContent: "space-evenly", 
                    width: "100%", 
                    paddingLeft: 5, 
                    paddingRight: 5, 
                    margin: 5
                }]}>
                <View style={styles.row}>
                   <SvgElement margin={10} onPress={() => navigation.navigate("CreateStack", {
                    screen: "PostCreatorScreen",
                    params: {
                      attached_post_id: info.post_id,
                      initFiles: [],
                      initContent: ""
                    }})} name='comment' size={22} />
                    <Text>{info?.comments?.total ?? 0}</Text>
                </View>
                <View style={styles.row}>
                    <LikeButton />
                    <Text>{info?.likes?.total ?? 0}</Text>
                </View>
                <View style={styles.row}>
                    <SvgElement onPress={onShare} margin={10} name='share' size={22} />
                </View>
            </View>
        </View>
    )
}

export default Postbottom;