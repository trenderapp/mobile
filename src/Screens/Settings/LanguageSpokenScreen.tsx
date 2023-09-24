import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { FlatList, View } from 'react-native';
import { Text, Checkbox, FAB } from 'react-native-paper';
import { languageList } from "trender-client";
import Toast from 'react-native-toast-message';
import { useClient, useTheme } from '../../Components/Container';
import SettingsContainer from '../../Components/Container/SettingsContainer';
import styles from '../../Style/style';
import { SearchBar } from '../../Components/Elements/Input';

type languagesI = {
    language: string;
    selected?: boolean;
    name: string;
    local_language: {
        english: string;
        original: string;
    };
}

function LanguageSpokenScreen() {

    const { t } = useTranslation();
    const { colors } = useTheme();
    const { client, user, setValue } = useClient();
    const old_client = useClient();
    const [text, setText] = useState<string | undefined>(undefined);
    const [filter, setFilter] = useState<languagesI[]>([]);
    const [languages, setLanguages] = useState<languagesI[]>(languageList);
    const [loader, setLoader] = useState(true);
   
    const selectLanguages = (selectedLanguage: string) => {
        // Créez une copie de l'état actuel des langues
        const updatedLanguages = languages.map((item: languagesI) => {
            if (selectedLanguage === item.language) {
                // Inversez l'état de sélection
                return { ...item, selected: !item.selected };
            }
            return item;
        });
    
        setLanguages(updatedLanguages);
    
        // Mettez également à jour l'état des filtres si nécessaire
        const updatedFilter = filter.map((item: languagesI) => {
            if (selectedLanguage === item.language) {
                return { ...item, selected: !item.selected };
            }
            return item;
        });
    
        setFilter(updatedFilter);
    };
    
    const sendInfo = async () => {
        setLoader(true)
        if(loader) return;
        const filtered = languages.filter(l => l.selected === true).map(l => l.language);        
        const response = await client.user.edit({ language_spoken: filtered });
        setLoader(false);
        if(!response.data && response.error) return Toast.show({ text1: t(`errors.${response.error.code}`) as string });
        setValue({ ...old_client, user: { ...user, language_spoken: filtered }});
        Toast.show({ text1: t(`commons.success`) as string });
    }

    const resetLanguages = () => setFilter(languages);

    useEffect(() => {
        const map = languageList.map((item: languagesI) => {
            const exist = user.language_spoken?.some(l => l === item.language);
            return { ...item, selected: exist };
        })
        setFilter(map)
        setLanguages(map)     
        setLoader(false)
    }, [])

    useEffect(() => {
        console.log(text);
        
        if(typeof text !== "string") return;
        if (text.length === 0) return resetLanguages();
        if (text.length > 0) return setFilter(filter.filter(l => l.local_language.original.toLocaleLowerCase().includes(text.toLocaleLowerCase()) === true));
    }, [text])

    return (
        <SettingsContainer title={t("settings.language_spoken")}>
            <FAB
                icon="content-save"
                loading={loader}
                size='medium'
                color={colors.bg_primary}
                variant='primary'
                onPress={() => sendInfo()}
                style={{
                    position: 'absolute',
                    margin: 16,
                    right: 0,
                    bottom: 0,
                    zIndex: 3,
                    borderRadius: 60
                }}
            />
            <FlatList
                data={filter}
                keyExtractor={(item) => item.language}
                ListEmptyComponent={<Text>{t("errors.empty")}</Text>}
                ListHeaderComponent={<SearchBar
                    /*inputProps={{
                        autoFocus: true
                    }}*/
                    onSearchPress={() => { }}
                    placeholder={t("commons.search") + " ..."}
                    onChangeText={(txt) => setText(txt)}
                    value={text}
                    onClearPress={() => {
                        setText("")
                        resetLanguages()
                    }}
                />}
                renderItem={({ item, index }) => (
                    <View style={styles.row}>
                        <Checkbox.Android status={filter[index] && filter[index].selected ? "checked" : "unchecked"} onPress={() => selectLanguages(item.language)} />
                        <Text>{item.local_language.english} ({item.local_language.original})</Text>
                    </View>
                )}
            />
        </SettingsContainer>
    )
}

export default LanguageSpokenScreen;