import * as React from 'react'
import {
  GestureResponderEvent,
  TouchableOpacityProps,
} from 'react-native'

import { IconButton } from 'react-native-paper'

export interface SendButtonPropsAdditionalProps {
  touchableOpacityProps?: TouchableOpacityProps
}

export interface SendButtonProps extends SendButtonPropsAdditionalProps {
  /** Callback for send button tap event */
  onPress: () => void
}

export const SendButton = ({
  onPress,
  touchableOpacityProps,
}: SendButtonProps) => {

  const handlePress = (event: GestureResponderEvent) => {
    onPress()
    touchableOpacityProps?.onPress?.(event)
  }

  return (
    <IconButton 
      accessibilityRole='button'
      onPress={handlePress}
      style={{
        margin: -10,
        marginLeft: 5
      }}
      icon="send"
      size={20}
      />
  )
}
