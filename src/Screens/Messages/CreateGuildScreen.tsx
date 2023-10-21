import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, FlatList } from 'react-native';
import Toast from 'react-native-toast-message';
import { Appbar, Button, Chip, Divider, Text } from 'react-native-paper';
import { connect, useDispatch } from 'react-redux';

import { useClient, useTheme } from '../../Components/Container';
import styles, { full_width } from '../../Style/style';
import DisplayMember from '../../Components/Member/DisplayMember';
import { Avatar } from '../../Components/Member';
import { SearchBar } from '../../Components/Elements/Input';
import { userInfo } from 'trender-client/Managers/Interfaces/Global';
import { NavigationContextI } from '../../Components/Container/Navigation/NavigationContext';
import { addGuildList } from '../../Redux/guildList/action';
import { RootState } from '../../Redux';

const CreateGuildScreen = () => {

    const { colors } = useTheme();
    const { client } = useClient();
    const { t } = useTranslation();
    const navigation = useNavigation<NavigationContextI>()
    const [selected, setSelected] = useState<userInfo[]>([]);
    const dispatch = useDispatch();
    const [list, setList] = useState<userInfo[]>([]);
    const [text, setText] = useState("");
    const [loading, setLoader] = useState(false);

    const searchMember = async () => {
        const request = await client.user.search(text)
        if (request.error) return Toast.show({ text1: t(`errors.${request.error.code}`) as string });
        if (request.data) return setList(request.data);
    }

    useEffect(() => {
        text.length > 1 && searchMember()
        setList([])
    }, [text])

    const createDm = async () => {
        if (loading) return;
        setLoader(true)
        const request = await client.guild.create(selected.map(u => u.user_id));
        setLoader(false)
        if (request.error || !request.data) return Toast.show({ text1: t(`errors.${request?.error?.code}`) as string });
        if (request.data) dispatch(addGuildList([request.data]));

        setTimeout(() => {
            navigation?.push("MessagesStack", {
                screen: "MessageScreen",
                params: request.data,
            })
        }, 500)
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.bg_primary }}>
            <Appbar.Header style={{ width: full_width, backgroundColor: colors.bg_primary, flexDirection: "row", justifyContent: "space-between" }}>
                <View style={styles.row} >
                    <Appbar.BackAction color={colors.text_normal} onPress={() => navigation ? navigation.goBack() : null} />
                    <Text style={{ fontSize: 16, fontWeight: '700', marginLeft: 5 }}>{t("messages.create_guild")}</Text>
                </View>
                {
                    selected.length > 0 && (
                        <View style={[styles.row, { justifyContent: "flex-end" }]}>
                            <Button textColor={colors.text_normal} loading={loading} onPress={() => loading ? {} : createDm()} labelStyle={{ fontSize: 16, fontWeight: '700' }} style={{ marginRight: 10 }} uppercase={false}>{t("commons.next")}</Button>
                        </View>
                    )

                }
            </Appbar.Header>
            <View style={{ padding: 5 }}>
                <Text style={{ marginBottom: 5 }}>{t("messages.with")}</Text>
                <FlatList
                    style={{
                        maxHeight: selected.length > 3 ? undefined : 40
                    }}
                    data={selected}
                    keyExtractor={item => item.user_id}
                    renderItem={({ item }) => <Chip compact={false} style={{ backgroundColor: colors.bg_secondary, width: 120, marginRight: 5 }} avatar={<Avatar size={25} url={client.user.avatar(item.user_id, item.avatar)} />} onPress={() => setSelected((s) => s.filter(m => m.user_id !== item.user_id))}>{item.username}</Chip>}
                    numColumns={3}
                    horizontal={false}
                />
                <Divider style={{
                    marginTop: selected.length > 0 ? 5 : 25,
                    borderWidth: 0.5
                }} />
                <SearchBar
                    onSearchPress={() => { }}
                    style={{
                        backgroundColor: colors.bg_secondary,
                        width: full_width - 10,
                        margin: 5
                    }}
                    placeholder={t("commons.search") + " ..."}
                    onChangeText={(txt) => setText(txt)}
                    value={text}
                    onClearPress={() => setText("")}
                />
                <FlatList
                    data={list}
                    keyExtractor={item => item.user_id}
                    renderItem={({ item }) => <DisplayMember informations={item} onPress={() => !selected.some(u => u.user_id === item.user_id) && setSelected((s) => [item, ...s])} />}
                />
            </View>
        </View>
    );
};

const mapStateToProps = (state: RootState) => {
    return {
        guildListFeed: state.guildListFeed,
    };
};

const mapDispatchToProps = {
    addGuildList
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateGuildScreen);