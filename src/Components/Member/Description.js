import React from "react";
import { Markdown } from "../Elements/Text";

export default function UserDescription({ description }) {
    return <Markdown content={description} />
}