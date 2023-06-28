import React, { useState } from "react";
import { WebView } from "react-native-webview";
import { Menu, Divider, Button, IconButton } from "react-native-paper";
import { CustomHeader } from "../../Components/Container";
import { Loader } from "../../Other";
import { openURL } from "../../Services";

function WebViewScreen({ route }: any) {

    const { url } = route.params;
    const [visible, setVisible] = useState(false);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    return (
        <>
            <CustomHeader title={url} leftComponent={<Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={<IconButton onPress={openMenu} icon="dots-vertical" />}>
                    <Menu.Item onPress={() => openURL(url)} title="Open in browser" />
                </Menu>} />
            {url ? <WebView source={{ uri: url }} /> : <Loader />}
        </>
    )
}

export default WebViewScreen;