import React, { useState } from "react";
import DatePicker from 'react-native-date-picker'
import { TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { messageFormatDate } from "../../../Services";
import { Platform, Pressable } from "react-native";

function InputDate({ onChange, maximumDate, minimumDate, label, value }) {

    const [date, setDate] = useState(value ?? maximumDate);
    const [show, setShow] = useState(false);
    const { t, i18n } = useTranslation('');

    const setChange = (e) => {
        setShow(false)
        setDate(e)
        onChange(e)
    }

    return (
        <>
            {
                Platform.OS === "ios" ? 
                    <TextInput onTouchStart={() => setShow(!show)} editable={false} label={label} value={messageFormatDate(date).date()} /> 
                    : <Pressable onPress={() => setShow(!show)}><TextInput editable={false} label={label} value={messageFormatDate(date).date()} /></Pressable>
            }
            {
                <DatePicker
                modal
                open={show}
                date={date}
                is24hourSource="locale"
                onConfirm={(d) => setChange(d)}
                onCancel={() => setShow(false)}
                mode="date"
                title={null}
                locale={i18n.language}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                confirmText={t("commons.confirm")}
                cancelText={t("commons.cancel")}
            />
            }
        </>
    )
}

export default InputDate;