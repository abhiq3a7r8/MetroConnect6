import React from 'react';
import { View, StyleSheet ,Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

const BarChartComponent = ({ data }) => {
    return (
        <View style={styles.chartContainer}>
            <Text className='text-xl'>Peak Hours</Text>
            <BarChart 
                barWidth={22}
                noOfSections={3}
                barBorderRadius={4}
                frontColor="lightgray"
                data={data}
                yAxisThickness={0}
                xAxisThickness={0}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    chartContainer: {
        marginTop: 32,
        backgroundColor: 'white',
        height: 288,
        width: '90%',
        borderRadius: 10,
        alignItems: 'center',
        padding: 16,
    },
});

export default BarChartComponent;