import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

const EmptyHome = ({ navigation }) => {

    const { t } = useTranslation();
    return (
        <View>
            <Text style={{ padding: 5 }}>{t("commons.nothing_display")}</Text>
            <Button onPress={() => navigation.jumpTo("search")}>{t("explore.explore_the_top_trends")}</Button>
        </View>
    )
}

export default EmptyHome;