import * as React from 'react';
import { useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useTheme } from '../../Components/Container';
import FollowListScreen from './FollowListScreen';
import NotificationListScreen from './NotificationListScreen';

const renderScene = SceneMap({
  followScreen: FollowListScreen,
  notificationScreen: NotificationListScreen,
});

function NotificationNavigator() {

  const layout = useWindowDimensions();
  const { colors } = useTheme();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'notificationScreen', title: 'Last notification' },
    { key: 'followScreen', title: 'Followers' },
  ]);

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={{
        backgroundColor: colors.bg_secondary
      }}
      style={{
        backgroundColor: colors.bg_primary
      }}
      labelStyle={{
        color: colors.text_normal,
        textTransform: "none"
      }}
      tabStyle={{
        width: 'auto'
      }}
    />
  );

  return (
    <TabView
      renderTabBar={renderTabBar}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}

export default NotificationNavigator;