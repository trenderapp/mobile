import React, { useState } from "react";
import { View, TouchableOpacity, FlatList, Image, Pressable } from "react-native";

import SvgElement from "../../Elements/Svg";
import { full_width } from "../../../Style/style";
import { useTheme } from "../../Container";
import { CameraRoll } from "@react-native-camera-roll/camera-roll"
import { Button } from "react-native-paper";

function BottomButtonPostCreator({ setFiles, addFiles, setCameraVisible }) {

    const { colors } = useTheme();
    const [filter, setFilter] = useState({
        assetType: "All"
    })
    const [photos, setPhotos] = useState({
        selected: false,
        edges: []
    });

    const getPhotos = async (assetType = "All") => {
        if(photos.selected && filter.assetType === assetType) return setPhotos({ ...photos, edges: [], selected: false })
        const gallery = await CameraRoll.getPhotos({
            first: 25,
            assetType: assetType
        });
        setPhotos({
            ...gallery,
            selected: true
        })
        setFilter({
            assetType: assetType
        })
    }

    const onBottom = async (assetType = "All") => {
        if(!photos.page_info.has_next_page) return;
        const gallery = await CameraRoll.getPhotos({
            first: 50,
            after: photos.page_info?.end_cursor,
            assetType: assetType
        });
        setPhotos({
            ...gallery,
            edges: photos.edges.concat(gallery.edges)
        })
    }

    const fileInfo = (node) => {
        const uri = node.image.uri;
        const type = node.type.split("/")[0];
        const split = uri.split("/");
        const size = node.image?.fileSize ?? 0;

        const to_return = {
            size: size,
            name: split[split.length - 1],
            type: type,
            uri: uri
          }
          console.log(to_return);
        return to_return;
    }
    const buttons = [
        {
            icon: "images",
            onPress: async () => await getPhotos("Photos"),
            text: "commons.images",
            middle: false
        },
        {
            icon: "camera",
            onPress: () => setCameraVisible(true),
            text: "commons.images",
            middle: true
        },
        {
            icon: "videos",
            onPress: async () => await getPhotos("Videos"),
            text: "commons.videos",
            middle: false
        }
    ]

    const HeaderFooterButton = () => (
        <View style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "flex-end",
            padding: 10
        }}>
            { photos.selected && <Button icon="magnify-plus" mode="contained" onPress={() => {
                if(filter.assetType === "Videos") return addFiles("video");
                else return addFiles("photo")
            }}>Other</Button> }
        </View>
    )
    return (
        <View>
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
                padding: 10,
                borderColor: colors.bg_secondary,
                borderTopWidth: 1
            }}>
            {
                buttons.map((b, idx) => (
                    b.middle ? (
                        <TouchableOpacity onPress={b.onPress} style={{
                            position: "absolute",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: colors.bg_secondary,
                            width: 60,
                            height: 60,
                            borderRadius: 60 / 2,
                            left: full_width / 2.4,
                            bottom: 22
                        }} key={idx}>
                            <SvgElement key={idx} onPress={b.onPress} name={b.icon} size={30} />
                        </TouchableOpacity> ) : <SvgElement key={idx} onPress={b.onPress} name={b.icon} size={25} />
                ))
            }
        </View>
            {
                photos.selected && <FlatList
                onEndReached={() => onBottom(filter.assetType)}
                ListHeaderComponent={() => <HeaderFooterButton />}
                ListFooterComponent={() => photos.edges.length > 20 && <HeaderFooterButton />}
                style={{ maxHeight: full_width / 1.25 }}
                data={[
                    ...photos.edges
                ]}
                keyExtractor={(item, index) => `${item.node.type}${index}`}
                renderItem={({ item }) => <Pressable onPress={() => setFiles(fileInfo(item.node))}>
                            <Image
                                style={{
                                    resizeMode: "cover",
                                    width: full_width / 3,
                                    height: full_width / 3
                                }}
                                source={{
                                uri: item.node.image.uri
                            }} />
                            </Pressable>}
                numColumns={3}
                horizontal={false} />
            }
        </View>
    )
}

export default BottomButtonPostCreator;