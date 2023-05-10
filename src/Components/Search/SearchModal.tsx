import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import SearchBar from 'react-native-dynamic-search-bar';
import { Appbar } from "react-native-paper";
import { full_width } from "../../Style/style";
import { useClient, useTheme } from "../Container";
import MemberList from "../Profile/MemberList";
import { userInfo } from "trender-client/Managers/Interfaces/Search";
import { Avatar } from "../Member";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../Services";
import { Loader } from '../../Other';

function SearchModal() {

    const { colors } = useTheme();
    const [text, setText] = useState("");
    const [pagination_key, setPaginationKey] = useState<string | undefined>(undefined);
    const { t } = useTranslation();
    const { client, user } = useClient();
    const [users, setUsers] = useState<userInfo[] | undefined>(undefined);
    const [loader, setLoader] = useState(true);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Bottom'>>();

    useEffect(() => {
        async function getData() {
            setLoader(true)
            const response = await client.user.search(text, pagination_key);
            setLoader(false)
            if (response.error || !response.data) return;
            setUsers(response.data);
            setPaginationKey(response?.pagination_key);
        }

        if (text?.length > 1) getData();
    }, [text])

    return (
        <View style={{ flex: 1, backgroundColor: colors.bg_primary }}>
            <Appbar.Header style={{ width: full_width, backgroundColor: colors.bg_primary, flexDirection: "row", alignContent: "center", justifyContent: "space-evenly" }}>
                <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate("ProfileStack", {
                    screen: "ProfileScreen",
                    params: {
                        nickname: user.nickname
                    }
                })}>
                    <Avatar marginLeft={0} marginRight={5} url={client.user.avatar(user?.user_id, user?.avatar)} />
                </TouchableOpacity>
                <View>
                    <SearchBar
                        searchIconImageStyle={{
                            tintColor: colors.text_normal
                        }}
                        clearIconImageStyle={{
                            tintColor: colors.text_normal
                        }}
                        placeholderTextColor={colors.text_normal}
                        style={{
                            backgroundColor: colors.bg_secondary,
                            width: 330
                        }}
                        textInputStyle={{
                            color: colors.text_normal
                        }}
                        placeholder={t("commons.search") + " ..."}
                        onChangeText={(txt) => setText(txt)}
                        value={text}
                        onClearPress={() => {
                            setText(""),
                            setUsers(undefined)
                        }}
                    />
                </View>
            </Appbar.Header>
            {users && users.length > 0 && <MemberList list={users} loader={loader} onBottom={undefined} />}
            {typeof users === "undefined" && <Text style={{ padding: 5 }}>{t("commons.nothing_display")}</Text>}
        </View>
    )
}

export default SearchModal;