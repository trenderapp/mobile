import React from 'react';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Title, Caption, Drawer } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { styles as globalStyles } from '../../../Style/style';
import useClient from '../Client/useClient';
import useTheme from '../Theme/useTheme';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';

export default function DrawerContent(navigation: any) {

  const { client, user } = useClient();
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <DrawerContentScrollView style={{ flex: 1, backgroundColor: colors.bg_secondary, marginTop: -5 }}>
      <View style={{ height: 100 }}>
        {
          user?.banner ?
            <FastImage style={[globalStyles.banner_image_drawer, { backgroundColor: colors.bg_secondary }]} source={{ uri: `${client.user.banner(user.user_id, user.banner)}` }} />
            : <View style={[globalStyles.banner_image, { backgroundColor: user.accent_color }]} />
        }
      </View>
      <View style={{ paddingLeft: 5 }}>
        <FastImage style={[globalStyles.pdp50, { marginTop: -30, backgroundColor: colors.bg_secondary }]} source={{ uri: `${client.user.avatar(user?.user_id, user?.avatar)}` }} />
        <Title style={{ marginTop: 5, fontWeight: 'bold' }}>{user?.username}</Title>
        <Caption style={styles.caption}>@{user?.nickname}</Caption>
      </View>
      <View>
        <Drawer.Section style={styles.drawerSection}>
          <Drawer.Item icon="plus-circle" label={t("commons.create")} onPress={() => navigation.navigate("CreateStack", {
            screen: "PostCreatorScreen",
            params: {
              attached_post_id: "",
              initFiles: [],
              initContent: ""
            }
          })} />
          <Drawer.Item icon="account" label={t("commons.profile")} onPress={() => navigation.navigate("ProfileStack", {
            screen: "ProfileScreen",
            params: {
              nickname: user?.nickname
            }
          })} />
          <Drawer.Item icon="cog" label={t("commons.settings")} onPress={() => navigation.navigate("SettingsStack")} />
        </Drawer.Section>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 10,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});