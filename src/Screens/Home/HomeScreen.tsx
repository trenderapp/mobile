import React, { useEffect, useState } from 'react';
import { RootStackParamList, getAppInfo } from '../../Services';
import { useTranslation } from 'react-i18next';
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Appbar } from 'react-native-paper';
import { View } from 'react-native';

import UpdateDialog from './UpdateDialog';
import HomeNavigator from './HomeNavigator';
import { CustomHeader, useTheme } from '../../Components/Container';
import styles from '../../Style/style';

const HomeScreen = () => {

  const { t } = useTranslation();
  const [updateRequire, setUpdateRequire] = useState(false);
  const { colors } = useTheme()
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList, 'DrawerNavigation'>>();

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
        <Appbar.Action color={colors.text_normal} icon="bell" onPress={() => navigation.navigate("NotificationScreen")} />
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
      <CustomHeader isHome={true} leftComponent={<CustomLeftComponent />} />
      {updateRequire && <UpdateDialog t={t} />}
      <HomeNavigator />
    </>
  );
};



export default HomeScreen;