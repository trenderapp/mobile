import React from "react";
import { Image } from "react-native";

function Logo({ size = 150 }) {

    return (
        <Image
            source={require('./Images/logo.png')}
            style={{
            width: '50%',
            height: size,
            resizeMode: 'contain',
            margin: 10,
            }}
        />
    )
}

export default Logo;