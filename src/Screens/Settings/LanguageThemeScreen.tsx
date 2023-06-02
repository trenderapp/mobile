import React from 'react';
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from 'react-native';
import { SegmentedButtons, Text } from 'react-native-paper';
import { useTheme } from '../../Components/Container';
import SettingsContainer from '../../Components/Container/SettingsContainer';
import { Avatar } from '../../Components/Member';
import { cdnbaseurl } from '../../Services/constante';
import { languageList } from '../../locales/i18n';
import { getStorageInfo, setStorage, settingsStorageI } from '../../Services/storage';

// https://github.com/skb1129/react-native-change-icon/blob/master/example/android/app/src/main/AndroidManifest.xml

function LanguageThemeScreen() {

    const { t, i18n } = useTranslation();
    const { theme, setTheme, colors } = useTheme();

    const changeStorage = (type: "theme" | "language", txt: string) => {
        const settings = getStorageInfo("settings") as settingsStorageI;

        switch (type) {
            case "theme":
                setStorage("settings", JSON.stringify({
                    theme: txt,
                    locale: settings?.locale
                }))
                break;
            case "language":
                setStorage("settings", JSON.stringify({
                    theme: settings?.theme,
                    locale: txt
                }))
                break;
            default:
                break;
        }
    }

    const buttons = [
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
        ]

    return (
        <SettingsContainer title={t("settings.lang_and_theme")}>
            <View style={{ padding: 5 }}>
                <View style={{ justifyContent: "center", marginBottom: 10 }}>
                    <SegmentedButtons
                        value={theme}
                        onValueChange={(v: any) => {
                            setTheme(v)
                            changeStorage("theme", v)
                        }}
                        buttons={buttons}
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