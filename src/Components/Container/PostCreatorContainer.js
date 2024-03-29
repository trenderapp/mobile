import React from "react";
import { Appbar } from "react-native-paper";
import { View } from "react-native";

import styles, { full_width } from "../../Style/style";
import { SafeBottomContainer, useTheme } from ".";

const PostCreatorContainer = ({ children, changeVisibilty, onSave, dontSend }) => {

  const { colors } = useTheme();

  return (
    <SafeBottomContainer>
      <Appbar.Header style={{ width: full_width, backgroundColor: colors.bg_primary, flexDirection: "row", justifyContent: "space-between", borderBottomColor: colors.bg_secondary, borderBottomWidth: 1 }}>
        <Appbar.BackAction onPress={() => changeVisibilty()} />
        <View style={[styles.row, { justifyContent: "flex-end" }]}>
          <Appbar.Action disabled={dontSend} color={colors.text_normal} icon="send" onPress={() => onSave()} />
        </View>
      </Appbar.Header>
      {children}
    </SafeBottomContainer>
  )
};

export default PostCreatorContainer;