import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import { Pressable, ScrollView, View, SafeAreaView } from "react-native";
import styles, { full_width }from "../../../Style/style";
import { useNavigation } from "@react-navigation/native";
import { Appbar, TextInput, ProgressBar, Button, IconButton } from "react-native-paper";
import useTheme from "../../Container/Theme/useTheme";
import { Text } from "react-native-paper";
import { useClient } from "../../Container";
import { axiosInstance, getPermissions } from "../../../Services";
import FastImage from "react-native-fast-image";

function ProfileEditScreen({ route }) {

    const navigation = useNavigation();
    const { info } = route.params;
    const { t } = useTranslation('');
    const { colors } = useTheme();

    const { client, token, setValue, user } = useClient();
    const old_client = useClient();

    const [modif, setModif] = useState(info);
    const [profilePictures, setProfilePicture] = useState({
        banner:  `${client.user.banner(info.user_id, info.banner)}`,
        avatar: `${client.user.avatar(info.user_id, info.avatar)}`
    });

    const [sending, setSending] = useState({
        send: false,
        progress: 0
    })
    
    useEffect(() => {
        getPermissions();
    }, [])
    
    const changePictures = async (target) => {

        const res = await ImagePicker.openPicker({
            width: target === "avatar" ? 500 : undefined,
            height: target === "avatar" ? 500 : undefined,
            cropping: true,
            multiple: false,
            mediaType: "photo"
        })

        const file = {
            size: res.size,
            name: res.path.split('/')[res.path.split('/').length-1],
            type: res.mime,
            uri: res.path
        }

        if(target === "banner") {
            setModif({ ...modif, banner: file })
            setProfilePicture({ ...profilePictures, banner: file.uri })
        } else {
            setModif({ ...modif, avatar: file })
            setProfilePicture({...profilePictures, avatar: file.uri })
        }

        return;
    }

    const send_info = async () => {

        if(sending.send) return;

        let data = {
            avatar: info.avatar === modif.avatar ? undefined : modif.avatar,
            banner: info.banner === modif.banner ? undefined : modif.banner,
            allow_dm: modif.allow_dm,
            is_private: modif.is_private,
            link: modif?.link ?? "",
            description: modif.description ?  modif.description.substring(0, 120) : "",
            nickname: modif.nickname,
            username: modif.username
        }

        if(data?.nickname?.length > 30 || data?.nickname?.length < 3 || data?.username?.length > 30 || data?.username?.length < 3 || data?.description?.length > 120) return Toast.show({
            text1: t(`errors.verify_fields`)
        })
        
        setSending({
            send: true,
            progress: 90
        })
        if(data?.avatar) {
            if(typeof window !== "undefined") {
                var formdata = new FormData();

                formdata.append("avatar", modif.avatar);
    
                var config = {
                    headers: {
                        'content-type': 'multipart/form-data',
                        "trendertokenapi": token
                    },
                    onUploadProgress: function(progressEvent) {
                        var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total );
                        setSending({ send: true, progress: percentCompleted })
                    }
                }
    
                const request = await axiosInstance.post(`/upload?type=avatar`, formdata, config);
                const response = request.data;
                if(response?.error) return Toast.show({
                    text1: t(`errors.${response.error.code}`)
                })

                data = { ...data, avatar: response.data };
                setSending({ send: false, progress: 0 });
            }
        }

        if(data?.banner) {
            
            if(typeof window !== "undefined") {
                var formdata = new FormData();

                formdata.append("banner", modif.banner);
    
                var config = {
                    headers: {
                        'content-type': 'multipart/form-data',
                        "trendertokenapi": token
                    },
                    onUploadProgress: function(progressEvent) {
                        var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total );
                        setSending({ send: true, progress: percentCompleted })
                    }
                }
    
                const request = await axiosInstance.post(`/upload?type=banner`, formdata, config);
                const response = request.data;
                if(response?.error) return Toast.show({
                    text1: t(`errors.${response.error.code}`)
                })
                data = { ...data, banner: response.data };
                setSending({ send: false, progress: 0 });
            }
        }

        const response = await client.user.edit(data);

        setSending({ send: false, progress: 0 });

        if(response?.error) return Toast.show({
            text1: t(`errors.${response.error.code}`)
        })

        setValue({ ...old_client, user: { ...user, ...response.data } });
        Toast.show({
            text1: t("commons.success")
        })
    }
    return (
        <SafeAreaView style={{ backgroundColor: colors.bg_primary, height: "100%" }}>
            <Appbar.Header style={{ width: full_width, backgroundColor: colors.bg_primary, flexDirection: "row", justifyContent: "space-between" }}>
              <Appbar.BackAction onPress={() => navigation.goBack()} />  
              <Text style={styles.text_title}>{t("profile.edit")}</Text>
              <View style={[styles.row, { justifyContent: "flex-end" }]}>
                <IconButton icon="content-save" disabled={sending.send} onPress={() => send_info()} />
              </View>
            </Appbar.Header>
            { sending.send && <ProgressBar progress={sending.progress} color={colors.badge_color} /> }
            <ScrollView>
                <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
                    <View>
                        <View style={{ height: 100 }}>
                            <Pressable style={[styles.banner_image]} onPress={() => changePictures("banner")}>
                            {
                                modif.banner ? <FastImage style={styles.banner_image} source={{ uri: `${profilePictures.banner}` }} /> : <View style={[styles.banner_image, { backgroundColor: info.accent_color }]} />   
                            }
                            </Pressable>
                        </View>
                        <View style={[{ padding: 5 }]}>
                            <Pressable onPress={() => changePictures("avatar")}>
                                <FastImage style={[styles.pdp64, { marginTop: -30, zIndex: 3 }]} source={{ uri: `${profilePictures.avatar}` }} />
                            </Pressable>
                            <View style={styles.EditSectionStyle}>
                                <TextInput
                                    label={`${t("profile.username")}`}
                                    style={{ ...styles.inputStyle, backgroundColor: colors.bg_secondary, borderColor: colors.bg_secondary }}
                                    returnKeyType="next"
                                    value={modif.username}
                                    onChangeText={(text) => setModif({ ...modif, username: text })}
                                />
                            </View>
                            <View style={styles.EditSectionStyle}>
                                <TextInput
                                    label={`${t("profile.nickname")}`}
                                    style={{ ...styles.inputStyle, backgroundColor: colors.bg_secondary, borderColor: colors.bg_secondary }}
                                    returnKeyType="next"
                                    value={modif.nickname}
                                    onChangeText={(text) => setModif({ ...modif, nickname: text })}
                                />
                            </View>
                            <View style={styles.EditSectionStyle}>
                                <TextInput
                                    label={`${t("profile.link")}`}
                                    style={{ ...styles.inputStyle, backgroundColor: colors.bg_secondary, borderColor: colors.bg_secondary }}
                                    returnKeyType="next"
                                    value={modif?.link ?? ""}
                                    onChangeText={(text) => setModif({ ...modif, link: text })}
                                />
                            </View>
                            <View style={styles.EditSectionStyle}>
                                <TextInput
                                    label={`${t("profile.bio", { length: modif?.description?.length ?? 0 })}`}
                                    style={{ ...styles.multilineInputStyle, backgroundColor: colors.bg_secondary, borderColor: colors.bg_secondary }}
                                    multiline
                                    returnKeyType="next"
                                    value={modif.description}
                                    onChangeText={(text) => setModif({ ...modif, description: text })}
                                />
                            </View>
                            <Button style={{ alignItems: "flex-start" }} onPress={() => setModif({ ...modif, is_private: !modif.is_private })} icon={modif.is_private ? "account-lock" : "account"}>{t("profile.account", { type: modif.is_private ? t("profile.private") : t("profile.public") })}</Button>
                            <Button style={{ alignItems: "flex-start" }} onPress={() => setModif({ ...modif, allow_dm: !modif.allow_dm })} icon={modif.allow_dm ? "email" : "email-lock"} >{t("profile.private_messages")}</Button>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ProfileEditScreen;