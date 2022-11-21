import React from "react";
import FastImage from "react-native-fast-image";

export default function MultipleAvatar({ url, size = 33, number = 0 }) {

    return (
        <FastImage style={{
            width: size,
            height: size,
            borderRadius: 60 / 2,
            marginRight: 5,
            resizeMode: "cover"
            }} source={{
                uri: "https://cdn2.trenderapp.com/guilds_avatars/guilds_1.png", 
                cache: FastImage.cacheControl.web
            }} />
    )
}
