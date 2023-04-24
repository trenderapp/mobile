import React from 'react';
import { View, FlatList } from 'react-native';
import { Loader } from '../../Other';
import { useTheme } from '../Container';
import { UserInfo } from '../Member';
import { full_width } from '../../Style/style';

function MemberList({ list, loader, onBottom }) {
    const { colors } = useTheme();

    const onScroll = e => {
        if (!onBottom) return;
        let mHeight = e.nativeEvent.layoutMeasurement.height;
        let cSize = e.nativeEvent.contentSize.height;
        let Y = e.nativeEvent.contentOffset.y;

        if (Math.ceil(mHeight + Y) >= cSize) return onBottom();
    };

    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                backgroundColor: colors.bg_primary,
            }}>
            {
                <FlatList
                    onScroll={e => onScroll(e)}
                    data={list}
                    style={{
                        width: full_width
                    }}
                    ListEmptyComponent={<Loader />}
                    ListFooterComponent={loader && <Loader />}
                    renderItem={({ item }) => <UserInfo full_width informations={item} />}
                />
            }
        </View>
    );
}

export default MemberList;
