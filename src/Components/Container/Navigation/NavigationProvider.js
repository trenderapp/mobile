import * as React from 'react';
import NavigationContext from './NavigationContext';

function NavigationProvider({ value, children }) {

    return (
        <NavigationContext.Provider value={value}>
            {children}
        </NavigationContext.Provider>
    );
}

export default NavigationProvider;