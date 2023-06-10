import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';
import { ProgressBar } from 'react-native-paper';

import { useClient, PostCreatorContainer, useNavigation, useTheme } from '../../Components/Container';
import { axiosInstance } from '../../Services';
import TextAreaAutoComplete from '../../Components/Posts/Creator/TextAreaAutoComplete';
import BottomButtonPostCreator from '../../Components/Posts/Creator/BottomButton';
import { addMainCreatedTrends } from '../../Redux/mainFeed/action';
import { premiumAdvantages } from '../../Services/premiumAdvantages';
import styles, { full_width } from '../../Style/style';
import { Avatar, Username } from '../../Components/Member';
import dayjs from 'dayjs';
import CreatorVideoDisplay from '../../Components/Posts/Creator/CreatorVideoDisplay';
import CreatorImageDisplay from '../../Components/Posts/Creator/CreatorImageDisplay';

const PostCreatorScreenStack = ({ route: { params } }) => {

  const { attached_post_id, initFiles, initContent } = params;
  const [content, SetContent] = useState(initContent ?? "");
  const [files, setFiles] = useState([]);
  const [sending, setSending] = useState({
    send: false,
    progress: 0
  });
  const { colors } = useTheme();
  const { client, token, user } = useClient();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const advantages = premiumAdvantages(user?.premium_type ?? 0)

  useEffect(() => {
    if (Array.isArray(initFiles)) setFiles(initFiles);
    else setFiles([initFiles])
  }, [initFiles])

  const sendInfo = async () => {
    if (!content && files.length < 1) return Toast.show({ text1: t(`errors.2001`) })
    if (content && content.length > advantages.textLength()) return Toast.show({ text1: t(`errors.2001`) })
    if (sending.send) return Toast.show({ text1: t(`errors.sending_form`) })

    let data = { content: content ?? "" };

    if (files.length > 0) {
      var formdata = new FormData();

      files.forEach(a => formdata.append("posts", a))

      var config = {
        headers: {
          'content-type': 'multipart/form-data',
          "trendertokenapi": token
        },
        onUploadProgress: function (progressEvent) {
          setSending({ send: true, progress: progressEvent.loaded / progressEvent.total })
        },
        validateStatus: s => s < 501
      };

      const request = await axiosInstance.post("/upload?type=posts", formdata, config);
      const req_data = request.data;
      if (!req_data.data) {
        setSending({ send: false, progress: 0 })
        return Toast.show({
          text1: t(`errors.${req_data.error.code}`)
        })
      }
      data = { ...data, ...req_data.data }
    }

    const response = await client.post.create({ ...data, attached_post_id: attached_post_id });

    if (!response.data) {
      setSending({ send: false, progress: 0 })
      return Toast.show({
        text1: t(`errors.${response.error.code}`)
      })
    }

    if (response.data && !attached_post_id) dispatch(addMainCreatedTrends({ ...response?.data, from: { ...user } }));

    setSending({ send: false, progress: 0 })
    setFiles([])
    SetContent("")
    Toast.show({
      text1: t(`commons.success`)
    })
    navigation.goBack()
  }

  const addFiles = async (target) => {
    try {
      const res = await ImagePicker.openPicker({
        maxFiles: target !== "photo" ? 1 : 8 - files.length,
        multiple: target !== "photo" ? false : true,
        mediaType: target
      })

      if (target === "photo") {
        if (res.length > 8 - files.length) {
          Toast.show({ text1: t(`errors.9002`)})
          return;
        }
        const result = res.map((res) => {
          return {
            size: res.size,
            name: res.path.split('/')[res.path.split('/').length - 1],
            type: res.mime,
            uri: res.path
          }
        })

        return setFiles([...result, ...files]);
      } else {
        if (res.length > 1) {
          Toast.show({
            text1: t(`errors.9002`)
          })
          return;
        }
        const result = [{
          size: res.size,
          name: res.path.split('/')[res.path.split('/').length - 1],
          type: res.mime,
          uri: res.path
        }]

        return setFiles([...result]);
      }
    } catch (error) {
      return;
    }
  }

  const deleteImage = (i) => {
    let array = [...files]
    array.splice(i, 1);
    setFiles(array);
  }

  return (
    <PostCreatorContainer dontSend={content.length > advantages.textLength()} onSave={() => sendInfo()} changeVisibilty={() => navigation.goBack()} >
      {sending.progress > 0 && <ProgressBar progress={sending.progress} />}
      <View style={{ flex: 1 }} >
        <View>
          <View style={[styles.row, { width: full_width, padding: 10 }]}>
            <Avatar size={45} url={client.user.avatar(user.user_id, user.avatar)} />
            <View style={[styles.column, { justifyContent: "flex-start", alignItems: "flex-start" }]}>
              <Username created_at={dayjs().format()} user={user} />
            </View>
          </View>
          <TextAreaAutoComplete autoFocus={true} value={content} setValue={(text) => SetContent(text)} />
        </View>
        <View style={{
          position: "absolute",
          bottom: 0,
          width: full_width
        }}>
          <FlatList
            horizontal={true}
            data={files}
            keyExtractor={(item, idx) => idx}
            scrollsToTop={true}
            renderItem={({ item, index }) => item?.type.startsWith("video") ? <CreatorVideoDisplay deleteImage={(i) => deleteImage(i)} index={index} uri={item.uri} /> : <CreatorImageDisplay deleteImage={(i) => deleteImage(i)} index={index} uri={item.uri} />}
          />

          <BottomButtonPostCreator content={content} maxLength={advantages.textLength()} setFiles={(info) => setFiles([...files, info])} setCameraVisible={() => navigation.replace("CameraScreen", {
            ...params,
            initContent: content,
            initFiles: files
          })} addFiles={addFiles} />
        </View>
      </View>
    </PostCreatorContainer>
  );
};

const mapStateToProps = (state) => {
  return {
    mainFeed: state.mainFeed,
  };
};

const mapDispatchToProps = {
  addMainCreatedTrends
};


export default connect(mapStateToProps, mapDispatchToProps)(PostCreatorScreenStack);