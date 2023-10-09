import React, { memo, useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Text } from 'react-native-paper';
import { GlobalInterface, userFlags } from "trender-client";
import UserPermissions from "trender-client/Permissions/UserPermissions";
import { useNavigation as useNativeNavigation } from '@react-navigation/native';
import { CustomHeader, useClient, useTheme, useNavigation } from "../../Components/Container";
import { SearchBar } from "../../Components/Elements/Input";
import styles from "../../Style/style";
import { BottomModal } from "../../Other";
import SearchFilter from "../Home/SearchFilter";
import { Avatar } from "../../Components/Member";
import SvgElement from "../../Components/Elements/Svg";
import { navigationProps } from "../../Services";

function SearchScreen() {

    const { colors } = useTheme();
    const [text, setText] = useState("");
    const { t } = useTranslation();
    const { client } = useClient();
    const [users, setUsers] = useState<GlobalInterface.userInfo[] | undefined>(undefined);
    const [bestUsers, setBestUsers] = useState<GlobalInterface.userInfo[] | undefined>(undefined);
    const [pagination_key, setPaginationKey] = useState<string | undefined>(undefined);
    const [loaderF, setLoaderF] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();
    const nativeNavigation = useNativeNavigation<navigationProps>();

    async function getBestUsers() {
        setLoaderF(true);
        const response = await client.explore.bestUsers({
            pagination_key: pagination_key
        });
        setLoaderF(false);
        if (response.error || !response.data) return;
        setBestUsers(response.data);
        setPaginationKey(response.pagination_key);
    }

    useEffect(() => {
        async function getData() {
            const response = await client.user.search(text);
            if (response.error || !response.data) return;
            setUsers(response.data);
        }

        if (text?.length < 1) {
            getBestUsers()
            setUsers(undefined)
        }
        if (text?.length > 2) getData();
    }, [text])

    useEffect(() => {
        getBestUsers()
    }, [])

    const renderItem = useCallback(({ item }: { item: GlobalInterface.userInfo, index?: number }) => {

        const flags = new UserPermissions(item?.flags);

        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => navigation.push('ProfileStack', {
                    screen: "ProfileScreen",
                    params: {
                        nickname: item.nickname
                    }
                })}
                style={[
                    styles.row,
                    {
                        backgroundColor: colors.bg_secondary,
                        borderRadius: 12,
                        padding: 10,
                        margin: 5
                    }
                ]}>
                { /** typeof index !== "undefined" ? <View style={{ backgroundColor: colors.bg_primary, borderRadius: 60, marginRight: 5, width: 30, height: 30, flexDirection: "row", justifyContent: "center", alignItems: "center" }}><Text>{`${index+1}`}</Text></View> : null */}
                <Avatar size={33} url={client.user.avatar(item.user_id, item.avatar)} />
                <Text style={[{ maxWidth: "100%", overflow: "hidden" }]}>{item.username}</Text>
                {item.is_private && <SvgElement margin={-5} size={15} name="lock" color={colors.text_normal} />}
                {flags.has(userFlags.VERIFIED_USER) && <SvgElement name="verified" size={15} />}
            </TouchableOpacity>
        )
    }, [])


    const RandomUsers = () => (
        <FlatList
            data={bestUsers}
            keyExtractor={(item) => item.user_id}
            renderItem={renderItem}
            onScrollAnimationEnd={() => getBestUsers()}
            refreshControl={<RefreshControl
                refreshing={loaderF}
                progressBackgroundColor={colors.bg_primary}
                tintColor={colors.fa_primary}
                colors={[colors.fa_primary, colors.fa_secondary, colors.fa_third]}
                onRefresh={() => getBestUsers()}
            />} />
    )

    return (
        <View style={{ flex: 1, backgroundColor: colors.bg_primary }}>
            <CustomHeader isHome={false}>
                <View>
                    <SearchBar
                        /*inputProps={{
                            autoFocus: true
                        }}*/
                        onSearchPress={() => nativeNavigation?.navigate("PostStack", {
                            screen: "PostScreenSearch",
                            params: {
                                query: text
                            }
                        })}
                        placeholder={t("commons.search") + " ..."}
                        onChangeText={(txt) => setText(txt)}
                        value={text}
                        onClearPress={() => {
                            setText("")
                            setUsers(undefined)
                        }}
                    />
                </View>
            </CustomHeader>
            {
                /**
                 * <FAB
                icon="tune-variant"
                size='medium'
                color={colors.bg_primary}
                variant='primary'
                onPress={() => setModalVisible(true)}
                style={{
                    position: 'absolute',
                    margin: 16,
                    right: 0,
                    bottom: 0,
                    zIndex: 3,
                    borderRadius: 60
                }}
            />
                 */
            }
            <BottomModal onSwipeComplete={() => setModalVisible(false)} dismiss={() => setModalVisible(false)} isVisible={modalVisible}>
                <SearchFilter />
            </BottomModal>
            {users && users.length > 0 ?
                <FlatList data={users} keyExtractor={(item) => item.user_id} renderItem={renderItem} />
                : text.length > 2 ? <FlatList data={users} keyExtractor={(item) => item.user_id} renderItem={renderItem} /> : <RandomUsers />}
        </View>
    )
}

export default memo(SearchScreen);