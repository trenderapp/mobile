import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FlatList, View, KeyboardAvoidingView, Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { Appbar, Button, Text } from 'react-native-paper';
import { SafeBottomContainer, useClient, useTheme, useWebSocket } from '../../Components/Container';
import MessageTextInput from '../../Components/Messages/MessageTextInput';
import { addDmMessages, addOneDmMessages, DmMessagesListContext, initDmMessages, resetDmMessages } from '../../Context/DmMessages';
import { full_width } from '../../Style/style';
import { FakeMessageBox, MessageBox } from '../../Components/Messages/MessageBox';
import { DmGroupListContext, initDmGroup, modifyDmGroup } from '../../Context/DmGuildListContext';
import { Avatar } from '../../Components/Member';
import { webSocketRoutes } from 'trender-client';
import { changeElementPlaceArray } from '../../Services';

const MessageScreen = ({ route }) => {

  const { colors } = useTheme();
  const { client } = useClient();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { notification, sendMessage } = useWebSocket();

  const [attachments, setAttachments] = useState([]);
  const [content, setContent] = useState("");
  const [inwait, setInwait] = useState(false);
  const [scrollTop, setScrollToTop] = useState(true);
  const [typings, setTypings] = useState([]);
  const { messages, dispatch } = useContext(DmMessagesListContext);
  const DmGroupList = useContext(DmGroupListContext);
  const { params } = route;

  const getMessages = async (init = false) => {
    const request = await client.message.fetch(params.guild_id, { skip: messages.length });
    if(request.error) return Toast.show({ text1: t(`errors.${request.error.code}`)});
    dispatch(init ? initDmMessages(request.data) : addDmMessages(request.data));
    if(request.data.length < 1) return;
    DmGroupList.changeLastMessageUnreads(params.guild_id, request.data[0].message_id, true)
    sendMessage({
      code: webSocketRoutes.READ_MESSAGE,
      data: {
        message_id: request.data[0].message_id, 
        channel_id: params.guild_id
      }
    })
  }
  
  useEffect(() => {
    dispatch(resetDmMessages())
    getMessages(true)
  }, [])

  useEffect(() => {
    if(notification.code === webSocketRoutes.SEND_MESSAGE) {
      let data = notification.data;
      if(data.channel_id === params.guild_id) {
        dispatch(addOneDmMessages(data));
        sendMessage({
          code: webSocketRoutes.READ_MESSAGE,
          data: {
            message_id: data.message_id, 
            channel_id: data.channel_id
          }
        })
        DmGroupList.changeLastMessageUnreads(data.channel_id, data.message_id, true)
      }
    } else if(notification.code === webSocketRoutes.START_TYPING) {
      if(typings.some(t => t.user_id === notification.data.from.user_id)) return;
      setTypings([...typings, notification.data.from])
    } else if(notification.code === webSocketRoutes.STOP_TYPING) {
      setTypings(typings.filter((t) => t.user_id !== notification.data.from.user_id))
    }
}, [notification])


const readMessage = (data) => {
  DmGroupList.dispatch(modifyDmGroup({ guild_id: params.guild_id, content: content, created_at: data.created_at, message_id: data.message_id }))
  sendMessage({
    code: webSocketRoutes.READ_MESSAGE,
    data: {
      message_id: data.message_id, 
      channel_id: data.channel_id
    }
  })
  DmGroupList.changeLastMessageUnreads(data.channel_id, data.message_id);
  setContent("")
}
  const sendMessageToChannel = async () => {
    setInwait(true)
    const request = await client.message.create(params.guild_id, {
      content: content
    })
    if(request.error) return Toast.show({ text1: t(`errors.${request.error.code}`)});
    setInwait(false);
    dispatch(addOneDmMessages(request.data));
    const idx = DmGroupList.groups.findIndex(g => g.guild_id === params.guild_id);
    if(idx < 1) return readMessage(request.data);
    DmGroupList.dispatch(initDmGroup(changeElementPlaceArray(DmGroupList.groups, 0, idx)));
    readMessage(request.data)
  }

  const createAttachments = () => {
    console.log("pressed");
  }

  return (
      <SafeBottomContainer>
        <Appbar.Header style={{ width: full_width, backgroundColor: colors.bg_primary, flexDirection: "row" , alignContent: "center", borderBottomColor: colors.bg_secondary, borderBottomWidth: 0.5 }}>
          <Appbar.BackAction color={colors.text_normal} onPress={() => navigation ? navigation.goBack() : null} />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Avatar url={client.user.avatar(params.users[0]?.user_id, params.users[0]?.avatar)} />
            <View>
              <Text numberOfLines={1} style={{ fontSize: 16, fontWeight:'700', marginLeft: 5 }}>{`${params.users.map(u => u.username).join(", ")}`}</Text>
              { params.type === 0 && <Text style={{ fontSize: 12, fontWeight:'700', marginLeft: 5 }}>{`@${params.users[0].nickname}`}</Text> }
            </View>
          </View>
        </Appbar.Header>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" && "padding"} style={{ flex: 1 }}>
          <FlatList
            inverted={true}
            data={messages}
            scrollsToTop={scrollTop}
            onScrollToTop={() => setScrollToTop(false)}
            renderItem={({ item }) => <MessageBox info={item} />}
            keyExtractor={(item, index) => item?.message_id ?? index}
            ListEmptyComponent={<Text>{t("commons.nothing_display")}</Text>}
            ListFooterComponent={<Button onPress={() => getMessages()}>{t("messages.load_more_messages")}</Button>}
          />
          { inwait && <FakeMessageBox content={content} /> }
          { typings.length > 0 && <View style={{ width: full_width,
                                                  padding: 5,
                                                  backgroundColor: colors.bg_secondary
              }}><Text>... {typings.map(u => u.username).join(", ")}</Text></View>}
          <MessageTextInput channel_id={params.guild_id} onAttachment={() => createAttachments()} value={content} setValue={setContent} displaySend={content.length > 0 || attachments.length > 0} onSubmit={() => sendMessageToChannel()} />
          </KeyboardAvoidingView>

      </SafeBottomContainer>
  );
};

export default MessageScreen;