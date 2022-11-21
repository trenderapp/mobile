import React from "react";
import { TouchableOpacity } from "react-native";
import styles from "../Style/style";

function ModalSection({ onPress, children }) {

    return (
        <TouchableOpacity onPress={() => onPress()} style={styles.modal}>
            { children }
        </TouchableOpacity>
    )
}

export default ModalSection;