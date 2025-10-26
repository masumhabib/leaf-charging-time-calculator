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
  const newDateWithHour = (currentHour: Int32) => {
    const date = new Date();
    date.setHours(currentHour, 0, 0);
    return date;
  };


  const [percentCharge, setPercentCharge] = useState(30);
  const [chargingTime, setChargingTime] = useState(0);
  //const [chargingStartTime, setChargingStartTime] = useState(new Date().setHours(20,0,0));
  const [chargingStartTime, setChargingStartTime] = useState(newDateWithHour(20));
  //const [chargingStartTime, setChargingStartTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [chargingEndTime, setChargingEndTime] = useState('');

  useEffect(() => {
    //calculateChargingEndTime();
    recalculate();
  }, [chargingStartTime, percentCharge]);

  //useEffect(() => {
  //  //calculateChargingEndTime();
  //  console.log("DBG: useEffect chargingTime=", chargingTime);
  //}, [chargingTime]);

  // ========================= MAIN CALCULATION =======================================

  const calculateChargingTime = (batterySize:Float, chargingRate: Float, maxCharge:Float, currentCharge: Float) => {
    if (currentCharge >= maxCharge) {
      return 0; // No charging needed
    }

    const chargeNeeded = maxCharge - currentCharge;
    const energyNeeded = (chargeNeeded / 100) * batterySize;
    const timeToCharge = energyNeeded / chargingRate;

    return timeToCharge;
  };

  const calculateChargingEndTime = (newChargingTime:Float) => {
    const startTime = moment(chargingStartTime);
    //console.log("DBG: startTime=", startTime.format('h:mm A'));
    const endTime = startTime.add(newChargingTime, 'hours');
    return endTime
  };

  const recalculate = () => {
    //console.log("DBG: percentCharge=", percentCharge);
    let newChargingTime = calculateChargingTime(LEAF_BATTERY_SIZE, LEAF_TRICLE_CHARGING_RATE, LEAF_MAX_CHARGE, percentCharge);
    //console.log("DBG: newChargingTime=", newChargingTime);
    //console.log("DBG: before chargingTime=", chargingTime);
    setChargingTime(newChargingTime);
    //console.log("DBG: after chargingTime=", chargingTime);
    const endTime = calculateChargingEndTime(newChargingTime)
    //console.log("DBG: endTime=", endTime.format('h:mm A'));
    setChargingEndTime(endTime.format('h:mm A'));
  };

  // ========================= /MAIN CALCULATION ======================================

  const handlePercentChargeChange = (value: string) => {
    const newPercentCharge = parseFloat(value);
    if (!isNaN(newPercentCharge)) {
      setPercentCharge(newPercentCharge);
      //const chargingTime = calculateChargingTime(LEAF_BATTERY_SIZE, LEAF_TRICLE_CHARGING_RATE, LEAF_MAX_CHARGE, percentCharge);
      //setChargingTime(chargingTime);
    } else {
      //console.log("DBG: NaN chargingTime=", chargingTime);
      setPercentCharge(0); // Reset to 0 if input is invalid
      //console.log("DBG: NaN chargingTime=", chargingTime);
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


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaf Charging</Text>

      <View style={styles.inputContainer}>
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
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Current charge (%): </Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter charge percentage"
          value={percentCharge.toString()}
          onChangeText={handlePercentChargeChange}
        />
      </View>
      <Text style={styles.result}>
        Time to charge {LEAF_MAX_CHARGE}%: {chargingTime.toFixed(1)} hr
      </Text>
      <Text style={styles.charging_end_time}>
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
    marginBottom: 25,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: '#20232a',
    borderRadius: 10,
    backgroundColor: '#61dafb',
    color: '#20232a',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row', // Arrange label and input horizontally
    alignItems: 'center', // Vertically align items in the container
    justifyContent: 'space-between', // Add space between label and input
    marginVertical: 10, // Add vertical margin for spacing
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10, // Add some right margin to the label
  },
  input: {
    flex: 1, // Take remaining space
    height: 40,
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
  },
  result: {
    marginTop: 16,
    paddingVertical: 8,
    textAlign: 'center',
    fontSize: 20,
    borderWidth: 2,
    color: '#20232a',
    borderRadius: 10,
  },
  charging_end_time: {
    marginTop: 16,
    paddingVertical: 8,
    textAlign: 'center',
    fontSize: 20,
    borderWidth: 2,
    color: '#20232a',
    borderRadius: 10,
    backgroundColor: '#d0fffe',
  }

});

export default App;
