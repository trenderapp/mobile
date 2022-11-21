import React from "react";
import { TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import { full_width } from "../../Style/style";
import { useTheme } from "../Container";
import { Text } from "react-native-paper";

function HomeButtonSection({ t, onPress, icon }) {

    const { colors } = useTheme();
    
    return (
        <TouchableOpacity style={{
            width: full_width,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            height: 50,
            marginTop: 5,
            borderBottomColor: colors.bg_secondary,
            borderBottomWidth: 1,
            paddingStart: 10,
        }} onPress={() => onPress ? onPress() : null }>
            <Text>{t ?? "Undefined"}</Text>
            <Button textColor={colors.fa_primary} icon={icon ?? "arrow-right-thick"} mode="text" onPress={() => onPress ? onPress() : null} />
        </TouchableOpacity>
    )
}

export default HomeButtonSection;