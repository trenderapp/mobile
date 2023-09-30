import React from 'react';
import FastImage from "react-native-fast-image";
import { useTheme } from '../../Container';
import { IconButton, Button } from 'react-native-paper';

type SectionProps = {
  uri: string;
  index: number;
  deleteImage: (idx: number) => any
}

export default function CreatorImageDisplay({ uri, index, deleteImage }: SectionProps) {

  const { colors } = useTheme();
  
  return (
    <>
      <IconButton onPress={() => deleteImage(index)} icon="close-circle" style={{ position: "absolute", right: 0, zIndex: 2 }} />
      <Button icon="image" style={{ position: "absolute", bottom: 0, left: 0, zIndex: 3 }}>{index + 1}/8</Button>
      <FastImage style={{
        width: 100,
        height: 100,
        borderRadius: 8,
        margin: 5,
        backgroundColor: colors.bg_secondary
      }} source={{
        uri: uri
      }} />
    </>
  )
}