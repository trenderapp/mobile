import * as React from 'react'
import { Image, StyleSheet, View } from 'react-native'

import { MessageType, Theme } from '../../types'
import { CircularActivityIndicator } from '../CircularActivityIndicator'
import { useTheme } from '../../../Container'

export const StatusIcon = React.memo(
  ({
    currentUserIsAuthor,
    showStatus,
    status,
    theme,
  }: {
    currentUserIsAuthor: boolean
    showStatus: boolean
    status?: MessageType.Any['status']
    theme: Theme
  }) => {
    let statusIcon: React.ReactNode | null = null
    const { colors } = useTheme();
    /*switch (status) {
      case 'delivered':
        <IconButton iconColor={colors.color_red} icon="check-all" size={10} />
        break;
      case 'sent':
        <IconButton iconColor={colors.text_normal} icon="check" size={10} />
        break;
      case 'error':
        <IconButton iconColor={colors.color_red} icon="alert-circle-outline" size={10} />
        break;
      case 'seen':
        <IconButton iconColor={colors.text_link} icon="check-all" size={10} />
        break;
      case 'sending':
        <ActivityIndicator size={10} />
        break;*/
    if (showStatus) {
      switch (status) {
        case 'delivered':
        case 'sent':
          statusIcon = theme.icons?.deliveredIcon?.() ?? (
            <Image
              source={require('../../assets/icon-seen.png')}
              style={{ tintColor: colors.text_normal }}
              testID='DeliveredIcon'
            />
          )
          break;
        case 'error':
          statusIcon = theme.icons?.errorIcon?.() ?? (
            <Image
              source={require('../../assets/icon-error.png')}
              style={{ tintColor: colors.color_red }}
              testID='ErrorIcon'
            />
          )
          break
        case 'seen':
          statusIcon = theme.icons?.seenIcon?.() ?? (
            <Image
              source={require('../../assets/icon-seen.png')}
              style={{ tintColor: colors.text_link }}
              testID='SeenIcon'
            />
          )
          break
        case 'sending':
          statusIcon = theme.icons?.sendingIcon?.() ?? (
            <CircularActivityIndicator color={theme.colors.primary} size={10} />
          )
          break
        default:
          statusIcon = theme.icons?.deliveredIcon?.() ?? (
            <Image
              source={require('../../assets/icon-delivered.png')}
              style={{ tintColor: colors.text_normal }}
              testID='DeliveredIcon'
            />
          )
          break;
      }
    }

    return currentUserIsAuthor ? (
      <View style={styles.container} testID='StatusIconContainer'>
        {statusIcon}
      </View>
    ) : null
  }
)

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: 16,
    justifyContent: 'center',
    paddingHorizontal: 4,
    width: 16,
  },
})
