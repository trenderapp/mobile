import React from "react";
import { Appbar } from "react-native-paper";

import styles, { full_width } from "../../Style/style";

import { TouchableOpacity, View } from "react-native";
import useTheme from "./Theme/useTheme";
import useClient from "./Client/useClient";
import { useNavigation } from "@react-navigation/native";
import FastImage from "react-native-fast-image";

const PageContainer = ({ children }) => {
    
  const { client, user } = useClient();
  const navigation = useNavigation();
  const { colors } = useTheme();

    return (  
        <View style={{ flex: 1 }}>
            <Appbar.Header style={{ width: full_width, backgroundColor: colors.bg_primary, flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate("ProfileStack" , {
                screen: "ProfileScreen",
                params: {
                  nickname: user.nickname
                }
              })}>
                <FastImage source={{ uri: `${client.user.avatar(user.user_id, user.avatar)}`, cache: FastImage.cacheControl.web }} style={[ styles.pdp33, { marginLeft: 5, backgroundColor: colors.bg_secondary } ]} />
              </TouchableOpacity>
              <View style={[styles.row, { justifyContent: "flex-end" }]}>
                  { /** <Appbar.Action color={colors.text_normal} icon="qrcode-scan" onPress={() => console.log("qrcode")} /> */ }
                  <Appbar.Action color={colors.text_normal} icon="cog" onPress={() => navigation.navigate("SettingStack")} />
                  <Appbar.Action color={colors.text_normal} icon="pencil" onPress={() => navigation.navigate("CreateStack", {
                    screen: "PostCreatorScreen",
                    params: {
                      attached_post_id: "",
                      initFiles: [],
                      initContent: ""
                    }})} />
                </View>
            </Appbar.Header>
              { children }
        </View>
    )
};

export default PageContainer;