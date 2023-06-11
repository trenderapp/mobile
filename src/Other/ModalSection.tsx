import React, { ReactElement } from "react";
import { TouchableOpacity } from "react-native";
import styles from "../Style/style";
import { Divider } from "react-native-paper";
import { useTheme } from "../Components/Container";

type SectionProps = {
    noDivider?: boolean, 
    onPress: () => any, 
    children: ReactElement
}

function ModalSection({ onPress, noDivider , children }: SectionProps) {

    const { colors } = useTheme();

    return (
        <>
            <TouchableOpacity onPress={() => onPress()} style={styles.modal}>
                { children }
            </TouchableOpacity>
            { noDivider ? null : <Divider style={{ borderWidth: 0.25, borderColor: colors.bg_primary }} /> }
        </>
    )
}

export default ModalSection;