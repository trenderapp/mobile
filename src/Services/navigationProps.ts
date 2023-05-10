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
    PostStack: undefined;
    SettingsStack: undefined;
    MessagesStack: undefined;
    RegisterVerificationCode: {
        code: string[] | false;
        [x: string]: any;
    };
};