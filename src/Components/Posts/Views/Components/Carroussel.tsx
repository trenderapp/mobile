import React, { useContext, useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { IconButton, Text, Badge } from "react-native-paper";
import ImageModal from 'react-native-image-modal';
import { useClient, useTheme } from "../../../Container";
import { SinglePostContext } from "../../PostContext.js";
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
                            ...sectionStyle.media_image,
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
                        style={sectionStyle.media_image}
                        source={{ uri: client.post.file(info?.from?.user_id, info?.post_id, img.name) }}
                        imageBackgroundColor={colors.bg_secondary}
                    />
                )
}

export default function Carroussel({ pictures }: carrousselType) {
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
            <ScrollView onScroll={change} horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={sectionStyle.media_image}>
                { pictures.map((img: attachments, i: number) => <BlurImage key={i} img={img} info={info} setOpen={setOpen} openModal={openModal} />) }
            </ScrollView>
            {
                pictures.length > 1 && <Badge style={sectionStyle.text}>{Index+1}</Badge>
            }
            <View style={sectionStyle.circleDiv}>
                {
                    pictures.length > 1 && pictures.map((image, i) => <View style={[sectionStyle.whiteCircle, { backgroundColor: colors.fa_primary, opacity: i === Index ? 1 : 0.25 }]} key={i} />)
                }
            </View>
        </View>
    )
}

const sectionStyle = StyleSheet.create({
    circleDiv:  {
        position: "absolute",
        bottom: 15,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: 10
    },
    whiteCircle: {
        width: 6,
        height: 6,
        borderRadius: 3,
        margin: 5,
    },
    text: {
        position: "absolute",
        top: 15,
        right: 5,
    },
    media_image: {
        width: 350,
        height: 350,
        borderRadius: 10
    }
})