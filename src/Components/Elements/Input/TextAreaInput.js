import React from "react";
import { TextInput } from "react-native-paper";
import styles from "../../../Style/style";
import { useTheme } from "../../Container";

function TextAreaInput(props) {

    const { colors } = useTheme();

    return (
        <TextInput
            style={{ 
                ...styles.inputStyle, 
                backgroundColor: colors.bg_secondary, 
                borderColor: colors.bg_secondary 
            }}
            multiline
            { ...props }
        />
    )
}

export default TextAreaInput;