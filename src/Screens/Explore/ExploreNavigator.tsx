import * as React from 'react';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useTheme } from '../../Components/Container';
import ExploreRecentTrendsScreen from './ExploreRecentTrendsScreen';
import ExploreTopTrendsScreen from './ExploreTopTrendsScreen';
import ExploreRecentWorldTrendsScreen from './ExploreRecentWorldTrendsScreen';
import ExploreTopWorldTrendsScreen from './ExploreTopWorldTrendsScreen';
import { full_width } from '../../Style/style';
import { useTranslation } from 'react-i18next';

const renderScene = SceneMap({
  topTrends: ExploreTopTrendsScreen,
  //topUsers: ExploreTopTrendsScreen,
  recentTrends: ExploreRecentTrendsScreen,
  recentWorldTrends: ExploreRecentWorldTrendsScreen,
  topWorldTrends: ExploreTopWorldTrendsScreen
});

function ExploreScreenNavigator() {

  const { colors } = useTheme();
  const { t } = useTranslation();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'topTrends', title: t("commons.top_of_day") },
    //{ key: 'topUsers', title: t("commons.top_users_of_day") },
    { key: 'recentTrends', title: t("commons.last_trends") },
    { key: 'topWorldTrends', title: t("commons.top_world_trends_day") },
    { key: 'recentWorldTrends', title: t("commons.last_word_trends") },
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
        textTransform: "capitalize"
      }}
      tabStyle={{
        width: "auto"
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