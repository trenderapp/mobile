import React from "react";
import { TextInput } from "react-native-paper";
import styles from "../../../Style/style";
import { useTheme } from "../../Container";

function NormalTextInput(props) {

    const { colors } = useTheme();

    return (
        <TextInput
            style={{ 
                ...styles.inputStyle, 
                borderColor: colors.bg_secondary 
            }}
            { ...props } 
        />
    )
}

export default NormalTextInput;