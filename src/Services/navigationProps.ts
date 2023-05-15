import { DrawerNavigationProp } from "@react-navigation/drawer";

export type RootStackParamList = {
    ProfileStack: {
        screen: string,
        params: {
            nickname?: string
            [x: string]: any;
        }
    };
    DrawerNavigation: undefined;
    Splash: undefined;
    LoginNavigator: undefined;
    CreateStack: {
        screen: string,
        params: {
            nickname?: string
            [x: string]: any;
        }
    };
    NotificationScreen: undefined;
    PostStack: {
        screen?: string
        params: {
            post_id?: string
        }
    };
    SettingsStack: undefined;
    MessagesStack: undefined;
    RegisterVerificationCode: {
        code: string[] | false;
        [x: string]: any;
    };
};

export type navigationProps = DrawerNavigationProp<RootStackParamList, 'DrawerNavigation'>