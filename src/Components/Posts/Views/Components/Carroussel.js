import React, { useContext, useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import FastImage from "react-native-fast-image";
import ImageModal from 'react-native-image-modal';
import styles from "../../../../Style/style";
import { useClient, useTheme } from "../../../Container";
import SvgElement from "../../../Elements/Svg";
import { SinglePostContext } from "../../PostContext";

function Carroussel({ pictures, creator, changeList }) {
    const [Index, setIndex] = useState(0);
    const [openModal, setOpen] = useState(false)
    const { client } = useClient();
    const { colors } = useTheme();
    const { info } = useContext(SinglePostContext)

    const change = ({ nativeEvent }) => {
        const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
        setIndex(slide)
    }
    
    return (
        <View>

            <ScrollView onScroll={change} horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.media_image}>
            {
                creator ? creator.map((img, i) =>
                <Pressable key={i} onPress={() => changeList(i)}>
                    <View style={{ position: "absolute", zIndex: 999 }}> 
                        <SvgElement onPress={() => changeList(i)} size={22} name={"circle-close"} />
                    </View>
                    <FastImage 
                        resizeMode={openModal ? "contain" : "cover"}
                        style={styles.media_image}
                        source={{
                            uri: img.uri,
                            cache: FastImage.cacheControl.web
                        }}/>
                </Pressable>
                ) : pictures.map((img, i) => (
                    <ImageModal
                        onOpen={() => setOpen(true)}
                        onClose={() => setOpen(false)}
                        resizeMode={openModal ? "contain" : "cover"}
                        key={i}
                        style={styles.media_image}
                        source={{ uri: img?.name ? client.post.file(info?.from?.user_id, info?.post_id, img.name) : img.uri }}
                        imageBackgroundColor={colors.bg_primary}
                    />
                ))
            }
            </ScrollView>
            <View style={styles.circleDiv}>
            {
                !creator && pictures.length > 1 &&
                pictures.map((image, i) => (
                    <View
                        style={[ styles.whiteCircle, {
                            backgroundColor: colors.fa_primary,
                            opacity: i === Index ? 1 : 0.25 
                        }]}
                        key={i}
                        active={i === Index}
                    />
                ))
            }
            </View>
        </View>
    )
}


export default Carroussel;