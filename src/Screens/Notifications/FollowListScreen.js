import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { FlatList, RefreshControl } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { NotificationContainer, useClient, useTheme } from '../../Components/Container';
import { UserInfo } from "../../Components/Member";

const FollowListScreen = () => {

  const { colors } = useTheme();
  const { client } = useClient();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  const followList = async () => {
    setLoading(true);
    const request = await client.user.follow.unacceptedList();
    setLoading(false);
    if (request.error) return Toast.show({ text1: t(`errors.${request.error.code}`) });
    setList(request.data);
  }

  useEffect(() => {
    followList()
  }, [])

  const accept_follow = async (index) => {
    var new_array = [...list];
    if(new_array[index].accepted) return;

    const response = await client.user.follow.accept(new_array[index].follow_id);
    if(response.error) return Toast.show({ text1: t(`errors.${response.error.code}`) });

    new_array[index].accepted = true;
    setList(new_array);
  }

  return (
    <NotificationContainer>
      <FlatList
        style={{
          height: "100%"
        }}
        data={list}
        keyExtractor={item => item.user_id}
        renderItem={({ item, index }) => <UserInfo full_width informations={item} LeftComponent={<Button onPress={() => accept_follow(index)} mode='contained-tonal'>{item.accepted ? t("commons.accepted") : t("commons.waiting") }</Button>} />}
        refreshControl={<RefreshControl refreshing={loading} progressBackgroundColor={colors.bg_primary} tintColor={colors.fa_primary} colors={[colors.fa_primary, colors.fa_secondary, colors.fa_third]} onRefresh={() => followList()} />}
        ListEmptyComponent={() => <Text>{t("commons.nothing_display")}</Text>}
      />
    </NotificationContainer>
  );
};

export default FollowListScreen;