import React from "react";
import { View } from "react-native";
import { getBottomSpace } from "react-native-iphone-x-helper";
import useTheme from "./Theme/useTheme";

function SafeBottomContainer({ children , safeAreaInsets }) {
    const BOTTOM_INSET = getBottomSpace();
    const { colors } = useTheme();

    const insets = {
        left: safeAreaInsets?.left ?? 0,
        right: safeAreaInsets?.right ?? 0,
        bottom: safeAreaInsets?.bottom ?? BOTTOM_INSET,
      };

    return (
        <View style={{
                flex: 1, 
                backgroundColor: colors.bg_primary,
                marginBottom: insets.bottom,
                marginHorizontal: Math.max(insets.left, insets.right),
                padding: 5
            }}>
            { children }
        </View>
    )
}

export default SafeBottomContainer;