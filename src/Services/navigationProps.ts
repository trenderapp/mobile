import { DrawerNavigationProp } from "@react-navigation/drawer";
import { loginRoutesNames } from "../Navigator/LoginNavigator";


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
    LoginNavigator?: {
        screen: loginRoutesNames 
    };
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
            post_id?: string,
            query?: string;
        }
    };
    SettingsStack: undefined;
    MessagesStack: undefined;
    RegisterVerificationCode: {
        code: string[] | false;
        [x: string]: any;
    };
    ChangePassword: {
        code: string[] | false;
        [x: string]: any;
    };
};

export type navigationProps = DrawerNavigationProp<RootStackParamList, 'DrawerNavigation'>