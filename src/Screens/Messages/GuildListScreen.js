import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity } from 'react-native';
import { Appbar, FAB , Text} from 'react-native-paper';
import FastImage from 'react-native-fast-image';

import { useClient, useTheme } from '../../Components/Container';
import GuildList from '../../Components/Messages/GuildList';
import styles, { full_width } from '../../Style/style';
import { Avatar } from '../../Components/Member';

const GuildListScreen = () => {

  const { colors } = useTheme();
  const { client, user } = useClient();
  const { t } = useTranslation();
  const navigation = useNavigation()

  return (
    <View style={{flex: 1, backgroundColor: colors.bg_primary }}>
      <Appbar.Header style={{ width: full_width, backgroundColor: colors.bg_primary, flexDirection: "row" , alignContent: "center" }}>
        <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate("ProfileStack" , {
            screen: "ProfileScreen",
            params: {
              nickname: user.nickname
            }
          })}>
          <Avatar marginLeft={5} marginRight={5} url={client.user.avatar(user?.user_id, user?.avatar)} />
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight:'700', marginLeft: 5 }}>{t("commons.messages")}</Text>
      </Appbar.Header>
      <View style={{ flex: 1 }}>
          <GuildList />
          <FAB
            icon={'plus'}
            onPress={() => navigation.navigate("MessagesStack" , {
              screen: "CreateGroupScreen"
            })}
            visible={true}
            animateFrom={'right'}
            mode="flat"
            style={{
              bottom: 10,
              right: 10,
              position: 'absolute',
              backgroundColor: colors.bg_secondary,
              borderRadius: 60 / 2
            }}
          />
      </View>
    </View>
  );
};

export default GuildListScreen;