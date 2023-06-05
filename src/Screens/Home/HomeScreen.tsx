import React, { useEffect, useState } from 'react';
import { getAppInfo, navigationProps } from '../../Services';
import { useTranslation } from 'react-i18next';
import { useNavigation } from "@react-navigation/native";
import { Appbar, Text } from 'react-native-paper';
import { View } from 'react-native';

import UpdateDialog from './UpdateDialog';
import HomeNavigator from './HomeNavigator';
import { CustomHeader, useTheme } from '../../Components/Container';
import styles from '../../Style/style';
import { RootState, useAppSelector } from '../../Redux';
import { connect } from 'react-redux';

const HomeScreen = () => {

  const { t } = useTranslation();
  const [updateRequire, setUpdateRequire] = useState(false);
  const notifications = useAppSelector((state) => state.notificationFeed);
  const { colors } = useTheme()
  const navigation = useNavigation<navigationProps>();

  useEffect(() => {
    async function start() {
      const update_require = await getAppInfo();
      if (update_require) return setUpdateRequire(true);
    }
    start()
  }, [])

  const CustomLeftComponent = () => {
    return (
      <View style={[styles.row, { justifyContent: "flex-end" }]}>
        <View style={{ position: "relative" }}>
          <Appbar.Action color={colors.text_normal} icon="bell" onPress={() => navigation.navigate("NotificationScreen")} />
          {notifications.filter(n => n.readed === false || typeof n.readed === "undefined").length > 0 && (
            <View style={{
              bottom: 5, right: 10, width: 20, height: 20, position: "absolute", backgroundColor: colors.badge_color, borderRadius: 60 / 2, flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <Text>{notifications.filter(n => n.readed === false || typeof n.readed === "undefined").length}</Text>
            </View>

          )}

        </View>
        <Appbar.Action color={colors.text_normal} icon="pencil" onPress={() => navigation.navigate("CreateStack", {
          screen: "PostCreatorScreen",
          params: {
            attached_post_id: "",
            initFiles: [],
            initContent: ""
          }
        })} />
      </View>
    )
  }
  return (
    <>
      <CustomHeader title={t("commons.home") as string} isHome={true} leftComponent={<CustomLeftComponent />} />
      {updateRequire && <UpdateDialog t={t} />}
      <HomeNavigator />
    </>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    notificationFeed: state.notificationFeed,
  };
};

export default connect(mapStateToProps)(HomeScreen);