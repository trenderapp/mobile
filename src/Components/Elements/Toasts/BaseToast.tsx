import React from "react";
import { BaseToast, BaseToastProps } from 'react-native-toast-message';
import { useTheme } from "../../Container";

export default function Base(props: BaseToastProps) {
    const { colors } = useTheme();

    return (
        <BaseToast {...props} style={{
            backgroundColor: colors.bg_secondary,
            borderLeftColor: colors.fa_primary
        }}  
        text1Style={{
            color: colors.text_normal
        }}
        text2Style={{
            color: colors.text_normal
        }}
        />
    )
}