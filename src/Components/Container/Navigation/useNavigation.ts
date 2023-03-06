import * as React from 'react';

import NavigationContext from './NavigationContext';

export default function useNavigation() {
  const navigation = React.useContext(NavigationContext);

  return navigation;
}
