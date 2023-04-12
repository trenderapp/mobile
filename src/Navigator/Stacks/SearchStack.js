import React from "react";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

import SearchModal from "../../Components/Search/SearchModal.js";
import ExploreScreen from "../../Screens/Explore/ExploreScreen";

const Stack = createStackNavigator();

const SearchStack = () => {

    return (
        <Stack.Navigator initialRouteName="SearchScreen">

          <Stack.Screen name="SearchScreen" component={ExploreScreen} options={{
            headerShown: false
          }}/>
          <Stack.Screen name="SearchModal" component={SearchModal} options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, 
            headerShown: false
          }} />

        </Stack.Navigator>
    );
};

export default SearchStack;
