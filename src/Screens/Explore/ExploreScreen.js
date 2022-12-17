import * as React from 'react';
import { SearchContainer } from '../../Components/Container';
import ExploreScreenNavigator from './ExploreNavigator';


function ExploreScreen() {
  return (
    <SearchContainer>
        <ExploreScreenNavigator />
    </SearchContainer>
  );
}

export default ExploreScreen;