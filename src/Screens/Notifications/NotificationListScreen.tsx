import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { FlatList, RefreshControl } from 'react-native';
import { Text } from 'react-native-paper';
import { NotificationInterface } from 'trender-client';
import { useIsFocused } from '@react-navigation/native';
import { useClient, useTheme } from '../../Components/Container';
import DisplayNotifications from '../../Components/Notifications/DisplayNotifications';

const NoficationListScreen = () => {

  const { colors } = useTheme();
  const { client } = useClient();
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<NotificationInterface.notificationFetchResponseSchema[]>([]);
  const [paginationKey, setPaginationKey] = useState<undefined | string>(undefined)

  const notificationList = async (refresh: boolean) => {
    setLoading(true);
    const request = await client.notification.fetch({ pagination_key: refresh ? undefined : paginationKey });
    setLoading(false);
    if(request.error) return Toast.show({ text1: t(`errors.${request.error.code}`) as string });
    if(!request.data) return;
    console.log(request.data);
    
    if(request.data.length < 1) return;
    setPaginationKey(request?.pagination_key);
    refresh ? setList(request.data) : setList([...list, ...request.data]);
  }

  useEffect(() => {
    notificationList(false)
  }, [isFocused])
  
  const renderItem = ({ item }: { item: NotificationInterface.notificationFetchResponseSchema }) => (
    <DisplayNotifications info={item} />
  )

  const memoizedValue = useMemo(() => renderItem, [list]);

  return (
      <FlatList
        style={{
          height: "100%"
        }}
        data={list}
        keyExtractor={item => item.notification_id}
        renderItem={memoizedValue}
        refreshControl={<RefreshControl refreshing={loading} progressBackgroundColor={colors.bg_primary} tintColor={colors.fa_primary} colors={[colors.fa_primary, colors.fa_secondary, colors.fa_third]} onRefresh={() => notificationList(true)} />}
        ListEmptyComponent={() => <Text style={{ padding: 5 }}>{t("notification.no_trends_interactions")}</Text>}
      />
  );
};

export default NoficationListScreen;