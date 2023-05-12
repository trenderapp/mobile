import React from "react";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

import SearchScreen from "../../Components/Search/SearchModal";

const Stack = createStackNavigator();

const SearchStack = () => {

    return (
        <Stack.Navigator initialRouteName="SearchModal">
          <Stack.Screen name="SearchModal" component={SearchScreen} options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, 
            headerShown: false
          }} />

        </Stack.Navigator>
    );
};

export default SearchStack;
