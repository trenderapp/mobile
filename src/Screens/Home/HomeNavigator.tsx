import React, { memo, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useTheme } from '../../Components/Container';
import FollowsTrends from './FollowsTrends';
// import ExploreScreenNavigator from '../Explore/ExploreNavigator';

const renderScene = SceneMap({
  followTrends: FollowsTrends,
});

function HomeNavigator() {

  const layout = useWindowDimensions();
  const { colors } = useTheme();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'followTrends', title: 'Follows' },
  ]);

  const renderTabBar = (props: any) => {
    
    return (
        <TabBar
          {...props}

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
        />
      )
  };

  /*return (
    <TabView
      renderTabBar={renderTabBar}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );*/
  return <FollowsTrends />
}

export default memo(HomeNavigator);