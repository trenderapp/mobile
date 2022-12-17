import React from "react";
import { RecentTrends } from "../../Components/Explore";
import { PostsRecentTrendsContextProvider } from "../../Components/Explore/RecentTrends/PostsRecentTrendsContext";

function ExploreRecentTrendsScreen() {
 
    return (
        <PostsRecentTrendsContextProvider>
            <RecentTrends />
        </PostsRecentTrendsContextProvider>
    )
}

export default ExploreRecentTrendsScreen;