import React from "react";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

import SearchModal from "../../Components/Search/SearchModal";

const Stack = createStackNavigator();

const SearchStack = () => {

    return (
        <Stack.Navigator initialRouteName="SearchModal">
          <Stack.Screen name="SearchModal" component={SearchModal} options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, 
            headerShown: false
          }} />

        </Stack.Navigator>
    );
};

export default SearchStack;
