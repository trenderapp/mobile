import React, { useContext, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { userFlags } from "trender-client";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message';

import styles from "../../../Style/style";
import { UserBadges } from "../../Member";
import { useClient, useNavigation, useTheme } from "../../Container";
import { Markdown } from "../../Elements/Text";
import { FollowButton } from "../../Elements/Buttons";
import DisplayPosts from "../../Posts/DisplayPost";
import SvgElement from "../../Elements/Svg";
import { Text } from "react-native-paper";
import { addDmGroup, DmGroupListContext } from "../../../Context/DmGuildListContext";
import ProfileUserModal from "./Modal/User";
import ProfileOwnerModal from "./Modal/Owner";
import FastImage from "react-native-fast-image";

function ProfileComponent({ nickname, pined, informations, setInfo }){

    const { t, i18n } = useTranslation('');
    const { colors } = useTheme();
    const { client, user } = useClient();
    const navigation = useNavigation();
    const { dispatch } = useContext(DmGroupListContext);
    const [modalVisible, setModalVisible] = useState(false);
    
    const follow = async () => {
        const response = await client.user.follow.create(informations.user_info.user_id);
        if(response.error) return Toast.show({
            text1: t(`errors.${response.error.code}`)
        })
        setInfo({ ...informations, following: true })
        Toast.show({
            text1: t("commons.success")
        })
    }

    const unfollow = async () => {
        const response = await client.user.follow.delete(informations.user_info.user_id);
        if(response.error) return Toast.show({
            text1: t(`errors.${response.error.code}`)
        })
        setInfo({ ...informations, following: false })
        Toast.show({
            text1: t("commons.success")
        })
    }

    const createDM = async () => {
        const response = await client.guild.create([informations.user_info.user_id]);
        if(response.error) return Toast.show({ text1: t(`errors.${response.error.code}`)});
        dispatch(addDmGroup([response.data]));
    
        setTimeout(() => {
            navigation.replace("MessagesStack" , {
                screen: "MessageScreen",
                params: response.data
              })
        }, 500)
    }

    return (
        <View style={{ borderBottomColor: colors.bg_secondary, borderBottomWidth: 1 }}>
            { informations.user_info.user_id !== user?.user_id && <ProfileUserModal modalVisible={modalVisible} setModalVisible={setModalVisible} informations={informations} /> }
            { informations.user_info.user_id === user?.user_id && <ProfileOwnerModal modalVisible={modalVisible} setModalVisible={setModalVisible} informations={informations} /> }
            <View>
                <View style={{ height: 100 }}>
                    {
                        informations.user_info?.banner ? <FastImage style={styles.banner_image} source={{ uri: `${client.user.banner(informations.user_info.user_id, informations.user_info.banner)}`, cache: FastImage.cacheControl.web }} /> : <View style={[styles.banner_image, { backgroundColor: informations.user_info.accent_color }]} />
                    }
                </View> 
                <View style={[{ padding: 5 }]}>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <FastImage style={[styles.pdp64, { marginTop: -30 }]} source={{
                            uri: `${client.user.avatar(informations.user_info.user_id, informations.user_info.avatar)}`,
                            cache: FastImage.cacheControl.web
                        }} />
                        <View style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center"
                        }}>
                            <SvgElement margin={15} onPress={() => setModalVisible(true)} size={22} name="ellipsis" />
                            { informations.user_info.user_id !== user?.user_id && !informations?.is_private && <SvgElement margin={15} onPress={() => createDM()} size={22} name="envelope" /> }
                            { informations.user_info.user_id === user?.user_id && <FollowButton onPress={() => navigation.push("ProfileEditScreen", { info: informations.user_info })} text={t("profile.edit")}/>}
                            { informations.user_info.user_id !== user?.user_id && informations?.following && <FollowButton onPress={() => unfollow()} text={t("profile.unfollow")} /> }
                            { informations.user_info.user_id !== user?.user_id && !informations?.following && <FollowButton onPress={() => follow()} text={t("profile.follow")} /> }
                        </View>
                    </View>
                    <View style={{ paddingTop: 10 }}>
                        <Text>{informations.user_info.username}</Text>
                        <View style={styles.row}>
                            <Text>@{informations.user_info.nickname} { client.user.flags(informations.user_info.flags).has(userFlags.TRENDER_EMPLOYEE) && <UserBadges url={client.user.badge("TRENDER_EMPLOYEE")} /> }</Text>
                            { informations.user_info.is_private && <SvgElement margin={5} size={18} name="lock" color={colors.text_normal} /> }
                        </View>
                    </View>
                    <View style={{ paddingTop: 5 }}>
                        <Markdown noBr content={informations?.user_info?.description ?? ""} />
                    </View>
                    <View style={{ paddingTop: 5 }}>
                        { informations?.user_info?.link ? <Text style={{ paddingBottom: 5, display: "flex", flexDirection: "row", alignItems: "center" }}><SvgElement size={16} name="link" /> <Markdown content={informations?.user_info?.link} /></Text> : null}
                        <Text>{t("profile.joined")} : {dayjs(informations.user_info.created_at).locale(i18n.language).format("MMMM YYYY")}</Text>
                        <View style={{ flexDirection: "row" }}>
                            <TouchableOpacity onPress={() => {
                                navigation.push('ProfileFollower', {
                                        type: "subscriptions",
                                        nickname: nickname
                                    })
                            }}>
                                <Text style={{ marginRight: 5 }}><Text style={{ fontWeight: "900" }}>{informations.subscriptions?.total ?? 0}</Text> {t("profile.subscriptions").toLocaleLowerCase()}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                navigation.push('ProfileFollower', {
                                        type: "subscribers",
                                        nickname: nickname
                                    })
                            }}>
                                <Text><Text style={{ fontWeight: "900" }}>{informations.subscribers?.total ?? 0}</Text> {t("profile.subscribers").toLocaleLowerCase()}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
            { pined && <DisplayPosts pined={pined} informations={pined} /> }
        </View>
    )
};

export default ProfileComponent;