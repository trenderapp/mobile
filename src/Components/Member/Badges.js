import React from "react";
import { Image } from "react-native";

function UserBadges({ url }) {
    return <Image style={{
        marginRight: 6
    }} source={{
        uri: url,
        height: 20,
        width: 20
    }} />
}

export default UserBadges;