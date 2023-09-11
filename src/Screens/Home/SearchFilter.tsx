import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from 'react-native';
import { useTheme } from "../../Components/Container";
import { Text, Chip, Button } from "react-native-paper";
import styles from "../../Style/style";
import { trendsCategories } from "trender-client";

function SearchFilter() {

    const { colors } = useTheme();
    const { t } = useTranslation();

    const [types, setTypes] = useState([
        { name: "text", number: 0, selected: false },
        { name: "image", number: 1, selected: false },
        { name: "video", number: 2, selected: false },
        { name: "audio", number: 3, selected: false },
        { name: "others", number: 4, selected: false }
    ]);

    const [categories, setCategories] = useState<{
        number: number;
        name: string;
        selected?: boolean;
    }[]>(trendsCategories);

    const selectTypes = (x: number) => {
        setTypes((prevTypes) =>
            prevTypes.map((type, index) => {
                if (index === x) {
                    return { ...type, selected: !type.selected };
                } else {
                    return type;
                }
            })
        );
    }
    
    const selectCategories = (x: number) => {
        setCategories((prevCategories) =>
            prevCategories.map((category, index) => {
                if (index === x) {
                    return { ...category, selected: !category.selected };
                } else {
                    return category;
                }
            })
        );
    }    

    return (
        <View>
            <View style={{ padding: 10 }}>
                <Text style={{ marginBottom: 5, textTransform: "capitalize" }} variant="titleMedium">{t(`filter.type`)}</Text>
                <View style={[styles.row, { backgroundColor: colors.bg_primary, padding: 10, borderRadius: 12, flexWrap: "wrap" }]}>
                    {
                        types.map((type, idx) => <Chip
                            key={idx}
                            selected={type.selected}
                            onPress={() => selectTypes(idx)}
                            compact
                            textStyle={{ textTransform: "capitalize" }}
                            style={{ marginLeft: 5, marginBottom: 5 }}
                            mode="flat">{t(`types.${type.name}`)}</Chip>)
                    }
                </View>
            </View>
            <View style={{ padding: 10 }}>
                <Text style={{ marginBottom: 5, textTransform: "capitalize" }} variant="titleMedium">{t(`filter.categories`)}</Text>
                <ScrollView style={{ maxHeight: 250, borderRadius: 12, backgroundColor: colors.bg_primary }} contentContainerStyle={[styles.row, { flexWrap: "wrap", padding: 10 }]}>
                    {
                        categories.map((item, idx) => (
                            <Chip
                                key={idx}
                                selected={item.selected}
                                onPress={() => selectCategories(item.number)}
                                compact
                                textStyle={{ textTransform: "capitalize" }}
                                style={{ marginLeft: 5, marginBottom: 5 }}
                                mode="flat">{t(`categories.${item.number}`)}</Chip>
                        ))
                    }
                </ScrollView>
            </View>
            <View style={{ padding: 10 }}>
                <Text style={{ marginBottom: 5, textTransform: "capitalize" }} variant="titleMedium">{t(`filter.image`)}</Text>
                <Button mode="elevated" icon="camera">{t(`commons.coming_soon`)}</Button>
            </View>
            <Button labelStyle={{ textTransform: "capitalize" }} mode="contained">Apply filters</Button>
        </View>
    )
}

export default SearchFilter;