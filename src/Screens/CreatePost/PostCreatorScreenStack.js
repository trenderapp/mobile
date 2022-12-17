import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Modal, View } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';
import { ProgressBar, Text } from 'react-native-paper';

import { useClient, PostCreatorContainer, useNavigation } from '../../Components/Container';
import SvgElement from '../../Components/Elements/Svg';
import VideoPlayer from '../../Components/Posts/Views/Components/VideoPlayer';
import Carroussel from '../../Components/Posts/Views/Components/Carroussel';
import { axiosInstance } from '../../Services';
import { addPosts, PostsListContext } from '../../Context/PostsContext';
import TextAreaAutoComplete from '../../Components/Posts/Creator/TextAreaAutoComplete';
import BottomButtonPostCreator from '../../Components/Posts/Creator/BottomButton';

const PostCreatorScreenStack = ({ route: { params }}) => {

  const { attached_post_id, initFiles, initContent } = params;
  const [content, SetContent] = useState(initContent ?? "");
  const [files, setFiles] = useState([]);
  const [sending, setSending] = useState({
    send: false,
    progress: 0
  });
  const { client, token, user } = useClient();
  const { t } = useTranslation();
  const { dispatch } = useContext(PostsListContext);
  const navigation = useNavigation();

  useEffect(() => {
    if(Array.isArray(initFiles)) setFiles(initFiles);
    else setFiles([initFiles])
  }, [initFiles])

  const sendInfo = async () => {
    if (!content || content.length > 500) return Toast.show({
      text1: t(`errors.2001`)
    })
    if (sending.send) return Toast.show({
      text1: t(`errors.sending_form`)
    })

    let data = { content: content };

    if (files.length > 0) {
      if (typeof window !== "undefined") {
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

    }

    const response = await client.post.create({ ...data, attached_post_id: attached_post_id });

    if (!response.data) {
      setSending({ send: false, progress: 0 })
      return Toast.show({
        text1: t(`errors.${response.error.code}`)
      })
    }

    if(response.data && !attached_post_id) dispatch(addPosts({ ...response?.data, from: { ...user } }));

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
        maxFiles: target !== "photo" ? 1 : 8,
        multiple: target !== "photo" ? false : true,
        mediaType: target
      })

      if (target === "photo") {
        if (res.length > 8) {
          Toast.show({
            text1: t(`errors.9002`)
          })
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

        return setFiles(result);
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

        return setFiles(result);
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
      <PostCreatorContainer onSave={() => sendInfo()} changeVisibilty={() => navigation.goBack()} >
        {sending.progress > 0 && <ProgressBar progress={sending.progress} />}
        <KeyboardAvoidingView behavior={Platform.OS === "ios" && "padding"} style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <TextAreaAutoComplete
            value={content}
            setValue={(text) => SetContent(text)} />
          <View>
            {
              files.length > 0 && files[0]?.type.startsWith("video") && <SvgElement size={22} onPress={() => setFiles([])} name={"circle-close"} />
            }
            {
              files.length > 0 ? files[0]?.type.startsWith("video") ? <VideoPlayer creator uri={files[0].uri} /> : files[0].type.startsWith("image") ? <Carroussel changeList={deleteImage} creator={files} /> : <Text>{files.length}</Text> : null
            }
            <BottomButtonPostCreator setFiles={(info) => setFiles([ ...files, info])} setCameraVisible={() => navigation.replace("CameraScreen", {
              ...params,
              initContent: content,
              initFiles: files
            })} addFiles={addFiles} />
          </View>
        </KeyboardAvoidingView>
      </PostCreatorContainer>
  );
};

export default PostCreatorScreenStack;