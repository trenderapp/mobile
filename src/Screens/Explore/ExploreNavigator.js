import * as React from 'react';
import { useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useTheme } from '../../Components/Container';
import ExploreRecentTrendsScreen from './ExploreRecentTrendsScreen';
import ExploreTopTrendsScreen from './ExploreTopTrendsScreen';

const renderScene = SceneMap({
  topTrends: ExploreTopTrendsScreen,
  recentTrends: ExploreRecentTrendsScreen,
});

function ExploreScreenNavigator() {

  const layout = useWindowDimensions();
  const { colors } = useTheme();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'topTrends', title: 'Top of the day' },
    { key: 'recentTrends', title: 'Last Trends' },
  ]);

  const renderTabBar = (props) => (
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

export default ExploreScreenNavigator;