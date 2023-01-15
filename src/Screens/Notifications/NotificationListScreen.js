import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { FlatList, RefreshControl } from 'react-native';
import { Text } from 'react-native-paper';
import { useClient, useTheme } from '../../Components/Container';
import { useIsFocused } from '@react-navigation/native';
import DisplayNotifications from '../../Components/Notifications/DisplayNotifications';

const NoficationListScreen = () => {

  const { colors } = useTheme();
  const { client } = useClient();
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  const notificationList = async () => {
    setLoading(true);
    const request = await client.notification.fetch({
      skip: list.length
    });
    setLoading(false);
    if (request.error) return Toast.show({ text1: t(`errors.${request.error.code}`) });
    setList([...list, ...request.data]);
  }

  useEffect(() => {
    notificationList()
  }, [isFocused])

  const RenderItem = ({ item }) => (
    <DisplayNotifications info={item} />
  )


  return (
      <FlatList
        style={{
          height: "100%"
        }}
        data={list}
        keyExtractor={item => item.notification_id}
        renderItem={({ item }) => <RenderItem item={item} />}
        refreshControl={<RefreshControl refreshing={loading} progressBackgroundColor={colors.bg_primary} tintColor={colors.fa_primary} colors={[colors.fa_primary, colors.fa_secondary, colors.fa_third]} onRefresh={() => notificationList()} />}
        ListEmptyComponent={() => <Text style={{ padding: 5 }}>{t("notification.no_trends_interactions")}</Text>}
      />
  );
};

export default NoficationListScreen;