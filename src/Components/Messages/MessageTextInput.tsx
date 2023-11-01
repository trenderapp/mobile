import React, { useState } from "react";
import { Keyboard, View } from "react-native";
import { IconButton, TextInput } from "react-native-paper";
import { useClient, useTheme, useWebSocket } from "../Container";
import { full_width } from "../../Style/style";
import { webSocketRoutes } from "trender-client";

type sectionProps = {
    onSubmit: (content: string) => Promise<void>;
    channel_id: string;
    onAttachment: Function;
    displaySend?: boolean;
    maxLength?: number;
}

function MessageTextInput({ onSubmit, channel_id, onAttachment, displaySend = false, maxLength = 500 }: sectionProps) {

    const [state, setState] = useState({ type: "none" });
    const { colors } = useTheme();
    const { client } = useClient();
    const { sendMessage } = useWebSocket();
    const [editing, setEditing] = useState(false);
    const [content, setContent] = useState("");

    return (
        <View style={{
            borderTopColor: colors.bg_secondary,
            borderTopWidth: 1,
            padding: 5,
            paddingTop: 0
        }}>
            <View style={{
                flexDirection: "row",
                alignItems: "center"
            }}>
                { /** <IconButton onPress={() => onAttachment()} mode="outlined" iconColor={colors.text_normal} icon={"plus-circle"} /> */}
                <TextInput
                    mode='outlined'
                    onEndEditing={() => {
                        setEditing(false);
                        sendMessage({
                            code: webSocketRoutes.STOP_TYPING,
                            data: {
                                channel_id: channel_id
                            }
                        })
                    }}
                    onBlur={() => Keyboard.dismiss()}
                    multiline={true}
                    dense={content.length > 1}
                    value={content}
                    onChangeText={(t) => {
                        setContent(t)
                        if(editing === false) {
                            setEditing(true)
                            sendMessage({
                                code: webSocketRoutes.START_TYPING,
                                data: {
                                    channel_id: channel_id
                                }
                            })
                        }
                    }}
                    maxLength={maxLength}
                    placeholder="Aa"
                    right={<TextInput.Affix textStyle={{ color: colors.text_normal }} text={`${content.length}/${maxLength}`} />}
                    /*right={<TextInput.Icon onPress={() => {
                        Keyboard.dismiss()
                        setSearchEmote(!searchEmote)
                    }} icon={"emoticon"} iconColor={colors.text_normal} />} */
                    // left={<TextInput.Icon onPress={() => {}} icon={"plus-circle"} iconColor={colors.text_normal} />}
                />
                <IconButton disabled={displaySend} onPress={() => {
                    Keyboard.dismiss();
                    onSubmit(content)
                }} iconColor={colors.text_normal} icon={"send"} />
            </View>
        </View>
    )
}

export default MessageTextInput;