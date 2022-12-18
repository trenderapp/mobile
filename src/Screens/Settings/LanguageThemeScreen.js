import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from 'react-native';
import { SegmentedButtons, Text } from 'react-native-paper';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useTheme } from '../../Components/Container';
import SettingsContainer from '../../Components/Container/SettingsContainer';
import { Avatar } from '../../Components/Member';
import { cdnbaseurl } from '../../Services/constante';
import { languageList } from '../../locales/i18n';

function LanguageThemeScreen() {


    const { t, i18n } = useTranslation();
    const { theme, setTheme, colors } = useTheme();

    /**
     * 
     * @param {"theme" | "language"} type
     * @param {String} txt
     */
    const changeStorage = (type, txt) => {
        EncryptedStorage.getItem("mobile_storage").then(mobile_storage => {
            const info = JSON.parse(mobile_storage);
            switch (type) {
                case "theme":
                    EncryptedStorage.setItem("mobile_storage", JSON.stringify({
                        theme: txt,
                        language: info?.language
                    }))
                    break;
                case "language":
                    EncryptedStorage.setItem("mobile_storage", JSON.stringify({
                        theme: info?.theme,
                        language: txt
                    }))
                    break;
                default:
                    break;
            }
        })
    }

    return (
        <SettingsContainer title={t("settings.lang_and_theme")}>
            <View style={{ padding: 5 }}>
                <View style={{ justifyContent: "center", marginBottom: 10 }}>
                    <SegmentedButtons
                        value={theme}
                        onValueChange={(v) => {
                            setTheme(v)
                            changeStorage("theme", v)
                        }}
                        buttons={[
                        {
                            value: 'auto',
                            label: t("settings.auto"),
                        },
                        {
                            value: 'darkblue',
                            label: t("settings.dark_blue"),
                        },
                        {
                            value: 'white',
                            label: t("settings.white"),
                        },
                        {
                            value: 'dark',
                            label: t("settings.dark"),
                        },
                        ]}
                    />
                </View>
                <View>
                {
                    languageList.map((l, index) =>
                        <View key={index}>
                            <TouchableOpacity style={{ 
                                flexDirection: "row",
                                backgroundColor: i18n.language === l.locale ? colors.bg_third : colors.bg_secondary,
                                padding: 10,
                                marginBottom: 5
                             }} onPress={() => {
                                i18n.changeLanguage(l.locale)
                                changeStorage("language", l.locale)
                             }}>
                                <Avatar size={22} url={`${cdnbaseurl}/assets/icons/flags/${l.locale}.png`} />
                                <Text>{l.language}</Text>    
                            </TouchableOpacity>
                        </View>

                    )
                } 
                </View>
            </View>
        </SettingsContainer>
    )
}

export default LanguageThemeScreen;