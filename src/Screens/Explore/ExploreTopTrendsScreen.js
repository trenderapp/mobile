import React from "react";
import { TopTrends } from "../../Components/Explore";
import { PostsTopTrendsContextProvider } from "../../Components/Explore/TopTrends/PostsTopTrendsContext";

function ExploreTopTrendsScreen() {
 
    return (
        <PostsTopTrendsContextProvider>
            <TopTrends />
        </PostsTopTrendsContextProvider>
    )
}

export default ExploreTopTrendsScreen;