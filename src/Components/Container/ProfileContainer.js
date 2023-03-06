import React from "react";
import { Appbar, Text } from "react-native-paper";
import styles, { full_width } from "../../Style/style";
import { SafeBottomContainer, useTheme } from ".";
import { useNavigation } from "@react-navigation/native";

const ProfileContainer = ({ children, username }) => {

  const navigation = useNavigation();

  const { colors } = useTheme();

    return (
      <SafeBottomContainer>
          <Appbar.Header style={[styles.row, { width: full_width, backgroundColor: colors.bg_primary }]}>
            <Appbar.BackAction onPress={() => navigation ? navigation.goBack() : null} />
            <Text style={{
              fontWeight: "600"
            }}>{username ?? "..."}</Text>
          </Appbar.Header>
          { children }
      </SafeBottomContainer>
    )
};

export default ProfileContainer;