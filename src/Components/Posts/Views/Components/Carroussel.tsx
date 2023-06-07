import React, { useContext, useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { IconButton, Text } from "react-native-paper";
import FastImage from "react-native-fast-image";
import ImageModal from 'react-native-image-modal';
import styles, { full_width } from "../../../../Style/style";
import { useClient, useTheme } from "../../../Container";
import SvgElement from "../../../Elements/Svg";
import { SinglePostContext } from "../../PostContext";
import { attachments } from "trender-client/Managers/Interfaces/Global";
import { useTranslation } from "react-i18next";

type createType = {
    size: number,
    name: string,
    type: string,
    uri: string
}

type carrousselType = {
    pictures: attachments[],
    creator?: createType[],
    changeList?: (i: number) => any
}

function BlurImage({ img, info, setOpen, openModal }: {
    img: attachments,
    info: any,
    setOpen: (bool: boolean) => any,
    openModal: boolean
}) {
    const { client, user } = useClient();
    const [blur] = useState(user?.nsfw_filter ?? false);
    const { colors } = useTheme();
    const { t } = useTranslation();

    return blur && img.nsfw ? (
                    <Pressable style={{ 
                            backgroundColor: colors.badge_color, 
                            width: full_width, 
                            height: "100%",
                            flex: 1,
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                        <IconButton icon="eye-off" />
                        <Text>{t("posts.explicit_content")}</Text>
                    </Pressable>
                ) : (
                    <ImageModal
                        onOpen={() => setOpen(true)}
                        onClose={() => setOpen(false)}
                        resizeMode={openModal ? "contain" : "cover"}
                        style={styles.media_image}
                        source={{ uri: client.post.file(info?.from?.user_id, info?.post_id, img.name) }}
                        imageBackgroundColor={colors.bg_primary}
                    />
                )
}

export default function Carroussel({ pictures, creator, changeList }: carrousselType) {
    const [Index, setIndex] = useState(0);
    const [openModal, setOpen] = useState(false)
    const { colors } = useTheme();
    const postContext = useContext(SinglePostContext)
    const info = postContext?.info;

    const change = ({ nativeEvent }: any) => {
        const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
        setIndex(slide)
    }

    return (
        <View>
            <ScrollView onScroll={change} horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.media_image}>
                {
                    creator ? creator.map((img: createType, i: number) =>
                        <Pressable key={i} onPress={() => changeList ? changeList(i) : undefined}>
                            <View style={{ position: "absolute", zIndex: 999 }}>
                                <SvgElement onPress={() => changeList ? changeList(i) : undefined} size={22} name={"circle-close"} />
                            </View>
                            <FastImage
                                resizeMode={openModal ? "contain" : "cover"}
                                style={styles.media_image}
                                source={{ uri: img.uri }} />
                        </Pressable>
                    ) : pictures.map((img: attachments, i: number) => <BlurImage key={i} img={img} info={info} setOpen={setOpen} openModal={openModal} />)
                }
            </ScrollView>
            <View style={styles.circleDiv}>
                {
                    !creator && pictures.length > 1 &&
                    pictures.map((image, i) => (
                        <View
                            style={[styles.whiteCircle, {
                                backgroundColor: colors.fa_primary,
                                opacity: i === Index ? 1 : 0.25
                            }]}
                            key={i}
                        />
                    ))
                }
            </View>
        </View>
    )
}