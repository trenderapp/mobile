import React from "react";
import { Image, Pressable } from "react-native";

type SectionProps = {
    url: string;
    onPress?: () => void
}

function UserBadges({ url, onPress }: SectionProps) {
    return <Pressable onPress={onPress}>
        <Image style={{
            marginRight: 6
        }} source={{
            uri: url,
            height: 20,
            width: 20
        }} />
    </Pressable>
}

export default UserBadges;