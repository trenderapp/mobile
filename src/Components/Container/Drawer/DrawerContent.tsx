import React, { useEffect, useState } from 'react';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Title, Caption, Drawer, Modal, Portal, Text, List } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { styles as globalStyles } from '../../../Style/style';
import useClient from '../Client/useClient';
import useTheme from '../Theme/useTheme';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import { MeInterface } from 'trender-client';
import { getAllUsers } from '../../../Services/Realm/userDatabase';
import { useRealm } from '@realm/react';
import { Avatar } from '../../Member';
import { setStorage } from '../../../Services/storage';

export default function DrawerContent(navigation: any) {

  const realm = useRealm();
  const { client, user, setValue, token } = useClient();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [users, setUsers] = useState<MeInterface.myInformationInterface[]>([user]);

  useEffect(() => {
    const all_users = getAllUsers(realm) as unknown;
    setUsers(all_users as MeInterface.myInformationInterface[]);
  }, [realm])

  const addAccount = () => setValue({ client: client, token: token, user: user, state: "logout" });

  const changeAccount = (user_info: MeInterface.myInformationInterface) => {
    setStorage("user_info", user_info);
    setValue({ client: client, token: token, user: user, state: "switch_user" });
  }

  return (
    <DrawerContentScrollView alwaysBounceVertical={false} contentContainerStyle={{
      flex: 1,
      flexDirection: "column", justifyContent: "space-between"
    }} style={{ flex: 1, backgroundColor: colors.bg_secondary, marginTop: -5, }}>

      <View>
        <View style={{ height: 90 }}>
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
            <Drawer.Item icon="bookmark" label={t("posts.bookmarks")} onPress={() => navigation.navigate("PostStack", {
              screen: "Bookmarks",
              params: {
                target_id: user?.user_id
              }
            })} />
            <Drawer.Item icon="cog" label={t("commons.settings")} onPress={() => navigation.navigate("SettingsStack")} />
          </Drawer.Section>
        </View>
      </View>
      <View>
        <List.Accordion
          theme={{
            colors: {
              background: colors.bg_secondary
            }
          }}
          title={t("commons.switch_account")}
          left={props => <List.Icon {...props} icon="account-switch" />}>
            {
              users.filter(u => u.user_id !== user.user_id).map((u, idx) => (
                <List.Item key={idx} onPress={() => changeAccount(u)} left={() => <Avatar size={30} marginLeft={15} marginRight={0} url={client.user.avatar(u?.user_id, u?.avatar)} />} title={u.username} />
              ))
            }
            <List.Item onPress={() => addAccount()} left={props => <List.Icon {...props} icon="account-plus" />} title={t("commons.add_account")} />
        </List.Accordion>
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