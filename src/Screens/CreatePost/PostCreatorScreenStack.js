import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';
import { ProgressBar, Chip, Text, Button } from 'react-native-paper';
import dayjs from 'dayjs';
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { trendsCategories } from 'trender-client';

import { useClient, PostCreatorContainer, useNavigation, useTheme } from '../../Components/Container';
import { axiosInstance } from '../../Services';
import TextAreaAutoComplete from '../../Components/Posts/Creator/TextAreaAutoComplete';
import BottomButtonPostCreator from '../../Components/Posts/Creator/BottomButton';
import { addMainCreatedTrends } from '../../Redux/mainFeed/action';
import { premiumAdvantages } from '../../Services/premiumAdvantages';
import styles, { full_width } from '../../Style/style';
import { Avatar, Username } from '../../Components/Member';
import CreatorVideoDisplay from '../../Components/Posts/Creator/CreatorVideoDisplay';
import CreatorImageDisplay from '../../Components/Posts/Creator/CreatorImageDisplay';
import DisplayAttachedPost from '../../Components/Posts/Creator/DisplayAttachedPost';
import DisplaySharedPost from '../../Components/Posts/Creator/DisplaySharedPost';
import { BottomModal } from '../../Other';

const PostCreatorScreenStack = ({ route: { params } }) => {

  const { attached_post, shared_post, initFiles, initContent } = params;
  const [content, SetContent] = useState(initContent ?? "");
  const [files, setFiles] = useState([]);
  const [options, setOptions] = useState({
    paid: false
  })
  const [modalVisible, setModalVisible] = useState(false);
  const [sending, setSending] = useState({
    send: false,
    progress: 0
  });
  const { client, token, user } = useClient();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const advantages = premiumAdvantages(user?.premium_type ?? 0, user.flags ?? 0)
  const [categories, setCategories] = useState(trendsCategories);

  const memoizedFiles = useMemo(() => files, [files]);

  useEffect(() => {
    if (Array.isArray(initFiles)) setFiles(initFiles);
    else setFiles([initFiles])
  }, [initFiles])

  useEffect(() => {
    setOptions({
      ...options,
      categories: categories.filter(c => c.selected).map(c => c.number)
    })
  }, [categories])

  const selectCategories = (x) => {
    let selectedCount = 0;

    // Compter le nombre de catégories sélectionnées
    const updatedCategories = categories.map((category, index) => {
      if (index === x) {
        // Inverser la sélection de la catégorie actuelle
        return { ...category, selected: !category.selected };
      } else if (category.selected) {
        selectedCount++;
        if (selectedCount > 1) {
          // Désélectionner les catégories supplémentaires si déjà 2 sélectionnées
          return { ...category, selected: false };
        }
      }
      return category;
    });

    setCategories(updatedCategories);
  };

  const CategoriesBox = ({ c }) => (
    <View style={{
      backgroundColor: colors.bg_primary,
      borderWidth: 1,
      borderRadius: 60,
      padding: 3,
      paddingLeft: 6,
      marginLeft: 5,
    }}>
      <Text variant="labelSmall" style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}>{t(`categories.${c}`)}</Text>
    </View>
  )

  const sendInfo = async () => {
    if (sending.send) return Toast.show({ text1: t(`errors.sending_form`) });
    if (!content) {
      if (files.length < 1 && !shared_post) return Toast.show({ text1: t(`errors.2001`) })
    }
    if (content && content.length > advantages.textLength()) return Toast.show({ text1: t(`errors.2001`) })
    setSending({ send: true, progress: 0 })

    let data = {
      content: content ?? "",
      ...options
    };

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

    const response = await client.post.create({ ...data, attached_post_id: attached_post?.post_id, shared_post_id: shared_post?.post_id });

    if (!response.data) {
      setSending({ send: false, progress: 0 })
      console.log(response);
      return Toast.show({ text1: t(`errors.${response.error.code}`) })
    }
    if (response.data) dispatch(addMainCreatedTrends({ 
      ...response?.data, 
      from: user,
      shared_user: shared_post?.from,
      shared_post: shared_post,
      shared_post_id: shared_post?.post_id,
      attached_post_id: attached_post?.post_id
    }));
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
          Toast.show({ text1: t(`errors.9002`) })
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
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView>
          {attached_post && <DisplayAttachedPost attached_post={attached_post} />}
          <View style={[styles.row, { width: full_width, padding: 10 }]}>
            <Avatar size={40} url={client.user.avatar(user.user_id, user.avatar)} />
            <View style={[styles.column, { justifyContent: "flex-start", alignItems: "flex-start" }]}>
              <Username
                created_at={dayjs().format()}
                user={user}
                lefComponent={<View style={styles.row}>
                  {options.paid ? <MaterialIcons style={{ marginLeft: 3 }} size={20} color={colors.color_green} name={`cash`} /> : null}
                </View>} />
            </View>
          </View>
          {options.categories ? <View style={styles.row}>{options.categories.map((c, idx) => <CategoriesBox key={idx} c={c} />)}</View> : null}
          <TextAreaAutoComplete autoFocus={true} value={content} maxLength={advantages.textLength()} setValue={(text) => SetContent(text)} />
          {shared_post && <DisplaySharedPost shared_post={shared_post} />}
        </ScrollView>
        <View style={{
          bottom: 0,
          marginLeft: -5,
          width: full_width
        }}>
          <FlatList
            horizontal={true}
            data={memoizedFiles}
            keyExtractor={(item, idx) => idx}
            scrollsToTop={true}
            renderItem={({ item, index }) => item?.type.startsWith("video") ? <CreatorVideoDisplay deleteImage={(i) => deleteImage(i)} index={index} uri={item.uri} /> : <CreatorImageDisplay deleteImage={(i) => deleteImage(i)} index={index} uri={item.uri} />}
          />
          <BottomButtonPostCreator setModalVisible={setModalVisible} content={content} maxLength={advantages.textLength()} setFiles={(info) => setFiles([...files, info])} setCameraVisible={() => navigation.replace("CameraScreen", {
            ...params,
            initContent: content,
            initFiles: files
          })} addFiles={addFiles} />
        </View>
        <BottomModal onSwipeComplete={() => setModalVisible(false)} dismiss={() => setModalVisible(false)} isVisible={modalVisible}>
          <View style={{ padding: 10 }}>
            <Text style={{ marginBottom: 5, textTransform: "capitalize" }} variant="titleMedium">{t(`filter.categories`)}</Text>
            <ScrollView style={{ maxHeight: 250, borderRadius: 12, backgroundColor: colors.bg_primary }} contentContainerStyle={[styles.row, { flexWrap: "wrap", padding: 10 }]}>
              {
                categories.map((item, idx) => (
                  <Chip
                    key={idx}
                    selected={item.selected}
                    onPress={() => selectCategories(item.number)}
                    compact
                    textStyle={{ textTransform: "capitalize" }}
                    style={{ marginLeft: 5, marginBottom: 5 }}
                    mode="flat">{t(`categories.${item.number}`)}</Chip>
                ))
              }
            </ScrollView>
          </View>
          {
            user.payout_enabled && (
              <Button
                mode='contained'
                onPress={() => setOptions({ ...options, paid: !options.paid })}
                theme={{ colors: { primary: colors[options.paid ? "warning_color" : "good_color"] } }}
                icon={`cash${options.paid ? "" : "-remove"}`}
              >{t(`posts.${options.paid ? "paying" : "free"}`)}</Button>
            )
          }
        </BottomModal>
      </KeyboardAvoidingView>
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