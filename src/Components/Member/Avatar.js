import React from "react";
import FastImage from "react-native-fast-image";

export default function Avatar({ url, size = 33 }) {

    return (
        <FastImage style={{
            width: size,
            height: size,
            borderRadius: 60 / 2,
            marginRight: 5,
            resizeMode: "cover"
        }} source={{
            uri: url,
            cache: FastImage.cacheControl.web
        }} />
    )
}