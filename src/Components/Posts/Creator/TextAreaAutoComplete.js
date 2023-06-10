import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, TextInput, TouchableOpacity, View } from "react-native";
import { useClient, useTheme } from "../../Container";
import { emojies_defs } from "../../Elements/Text/Markdown/emojis";
import DisplayMember from "../../Member/DisplayMember";
import { DisplayEmoji } from "../../Emojis";

function TextAreaAutoComplete({ value, setValue, maxLength, autoFocus }) {

    const [state, setState] = useState({ type: "none" });
    const [selection, setSelection] = useState({
        start: 0,
        end: 0
    })
    const { colors } = useTheme();
    const { client } = useClient();
    const { t } = useTranslation();

    function findSearchString(selection, el) {
        
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

    function selectCurrent() {
        
        if (state.type !== "none") {
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
        <View>
            <TextInput
                style={{
                    maxWidth: "100%",
                    maxHeight: "95%",
                    color: colors.text_normal,
                }}
                autoFocus={autoFocus ?? false}
                multiline={true}
                onChangeText={(t) => setValue(t)}
                onSelectionChange={(ev) => {
                    setSelection(ev.nativeEvent.selection)
                    onChange(ev.nativeEvent.selection)
                }}
                value={value}
                maxLength={maxLength}
                placeholderTextColor={colors.text_normal}
                placeholder={t("posts.what_new")}
            />
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
        </View>
    )
}

export default TextAreaAutoComplete;