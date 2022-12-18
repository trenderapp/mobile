import React from "react";
import FastImage from "react-native-fast-image";
import { useTheme } from "../Container";

export default function Avatar({ url, size = 33 }) {

    const { colors } = useTheme();

    return (
        <FastImage style={{
            width: size,
            height: size,
            borderRadius: 60 / 2,
            marginRight: 5,
            resizeMode: "cover",
            backgroundColor: colors.bg_secondary
        }} source={{
            uri: url,
            cache: FastImage.cacheControl.web
        }} />
    )
}