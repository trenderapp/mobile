import React from "react";
import { IconButton } from "react-native-paper";
import { TextInputProps, TextInput, View, ViewStyle } from "react-native";
import styles from "../../../Style/style";
import { useTheme } from "../../Container";

type SectionProps = React.FC<{
    style?: ViewStyle | ViewStyle[];
    placeholder?: string;
    onChangeText?: (text: string) => void;
    value?: string;
    label?: string;
    onClearPress: () => void;
    onSearchPress: () => void;
} & TextInputProps>

const SearchBar: SectionProps = ({ style, placeholder, onChangeText, value = "", onClearPress, onSearchPress }) => {

    const { colors } = useTheme();

    return (
        <View style={[{
            height: 40,
            width: "90%",
            borderRadius: 12,
            alignSelf: "center",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.bg_secondary,
            shadowColor: colors.bg_third,
            shadowRadius: 8,
            shadowOpacity: 0.3,
            shadowOffset: {
              width: 0,
              height: 3,
            },
          }, style]}>
            <View style={[styles.row]}>
                <IconButton onPress={onSearchPress} icon="magnify" />
                <TextInput
                    placeholderTextColor={colors.text_normal}
                    placeholder={placeholder}
                    onChangeText={onChangeText}
                    value={value}
                    style={{
                        width: "75%",
                        color: colors.text_normal
                      }}
                    keyboardType="web-search"
                    onSubmitEditing={onSearchPress}
                />
            </View>
            <IconButton onPress={onClearPress} style={{ marginRight: 5, marginLeft: "auto" }} icon="close" />
        </View>
    )
}

export default SearchBar;