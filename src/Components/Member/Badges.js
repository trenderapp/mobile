import React from "react";
import { Image } from "react-native";

function UserBadges({ url }) {
    return <Image source={{
        uri: url,
        height: 20,
        width: 20
    }} />
}

export default UserBadges;