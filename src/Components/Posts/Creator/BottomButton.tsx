import React, { useState, useEffect } from "react";
import { View, FlatList, Image, Pressable } from "react-native";
import { IconButton, Text } from "react-native-paper";

import styles, { full_width } from "../../../Style/style";
import { useTheme } from "../../Container";
import { CameraRoll, AssetType, PhotoIdentifier } from "@react-native-camera-roll/camera-roll"
import { Button } from "react-native-paper";

type PropsType = {
    setFiles: (params: {
        size: number;
        name: string;
        type: string;
        uri: string;
    }) => any,
    addFiles: (target: "photo" | "video") => any,
    setCameraVisible: (bool: boolean) => any,
    content: string;
    maxLength: number;
}

function BottomButtonPostCreator({ setFiles, addFiles, setCameraVisible, content, maxLength }: PropsType) {

    const { colors } = useTheme();
    const [filter, setFilter] = useState<{ assetType: AssetType }>({
        assetType: "All"
    })
    const [photos, setPhotos] = useState<{
        selected: boolean,
        edges: PhotoIdentifier[],
        page_info: {
            has_next_page: boolean;
            start_cursor?: string;
            end_cursor?: string;
        };
        limited?: boolean;
    }>({
        selected: false,
        page_info: {
            has_next_page: false,
            start_cursor: "",
            end_cursor: ""
        },
        edges: []
    });

    const getPhotos = async (assetType: AssetType = "All") => {
        if (photos.selected && filter.assetType === assetType) return setPhotos({ ...photos, edges: [], selected: false })
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

    useEffect(() => {
        getPhotos("Photos")
    }, [])

    const onBottom = async (assetType: AssetType = "All") => {
        if (!photos.page_info.has_next_page) return;
        const gallery = await CameraRoll.getPhotos({
            first: 50,
            after: photos.page_info?.end_cursor,
            assetType: assetType
        });
        setPhotos({
            ...gallery,
            selected: true,
            edges: photos.edges.concat(gallery.edges)
        })
    }

    const fileInfo = ({ node }: PhotoIdentifier) => {
        const uri = node.image.uri;
        const type = node.type;
        const split = uri.split("/");
        const size = node.image?.fileSize ?? 1;

        const to_return = {
            size: size,
            name: split[split.length - 1],
            type: type,
            uri: uri
        }
        return to_return;
    }
    const buttons = [
        {
            icon: "camera",
            onPress: () => setCameraVisible(true),
            text: "commons.images",
            disable: false
        },
        {
            icon: "folder-multiple-image",
            onPress: async () => await getPhotos("Photos"),
            text: "commons.images",
            disable: filter.assetType === "Photos"
        },
        {
            icon: "video-box",
            onPress: async () => await getPhotos("Videos"),
            text: "commons.videos",
            disable:  filter.assetType === "Videos"
        }
    ]

    const HeaderFooterButton = () => (
        <View style={{
            padding: 10
        }}>
            {photos.selected && <Button icon="magnify-plus" mode="outlined" onPress={() => {
                if (filter.assetType === "Videos") return addFiles("video");
                else return addFiles("photo")
            }}>Other</Button>}
        </View>
    )
    return (
        <View style={{
            backgroundColor: colors.bg_secondary
        }}>
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderColor: colors.bg_secondary,
                borderTopWidth: 1
            }}>
                <View style={styles.row}>
                    {buttons.map((b, idx) => <IconButton disabled={b.disable} key={idx} onPress={b.onPress} icon={b.icon} />)}
                </View>
                <Text style={{ marginRight: 10 }}>{content.length} / {maxLength}</Text>
            </View>
            {
                photos.selected && <FlatList
                    onEndReached={() => onBottom(filter.assetType)}
                    ListHeaderComponent={() => <HeaderFooterButton />}
                    ListFooterComponent={() => photos.edges.length > 20 ? <HeaderFooterButton /> : null}
                    style={{ maxHeight: full_width / 1.25 }}
                    data={[
                        ...photos.edges
                    ]}
                    keyExtractor={(item, index) => `${item.node.type}${index}`}
                    renderItem={({ item }) => <Pressable onPress={() => setFiles(fileInfo(item))}>
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
                    horizontal={true} />
            }
        </View>
    )
}

export default BottomButtonPostCreator;