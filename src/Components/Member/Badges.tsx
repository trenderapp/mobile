import React from "react";
import { Image, Pressable } from "react-native";

type SectionProps = {
    url: string;
    onPress?: () => void,
    size?: number
}

function UserBadges({ url, onPress, size = 20 }: SectionProps) {
    return <Pressable onPress={onPress}>
        <Image style={{
            marginRight: 6
        }} source={{
            uri: url,
            height: size,
            width: size
        }} />
    </Pressable>
}

export default UserBadges;