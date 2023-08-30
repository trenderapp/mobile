import React, { useState } from "react";
import { FlatList, Keyboard, TouchableOpacity, View } from "react-native";
import { IconButton, TextInput } from "react-native-paper";
import { useClient, useTheme, useWebSocket } from "../Container";
import { emojies_defs } from "../Elements/Text/Markdown/emojis";
import DisplayMember from "../Member/DisplayMember";
import { DisplayEmoji } from "../Emojis";
import { full_width } from "../../Style/style";
import { webSocketRoutes } from "trender-client";

function MessageTextInput({ value, setValue, onSubmit, channel_id, onAttachment, displaySend = false, maxLength = 500 }) {

    const [state, setState] = useState({ type: "none" });
    const [selection, setSelection] = useState({
        start: 0,
        end: 0
    });
    const { colors } = useTheme();
    const { client } = useClient();
    const [searchEmote, setSearchEmote] = useState(false);
    const { sendMessage } = useWebSocket();
    const [editing, setEditing] = useState(false);

    function findSearchString(selection) {
        
        if (selection.start === selection.end) {
            const cursor = selection.start;
            const content = value.slice(0, cursor);

            const valid = /\w/;

            let j = content.length - 1;
            if (content[j] === "@") {
                return ["user", "", j];
            } else if (content[j] === "#") {
                return ["channel", "", j];
            }

            while (j >= 0 && valid.test(content[j])) {
                j--;
            }

            if (j === -1) return;
            const current = content[j];

            if (current === ":" || current === "@" || current === "#") {
                const search = content.slice(j + 1, content.length);
                const minLen = current === ":" ? 2 : 1;

                if (search.length >= minLen) {
                    return [
                        current === "#"
                            ? "channel"
                            : current === ":"
                            ? "emoji"
                            : "user",
                        search.toLowerCase(),
                        current === ":" ? j + 1 : j,
                    ];
                }
            }
        }
    }

    async function onChange(selection) {

        const result = findSearchString(selection);
        
        if (result) {
            const [type, search] = result;
            const regex = new RegExp(search, "i");

            if (type === "emoji") {
                // ! TODO: we should convert it to a Binary Search Tree and use that
                const matches = Object.keys(emojies_defs)
                    .filter((emoji) => emoji.match(regex))
                    .splice(0, 5);

                if (matches.length > 0) {
                    const currentPosition =
                        state.type !== "none" ? state.selected : 0;

                    setState({
                        type: "emoji",
                        matches,
                        selected: Math.min(currentPosition, matches.length - 1),
                        within: false,
                    });

                    return;
                }
            }

            if (type === "user") {
                if(search.length < 1) return;
                let users = await client.user.search(search);
                if(users.error) return;
                
                let matches = users.data;
                
                if (matches.length > 0) {
                    const currentPosition =
                        state.type !== "none" ? state.selected : 0;

                    setState({
                        type: "user",
                        matches,
                        selected: Math.min(currentPosition, matches.length - 1),
                        within: false,
                    });

                    return;
                }
            }
        }

        if (state.type !== "none") {
            setState({ type: "none" });
        }
    }

    function selectCurrent(selected) {
        
        if(selected) {
            const cursor = selection.start;
            const content = value.slice(0, cursor);
            let j = content.length - 1;
            
            const [search, index] = [selected.replace(/:/g, ""), j];
            const new_content = value.split("");

            new_content.splice(
                index + 1,
                search.length,
                selected,
                " "
            );

            setSelection({ start: selection.start + selected.length, end: selection.end + selected.length })
            return setValue(new_content.join(""));;
        } else if (state.type !== "none") {
            const result = findSearchString(selection);

            if (result) {
                const [_type, search, index] = result;

                const new_content = value.split("");
                
                if (state.type === "emoji") {
                    new_content.splice(
                        index,
                        search.length,
                        state.matches[state.selected],
                        ": ",
                    );
                } else if (state.type === "user") {
                    new_content.splice(
                        index,
                        search.length + 1,
                        "@",
                        state.matches[state.selected].nickname,
                    );
                }

                setValue(new_content.join(""));
                setState({
                    type: "none"
                })
            }
        }
    }

    return (
        <View style={{
            borderTopColor: colors.bg_secondary,
            borderTopWidth: 1,
            padding: 5,
            paddingTop: 0
        }}>
            <View style={{ maxHeight: 200 }}>
            {state.type === "user" &&
                <FlatList 
                    keyExtractor={(item => item.user_id)}
                    data={state.matches}
                    renderItem={({ item }) => <View style={{ borderTopColor: colors.bg_secondary, borderTopWidth: 1}}><DisplayMember onPress={() => selectCurrent()} informations={item} noDescription /></View>}
                />
            }
            {state.type === "emoji" &&
                    <FlatList 
                        keyExtractor={(item => item)}
                        data={state.matches}
                        renderItem={({ item }) => <TouchableOpacity style={{ borderTopColor: colors.bg_secondary, borderTopWidth: 1}} onPress={() => selectCurrent()}><DisplayEmoji name={item} /></TouchableOpacity>}
                    />
            }
            {state.type !== "emoji" && state.type !== "user" && searchEmote &&
                    <FlatList 
                        keyExtractor={(item => item)}
                        data={Object.keys(emojies_defs)}
                        numColumns={10}
                        horizontal={false}
                        renderItem={({ item }) => <TouchableOpacity style={{ borderTopColor: colors.bg_secondary, borderTopWidth: 1}} onPress={() => selectCurrent(`:${item}:`)}><DisplayEmoji name={item} noName /></TouchableOpacity>}
                    />
            }
            </View>
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                maxWidth: "100%"
            }}>
                { /** <IconButton onPress={() => onAttachment()} mode="outlined" iconColor={colors.text_normal} icon={"plus-circle"} /> */}
                <TextInput
                    mode='outlined'
                    style={{
                        width: full_width - 50
                    }}
                    onEndEditing={() => {
                        setEditing(false);
                        /*sendMessage({
                            code: webSocketRoutes.STOP_TYPING,
                            data: {
                                channel_id: channel_id
                            }
                        })*/
                    }}
                    onBlur={() => Keyboard.dismiss()}
                    multiline={true}
                    dense={!value.length > 0}
                    value={value}
                    onChangeText={(t) => {
                        setValue(t)
                        /*if(editing === false) {
                            setEditing(true)
                            sendMessage({
                                code: webSocketRoutes.START_TYPING,
                                data: {
                                    channel_id: channel_id
                                }
                            })
                        }*/
                    }}
                    onSelectionChange={(ev) => {
                        setSelection(ev.nativeEvent.selection)
                        onChange(ev.nativeEvent.selection)
                    }}
                    maxLength={maxLength}
                    placeholder="Aa"
                    right={<TextInput.Affix textStyle={{ color: colors.text_normal }} text={`${value.length}/${maxLength}`} />}
                    /*right={<TextInput.Icon onPress={() => {
                        Keyboard.dismiss()
                        setSearchEmote(!searchEmote)
                    }} icon={"emoticon"} iconColor={colors.text_normal} />} */
                    // left={<TextInput.Icon onPress={() => {}} icon={"plus-circle"} iconColor={colors.text_normal} />}
                />
                <IconButton disabled={!displaySend} onPress={() => {
                    Keyboard.dismiss();
                    onSubmit()
                }} iconColor={colors.text_normal} icon={"send"} />
            </View>
        </View>
    )
}

export default MessageTextInput;