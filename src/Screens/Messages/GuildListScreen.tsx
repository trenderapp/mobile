import { useNavigation } from '@react-navigation/native';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { FAB } from 'react-native-paper';

import { CustomHeader, useTheme } from '../../Components/Container';
import GuildList from '../../Components/Messages/GuildList';
import { NavigationContextI } from '../../Components/Container/Navigation/NavigationContext';

const GuildListScreen = () => {

  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationContextI>()

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg_primary }}>
      <CustomHeader isHome={true} title={t("commons.messages") as string} />
      <View style={{ flex: 1 }}>
        <GuildList />
        <FAB
          icon='plus'
          onPress={() => navigation?.navigate("MessagesStack", {
            screen: "CreateGroupScreen"
          })}
          color={colors.bg_primary}
          variant='primary'
          style={{
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0,
            zIndex: 3,
            borderRadius: 60
          }}
        />
      </View>
    </View>
  );
};

export default memo(GuildListScreen);