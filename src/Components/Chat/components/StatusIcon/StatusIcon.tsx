import * as React from 'react'
import { StyleSheet, View } from 'react-native'

import { MessageType } from '../../types'
import { useTheme } from '../../../Container'
import { ActivityIndicator, IconButton } from 'react-native-paper'

export const StatusIcon = React.memo(({
  currentUserIsAuthor,
  showStatus,
  status,
}: {
  currentUserIsAuthor: boolean
  showStatus: boolean
  status?: MessageType.Any['status']
}) => {
  const { colors } = useTheme();
  const [statusIcon, setStatusIcon] = React.useState<React.ReactNode | null>(null)

  React.useEffect(() => {
    if (showStatus) {
      switch (status) {
        case 'delivered':
          setStatusIcon(<IconButton icon="check-all" size={10} />)
          break;
        case 'sent':
          setStatusIcon(<IconButton iconColor={colors.text_normal} icon="check" size={10} />)
          break;
        case 'error':
          setStatusIcon(<IconButton iconColor={colors.color_red} icon="alert-circle-outline" size={10} />)
          break;
        case 'seen':
          setStatusIcon(<IconButton iconColor={colors.text_link} icon="check-all" size={10} />)
          break;
        case 'sending':
          setStatusIcon(<ActivityIndicator size={10} />)
          break;
        default:
          break;
      }
    }
  }, [status])

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
