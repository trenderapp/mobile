import { useNavigation } from '@react-navigation/native';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { FAB} from 'react-native-paper';

import { CustomHeader, useTheme } from '../../Components/Container';
import GuildList from '../../Components/Messages/GuildList';

const GuildListScreen = () => {

  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation()

  return (
    <View style={{flex: 1, backgroundColor: colors.bg_primary }}>
      <CustomHeader isHome={true} title={t("commons.messages")} />
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

export default memo(GuildListScreen);