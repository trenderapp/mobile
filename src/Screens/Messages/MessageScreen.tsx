import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Chat, MessageType, defaultTheme } from '../../Components/Chat'

import Toast from 'react-native-toast-message';
import { SafeBottomContainer, useClient, useTheme, useWebSocket } from '../../Components/Container';
import { MessageBox } from '../../Components/Messages/MessageBox';
import Client, { MessageInterface, webSocketRoutes } from 'trender-client';
import { guildI } from '../../Redux/guildList';
import MessageBoxHeader from '../../Components/Messages/MessageBoxHeader';
import dayjs from 'dayjs';
import { Text } from 'react-native-paper';
import { Loader } from '../../Other';

const formatMessages = (messages: MessageInterface.fetchMessageResponseInterface[], client: Client): MessageType.Any[] => messages.map(((m) => {
  return {
    author: {
      id: m.from.user_id,
      firstName: m.from.username,
      imageUrl: client.user.avatar(m.from.user_id, m.from.avatar)
    },
    id: m.message_id,
    status: m.status,
    text: m.content,
    type: "text",
    createdAt: dayjs(m.created_at).toDate().getTime()
  }
}))

const MessageScreen = ({ route }: any) => {

  const { colors } = useTheme();
  const { client, user } = useClient();
  const { t } = useTranslation();
  const { notification, sendMessage } = useWebSocket();
  const [pagination_key, setPaginationKey] = useState<string | undefined>(undefined)
  const [messages, setMessages] = useState<MessageType.Any[]>([])
  const [loadMessages, setLoadMessages] = useState(true);
  const [inWait, setInwait] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [messageInfo, setMessageInfo] = useState<MessageType.Text>();

  const { params }: { params: guildI } = route;

  const getMessages = async () => {
    setLoadMessages(true)
    const request = await client.message.fetch(params.guild_id);
    setLoadMessages(false)
    if (request.error || !request.data) return Toast.show({ text1: t(`errors.${request?.error?.code}`) as string });
    if (request.data.length < 1) return;
    setMessages(formatMessages(request.data, client))
    setPaginationKey(request.pagination_key)
    sendMessage({
      code: webSocketRoutes.READ_MESSAGE,
      data: {
        message_id: request.data[0].message_id,
        channel_id: params.guild_id
      }
    })
  }

  useEffect(() => {
    getMessages()
  }, [])

  useEffect(() => {    
    if (notification.code === webSocketRoutes.SEND_MESSAGE) {
      let data: any = notification.data;
      if (data.channel_id === params.guild_id) {
        setMessages([...formatMessages([notification.data], client), ...messages])
        sendMessage({
          code: webSocketRoutes.READ_MESSAGE,
          data: {
            message_id: data.message_id,
            channel_id: data.channel_id
          }
        })
      }
    } /*else if(notification.code === webSocketRoutes.START_TYPING) {
      if(typings.some(t => t.user_id === notification.data.from.user_id)) return;
      setTypings([...typings, notification.data.from])
    } else if(notification.code === webSocketRoutes.STOP_TYPING) {
      setTypings(typings.filter((t) => t.user_id !== notification.data.from.user_id))
    }*/
  }, [notification])

  const onBottom = async () => {
    const request = await client.message.fetch(params.guild_id, { pagination_key: pagination_key });
    if(request.data) {
      setMessages([...formatMessages(request.data, client), ...messages])
      setPaginationKey(request.pagination_key)
    }
  }

  const readMessage = (data: MessageInterface.fetchMessageResponseInterface) => {
    sendMessage({
      code: webSocketRoutes.READ_MESSAGE,
      data: {
        message_id: data.message_id,
        channel_id: data.channel_id
      }
    })
  }

  const sendMessageToChannel = async (message: MessageType.PartialText) => {
    if(inWait) return;
    setInwait(true);
    const request = await client.message.create(params.guild_id, { content: message.text });
    setInwait(false);
    if(request.error) return Toast.show({ text1: t(`errors.${request.error.code}`) as string});
    if(!request.data) return;
    setMessages([...formatMessages([request.data], client), ...messages])
  }

  const createAttachments = () => {
    console.log("pressed");
  }

  const enableModal = (message: MessageType.Text) => {
    setMessageInfo(message);
    setModalVisible(true);
  }

  const disableModal = () => {
    setModalVisible(false);
  }

  return (
    <SafeBottomContainer padding={0}>
      { messageInfo && <MessageBox info={messageInfo} modalVisible={modalVisible} setModalVisible={disableModal} /> }
      <MessageBoxHeader params={params} />
        <Chat
          onEndReached={() => onBottom()}
          sendButtonVisibilityMode='editing'
          emptyState={() => loadMessages ? <Loader /> : <Text>{t("messages.no_messages")}</Text>}
          // onAttachmentPress={() => createAttachments()}
          showUserAvatars={true}
          showUserNames={true}
          enableAnimation={true}
          theme={{
            ...defaultTheme,
            colors: {
              ...defaultTheme.colors,
              primary: colors.bg_secondary,
              secondary: colors.bg_secondary,
              background: colors.bg_primary,
              inputBackground: colors.bg_secondary,
              inputText: colors.text_normal,
              error: colors.color_red,
              userAvatarNameColors: [
                colors.text_muted
              ]
            },
            fonts: {
              ...defaultTheme.fonts,
              sentMessageBodyTextStyle: {
                ...defaultTheme.fonts.sentMessageBodyTextStyle,
                color: colors.text_normal,
              },
              sentMessageCaptionTextStyle: {
                ...defaultTheme.fonts.sentMessageCaptionTextStyle,
                color: colors.text_normal,
              },
              receivedMessageBodyTextStyle: {
                ...defaultTheme.fonts.receivedMessageBodyTextStyle,
                color: colors.text_normal
              }
            }
          }}
          onMessagePress={(message) => enableModal(message as MessageType.Text)}
          messages={messages}
          onSendPress={(message) => sendMessageToChannel(message)}
          user={{
            id: user.user_id,
            imageUrl: client.user.avatar(user.user_id, user.avatar)
          }}
        />
      </SafeBottomContainer>
  );
};

export default memo(MessageScreen);