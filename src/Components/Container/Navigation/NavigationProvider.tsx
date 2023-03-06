import * as React from 'react';
import NavigationContext, { NavigationContextI } from './NavigationContext';

type SectionProps = React.FC<{
    value: NavigationContextI,
    children: JSX.Element
}>;

const NavigationProvider: SectionProps = ({ value, children }): JSX.Element => {
    
    return (
        <NavigationContext.Provider value={value}>
            {children}
        </NavigationContext.Provider>
    );
}

export default NavigationProvider;