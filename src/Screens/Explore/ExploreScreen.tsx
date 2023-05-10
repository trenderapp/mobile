import * as React from 'react';
import { ExploreContainer } from '../../Components/Container';
import ExploreScreenNavigator from './ExploreNavigator';


function ExploreScreen() {
  return (
    <ExploreContainer>
      <ExploreScreenNavigator />
    </ExploreContainer>
  );
}

export default ExploreScreen;