import { StyleSheet, View, useWindowDimensions } from 'react-native'
import React from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'
import useAxiosPrivate from '../../../utils/axiosPrivate';
import { MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';

import { Text } from '@rneui/themed';

interface DriveData {
    _id: string;
    company_id: string;
    company_name: string;
    job_title: string;
    current_status: string;
    status: Array<{
        usn: string;
        status: string;
    }>
}

interface RegisteredDrivesResponseType {
    metadata: {
        totalCount: number;
        pageCount: number;
        page: number;
    }, data: Array<DriveData>
}

const RegisteredDrives = () => {
    const { height, width } = useWindowDimensions();

    const api = useAxiosPrivate();

    const { data, isSuccess, isError, isLoading, fetchNextPage } = useInfiniteQuery({
        queryKey: ['participatedDrives'],
        queryFn: (): Promise<RegisteredDrivesResponseType> => {
            return api.get('/student/drives/participated').then((res) => { return res.data.drives });
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.metadata.page < lastPage.metadata.pageCount) {
                return (lastPage.metadata.page + 1);
            }
            return undefined;
        },
        initialPageParam: 1,
        getPreviousPageParam: (lastPage) => {
            if (lastPage.metadata.page > 1)
                return lastPage.metadata.page - 1;

            return undefined;
        }
    })

    if (isError) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                height: height * 0.4,
            }}><MaterialIcons name="error-outline" size={24} color="red" />
                <Text style={{ fontSize: 30 }}>Something Went Wrong.....</Text>
            </View>)
    }

    if (isSuccess)
        return (
            <View style={[styles.panelContainer, {
                flex: 1,
                minHeight: height * 0.6
            }]}><Text h4 style={{ marginBottom: 10 }} onPress={() => {

            }}>{"Drives You Registered For"}</Text>
                <FlashList
                    data={[...data.pages.flatMap((data) => (data.data)), ...data.pages.flatMap((data) => (data.data)), ...data.pages.flatMap((data) => (data.data))]}
                    renderItem={({ item, index }) => (<View style={{
                        backgroundColor: 'lightgrey',
                        height: height * 0.2,
                        borderRadius: 20,
                        padding: 7
                    }}>
                        <Text h4>{item.company_name}</Text>

                    </View>)}
                    estimatedItemSize={5}
                    onEndReached={fetchNextPage}
                    ItemSeparatorComponent={() => (<View style={{ height: 10 }}></View>)}
                />
            </View>
        )

    return null
}

export default RegisteredDrives

const styles = StyleSheet.create({
    panelContainer: {

    }
})