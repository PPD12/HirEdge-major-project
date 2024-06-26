import React from 'react';
import { StyleSheet, View, ScrollView, ToastAndroid } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../../../utils/axiosPrivate';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Button, Text } from '@rneui/themed';
import { RefreshControl } from 'react-native-gesture-handler';
import DriveInteractionButton from '../../../components/common/DriveInteractionButton/DriveInteractionButton';

const DrivePage = ({ route, navigation }: DrawerScreenProps<StudentDrawerParamList, "Drive">) => {
    const api = useAxiosPrivate();
    const drive = route.params.drive_id;

    const result = useQuery({
        queryKey: ['fetchDrive', drive],
        queryFn: async (): Promise<DriveStudentDataType> => (
            api.get(`/student/drive/${drive}`).then(res => res.data)
        ),
        staleTime: 30000
    });

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={{
                    minHeight: "100%"
                }}
                refreshControl={<RefreshControl refreshing={result.isLoading} onRefresh={result.refetch} />}
            >
                <View style={styles.box}>
                    {result.isSuccess && (
                        <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'column' }}>
                            <View style={{ flex: 1 }}>
                            <Text style={styles.companyName} h2>{result.data?.company_details.company_name}</Text>
                            <Text h4> Tier - {result.data.tier}</Text>
                            <Text h4>Company Website: {result.data?.company_details.company_website}</Text>
                            <Text h4>Job Title: {result.data?.job_title}</Text>
                            <Text h4>CTC: {result.data.job_ctc}</Text>

                            <Text h4 style={styles.eligibilityTitle}>Eligibility Criteria</Text>
                            <View style={styles.eligibilityContainer}>
                                <Text h4>Branch: {result.data.branch.join(', ')}</Text>
                                <Text h4>10th Marks: {result.data.tenth_cutoff ? `${result.data.tenth_cutoff}%` : 'No Criteria'}</Text>
                                <Text h4>12th Marks: {result.data.twelfth_cutoff ? `${result.data.twelfth_cutoff}%` : 'No Criteria'}</Text>
                                <Text h4>UG CGPA: {result.data.ug_cutoff || 'No Criteria'}</Text>
                            </View>

                            <View style={styles.jobLocationsContainer}>
                                <Text h4>Job Locations: </Text>
                                <View style={styles.jobLocations}>
                                    {result.data.job_locations.map((city, index) => (
                                        <Text key={index} style={styles.jobLocation}>{city}</Text>
                                    ))}
                                </View>
                                </View>
                            <Text h4>Job Description</Text>
                            <Text style={styles.jobDescription}>{result.data.job_description}</Text>
                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Updates</Text>

                                <View>
                                    {
                                        result.data.updates.map((update, index) => (
                                            <View key={index}>
                                                {/* <Text style={{ textTransform: 'capitalize' }}> {update.type}</Text> */}
                                                {/* <Text>{update.description}</Text>

                                                <></> */}
                                            </View>))
                                    }
                                </View>

                            </View>
                            <View style={styles.buttonsContainer}>

                                <DriveInteractionButton eligible={result.data.eligible} registered={result.data.registered} drive_id={result.data._id} />

                                <Button
                                    title="Company Info"
                                    onPress={() => {
                                        navigation.navigate('Company', {
                                            company_id: result.data.company_details._id
                                        });
                                    }}
                                    titleStyle={{
                                        fontSize: 20
                                    }}
                                    buttonStyle={{
                                        backgroundColor: "#107387"
                                    }}
                                />
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        marginVertical: -1,
    },
    contentContainer: {
        flexGrow: 1,
    },
    box: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 10,
        padding: 20,
        margin: 20,
        backgroundColor: '#FFFFFF',
    },
    companyName: {
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 30, // Increased space between each line
        color: '#107387',
    },
    eligibilityTitle: {
        marginTop: 10,
        marginBottom: 5, // Increased space between each line
        color: '#107387',
    },
    eligibilityContainer: {
        marginBottom: 10, // Increased space between each line
    },
    jobLocationsContainer: {
        marginBottom: 10, // Increased space between each line
    },
    jobLocations: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    jobLocation: {
        fontSize: 16,
        marginRight: 10,
        marginBottom: 25, // Increased space between each line
        color: '#666666',
    },
    jobDescription: {
        fontSize: 16,
        marginBottom: 0, // Increased space between each line
        color: '#333333',
    },
    buttonsContainer: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    registerButtonContainer: {
        flex: 1,
        marginRight: 10,
    },
    buttonTitle: {
        fontSize: 20,
    },
    registerButton: {
        borderRadius: 20,
        backgroundColor: 'primary',
        flex: 1
    },
    knowMoreButton: {
        borderRadius: 20,
        backgroundColor: '#107387',
        flex: 1,
    },
});

export default DrivePage;
