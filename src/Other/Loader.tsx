import React from "react";
import { ActivityIndicator } from "react-native";
import useTheme from "../Components/Container/Theme/useTheme";
import styles from "../Style/style";

function Loader() {

    const { colors } = useTheme()

    return <ActivityIndicator 
        animating={true} 
        color={colors.text_normal} 
        size="large" 
        style={styles.activityIndicator} />
}

export default Loader;