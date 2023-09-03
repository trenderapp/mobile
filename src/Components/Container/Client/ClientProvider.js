import * as React from 'react';
import { Platform } from 'react-native';
import Client from 'trender-client';
import ClientContext from './ClientContext';
import SplashScreen from 'react-native-splash-screen';
import { DefaultTheme, Provider } from 'react-native-paper';
import useTheme from '../Theme/useTheme';
import { apibaseurl, cdnbaseurl } from '../../../Services/constante';
import { useTranslation } from 'react-i18next';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { clearStorage, initStorage } from '../../../Services/storage';

function ClientProvider({ children }) {
    
    const [value, setValue] = React.useState({
        client: new Client({
            token: ""
        }),
        token: undefined,
        user: undefined,
        state: "loading"
    });
    const { i18n } = useTranslation();
    const { setTheme, colors } = useTheme();

    React.useEffect(() => {
        async function splash() {
            const { settings, user_info } = await initStorage();

            if(settings) {
                if(settings?.theme) setTheme(settings.theme);
                if(settings?.locale) i18n.changeLanguage(settings.locale);
            }
            
            SplashScreen.hide()

            if(Platform.OS === "ios") {
                const trackPermission = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
                if(trackPermission === RESULTS.DENIED || trackPermission === RESULTS.LIMITED) await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY)
            }

            if(!user_info) return setValue({ ...value, state: "logout" });
      
            const user_token = user_info?.token;
            
            if(!user_token) return setValue({ ...value, state: "logout" });

            const client = new Client({
                token: user_token,
                apiurl: apibaseurl,
                cdnurl: cdnbaseurl
            });

            const user = await client.informations();
            
            if(user.error) {
                clearStorage("user_info");
                return setValue({
                    ...value,
                    state: "logout"
                });
            };

            setValue({
                client: client,
                token: user_token,
                user: user.data,
                state: "loged"
            });
          }

          splash()
    }, [])
    
    return (
        <ClientContext.Provider value={{ ...value, setValue }}>
            <Provider theme={{
                ...DefaultTheme,
                version: 3,
                colors: {
                    "backdrop": "rgba(50, 47, 55, 0.4)",
                    "background": colors.bg_primary,
                    "elevation": {
                        "level0": "transparent",
                        "level1": colors.bg_primary,
                        "level2": colors.bg_primary,
                        "level3": colors.bg_primary,
                        "level4": colors.bg_primary,
                        "level5": colors.bg_primary
                    },
                    "error": colors.color_red,
                    "errorContainer": "rgba(249, 222, 220, 1)",
                    "inverseOnSurface": "rgba(244, 239, 244, 1)",
                    "inversePrimary": "rgba(208, 188, 255, 1)",
                    "inverseSurface": "rgba(49, 48, 51, 1)",
                    "onBackground": colors.text_normal,
                    "onError": "rgba(255, 255, 255, 1)",
                    "onErrorContainer": "rgba(65, 14, 11, 1)",
                    "onPrimary": colors.bg_primary,
                    "onPrimaryContainer": colors.text_normal,
                    "onSecondary": "rgba(255, 255, 255, 1)",
                    "onSecondaryContainer": colors.text_normal,
                    "onSurface": colors.text_normal,
                    "onSurfaceDisabled": colors.text_normal_hover,
                    "onSurfaceVariant": colors.text_normal,
                    "onTertiary": "rgba(255, 255, 255, 1)",
                    "onTertiaryContainer": "rgba(49, 17, 29, 1)",
                    "outline": "rgba(121, 116, 126, 1)",
                    "outlineVariant": colors.bg_primary,
                    "primary": colors.fa_primary,
                    "primaryContainer": "rgba(234, 221, 255, 1)",
                    "secondary": "rgba(98, 91, 113, 1)",
                    "secondaryContainer": colors.bg_secondary,
                    "surface": colors.bg_primary,
                    "surfaceDisabled": colors.text_muted,
                    "surfaceVariant": colors.bg_secondary,
                    "tertiary": "rgba(125, 82, 96, 1)",
                    "tertiaryContainer": "rgba(255, 216, 228, 1)"
                }
            }}>
                {children}
            </Provider>
        </ClientContext.Provider>
    );
}

export default ClientProvider;