import * as React from 'react';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useTheme } from '../../Components/Container';
import ExploreRecentTrendsScreen from './ExploreRecentTrendsScreen';
import ExploreTopTrendsScreen from './ExploreTopTrendsScreen';
import ExploreRecentWorldTrendsScreen from './ExploreRecentWorldTrendsScreen';
import ExploreTopWorldTrendsScreen from './ExploreTopWorldTrendsScreen';
import { full_width } from '../../Style/style';

const renderScene = SceneMap({
  topTrends: ExploreTopTrendsScreen,
  recentTrends: ExploreRecentTrendsScreen,
  recentWorldTrends: ExploreRecentWorldTrendsScreen,
  topWorldTrends: ExploreTopWorldTrendsScreen
});

function ExploreScreenNavigator() {

  const { colors } = useTheme();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'topTrends', title: 'Top of the day' },
    { key: 'recentTrends', title: 'Last Trends' },
    { key: 'topWorldTrends', title: 'Top World Trends' },
    { key: 'recentWorldTrends', title: 'Last World Trends' },
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
      initialLayout={{ width: full_width, height: 0 }}
    />
  );
}

export default ExploreScreenNavigator;