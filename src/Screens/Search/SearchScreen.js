import React from 'react';
import { SearchContainer } from '../../Components/Container';
import { Text } from 'react-native-paper';

function SearchScreen() {

    return (
        <SearchContainer>
            <Text>No trends in your selected region. Create the first trend of the day !</Text>
        </SearchContainer>
    )
}

export default SearchScreen;