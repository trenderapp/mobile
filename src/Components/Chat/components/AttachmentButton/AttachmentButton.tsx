import * as React from 'react'
import {
  GestureResponderEvent,
  TouchableOpacityProps,
} from 'react-native'

import { L10nContext } from '../../utils'
import { IconButton } from 'react-native-paper'

export interface AttachmentButtonAdditionalProps {
  touchableOpacityProps?: TouchableOpacityProps
}

export interface AttachmentButtonProps extends AttachmentButtonAdditionalProps {
  /** Callback for attachment button tap event */
  onPress?: () => void
}

export const AttachmentButton = ({
  onPress,
  touchableOpacityProps,
}: AttachmentButtonProps) => {
  const l10n = React.useContext(L10nContext)

  const handlePress = (event: GestureResponderEvent) => {
    onPress?.()
    touchableOpacityProps?.onPress?.(event)
  }

  return (
    <IconButton
      accessibilityLabel={l10n.attachmentButtonAccessibilityLabel}
      accessibilityRole='button'
      onPress={handlePress}
      style={{ margin: 0, marginLeft: -10, marginRight: 5 }}
      icon="camera" />
  )
}
