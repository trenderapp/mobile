import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, TextInput, TouchableOpacity, View } from "react-native";
import { GlobalInterface } from "trender-client";
import { useClient, useTheme } from "../../Container";
import { emojies_defs } from "../../Elements/Text/Markdown/emojis";
import DisplayMember from "../../Member/DisplayMember";
import { DisplayEmoji } from "../../Emojis";

type sectionProps = {
    autoFocus: boolean;
    value: string;
    maxLength?: number;
    setValue: (value: string) => void;
}

interface Iselection {
    start: number;
    end: number;
}

interface Istate {
    type: "none" | "emoji" | "user",
    matches?: string[] | GlobalInterface.userInfo[];
    selected: number,
    within?: boolean,
}

function TextAreaAutoComplete({ value, setValue, maxLength, autoFocus }: sectionProps) {

    const [state, setState] = useState<Istate>({
        type: "none",
        selected: 0
    });
    const [selection, setSelection] = useState<Iselection>({
        start: 0,
        end: 0
    })
    const { colors } = useTheme();
    const { client } = useClient();
    const { t } = useTranslation();

    function findSearchString(selection: Iselection) {

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

    async function onChange(selection: Iselection) {

        const result = findSearchString(selection);

        if (result) {
            const [type, search] = result;
            const regex = new RegExp(search.toString(), "i");
            const new_search = search.toString();

            if (type === "emoji") {
                // ! TODO: we should convert it to a Binary Search Tree and use that
                const matches = Object.keys(emojies_defs)
                    .filter((emoji) => emoji.match(regex))
                    .splice(0, 5);

                if (matches.length > 0) {
                    const currentPosition = state.type !== "none" ? state.selected : 0;

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
                if (new_search.length < 1) return;
                let users = await client.user.search(new_search);
                if (users.error || !users.data) return;

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
            setState({
                type: "none",
                selected: 0
            });
        }
    }

    function selectCurrent() {

        if (state.type !== "none") {
            const result = findSearchString(selection);

            if (result) {
                const [_type, search, index] = result;
                const new_index = parseInt(index.toString());
                const new_search = search.toString();

                const new_content = value.split("");

                if (state.type === "emoji") {
                    const matches = state.matches as string[];

                    new_content.splice(
                        new_index,
                        new_search.length,
                        matches[state.selected],
                        ": ",
                    );
                } else if (state.type === "user") {
                    const matches = state.matches as GlobalInterface.userInfo[];

                    new_content.splice(
                        new_index,
                        new_search.length + 1,
                        "@",
                        matches[state.selected].nickname,
                    );
                }

                setValue(new_content.join(""));
                setState({
                    type: "none",
                    selected: 0
                })
            }
        }
    }

    return (
        <View>
            <TextInput
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
                style={{
                    color: colors.text_normal
                }}
                placeholder={t("posts.what_new") as string}
            />
            {state.type === "user" &&
                <FlatList
                    keyExtractor={((item: GlobalInterface.userInfo) => item.user_id)}
                    data={state.matches as GlobalInterface.userInfo[]}
                    renderItem={({ item }) => <DisplayMember onPress={() => selectCurrent()} informations={item} noDescription />}
                />
            }
            {state.type === "emoji" &&
                <FlatList
                    keyExtractor={(item => item)}
                    data={state.matches as string[]}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={{ borderTopColor: colors.bg_secondary, borderTopWidth: 1 }} onPress={() => selectCurrent()}>
                            <DisplayEmoji name={item} />
                        </TouchableOpacity>
                    )}
                />
            }
        </View>
    )
}

export default TextAreaAutoComplete;