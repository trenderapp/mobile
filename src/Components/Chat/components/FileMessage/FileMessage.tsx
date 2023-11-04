import * as React from 'react'
import { Text, View } from 'react-native'

import { MessageType } from '../../types'
import {
  formatBytes,
  L10nContext,
  ThemeContext,
  UserContext,
} from '../../utils'
import styles from './styles'
import { IconButton } from 'react-native-paper'

export interface FileMessageProps {
  message: MessageType.DerivedFile
}

export const FileMessage = ({ message }: FileMessageProps) => {
  const l10n = React.useContext(L10nContext)
  const theme = React.useContext(ThemeContext)
  const user = React.useContext(UserContext)
  const { container, iconContainer, name, size, textContainer } = styles({
    message,
    theme,
    user,
  })

  return (
    <View
      accessibilityLabel={l10n.fileButtonAccessibilityLabel}
      style={container}
    >
      <View style={iconContainer}>
        <IconButton icon="file" />
      </View>
      <View style={textContainer}>
        <Text style={name}>{message.name}</Text>
        <Text style={size}>{formatBytes(message.size)}</Text>
      </View>
    </View>
  )
}
