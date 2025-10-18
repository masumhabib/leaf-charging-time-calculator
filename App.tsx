/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import {Text, TextInput, View, Button, StyleSheet, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Float, Int32 } from 'react-native/Libraries/Types/CodegenTypes';

const LEAF_TRICLE_CHARGING_RATE = 1.4; // kW
const LEAF_BATTERY_SIZE = 62; // kWh
const LEAF_MAX_CHARGE = 80; // %

const App = () => {
  const [percentCharge, setPercentCharge] = useState(50);
  const [chargingTime, setChargingTime] = useState(0);
  const [chargingStartTime, setChargingStartTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [chargingEndTime, setChargingEndTime] = useState('');

  useEffect(() => {
    calculateChargingEndTime();
  }, [chargingStartTime, chargingTime]);

  const calculateChargingTime = (batterySize:Float, chargingRate: Float, maxCharge:Float, currentCharge: Float) => {
    if (currentCharge >= maxCharge) {
      return 0; // No charging needed
    }

    const chargeNeeded = maxCharge - currentCharge;
    const energyNeeded = (chargeNeeded / 100) * batterySize;
    const timeToCharge = energyNeeded / chargingRate;

    return timeToCharge;
  };

  const handlePercentChargeChange = (value: string) => {
    const percentCharge = parseFloat(value);
    if (!isNaN(percentCharge)) {
      setPercentCharge(percentCharge);
      const chargingTime = calculateChargingTime(LEAF_BATTERY_SIZE, LEAF_TRICLE_CHARGING_RATE, LEAF_MAX_CHARGE, percentCharge);
      setChargingTime(chargingTime);
    } else {
      setPercentCharge(0); // Reset to 0 if input is invalid
    }
  };

   const onStartTimeChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || chargingStartTime;
    setShowTimePicker(Platform.OS === 'ios');
    setChargingStartTime(currentDate);
  };

  const showMode = (currentMode: any) => {
    setShowTimePicker(true);
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const calculateChargingEndTime = () => {
    const startTime = moment(chargingStartTime);
    const endTime = startTime.add(chargingTime, 'hours');
    setChargingEndTime(endTime.format('h:mm A'));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaf Charging</Text>
      <Text style={styles.label}>Charging starts at: {moment(chargingStartTime).format('h:mm A')}</Text>
      <Button onPress={showTimepicker} title="Change" />
      {showTimePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={chargingStartTime}
          mode={'time'}
          is24Hour={false}
          display="default"
          onChange={onStartTimeChange}
        />
      )}
      
      <Text style={styles.label}>Current charge (%): </Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter charge percentage"
        value={percentCharge.toString()}
        onChangeText={handlePercentChargeChange}
      />
      <Text style={styles.result}>
        Time to charge {LEAF_MAX_CHARGE}%: {chargingTime.toFixed(1)} hr
      </Text>
      <Text style={styles.result}>
        Charging ends at: {chargingEndTime}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    marginTop: 50,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: '#20232a',
    borderRadius: 12,
    backgroundColor: '#61dafb',
    color: '#20232a',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  label: {
    marginTop: 16,
    color: '#20232a',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
  },

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    fontWeight: 'bold',
  },
  result: {
    marginTop: 16,
    paddingVertical: 8,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  }
});

export default App;
