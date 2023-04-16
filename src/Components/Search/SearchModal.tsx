import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { View } from 'react-native';
import SearchBar from 'react-native-dynamic-search-bar';
import { Appbar } from "react-native-paper";
import { full_width } from "../../Style/style";
import { useClient, useTheme } from "../Container";
import MemberList from "../Profile/MemberList";
import { userInfo } from "trender-client/Managers/Interfaces/Search";

function SearchModal() {

    const { colors } = useTheme();
    const [text, setText] = useState("");
    const [pagination_key, setPaginationKey] = useState<string | undefined>(undefined);
    const { t } = useTranslation();
    const { client } = useClient();
    const [users, setInfo] = useState<userInfo[] | undefined>(undefined);
    const [loader, setLoader] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        async function getData() {
            setLoader(true)
            const response = await client.user.search(text, pagination_key);
            setLoader(false)
            if(response.error || !response.data) return;
            setInfo(response.data);
            setPaginationKey(response?.pagination_key);
        }

        if (text?.length > 1) getData();
    }, [text])

    return (
        <View style={{ flex: 1, backgroundColor: colors.bg_primary }}>
            <Appbar.Header style={{ width: full_width, backgroundColor: colors.bg_primary, flexDirection: "row" }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
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
                    onClearPress={() => setText("")}
                />
            </Appbar.Header>
            {users && users.length > 0 && <MemberList list={users} loader={loader} onBottom={undefined} />}
        </View>
    )
}

export default SearchModal;