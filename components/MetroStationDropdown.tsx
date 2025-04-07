import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";

const MetroStationDropdown = ({ zIndex, placeholder, onSelect }) => {
  const [stations, setStations] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await axios.get("http://192.168.133.42:3000/api/stations");
        const stationList = response.data.map((station) => ({
          label: station.station_name,
          value: station.station_name,
        }));
        setStations(stationList);
      } catch (error) {
        console.error("Error fetching stations:", error);
      }
    };

    fetchStations();
  }, []);

  const handleSelect = (value) => {
    setSelectedStation(value);
    if (onSelect) {
      onSelect(value); // Notify parent component
    }
  };

  return (
    <View style={[styles.container, { zIndex }]}>
      <DropDownPicker
        open={open}
        value={selectedStation}
        items={stations}
        setOpen={setOpen}
        setValue={handleSelect} // Call handleSelect on selection
        setItems={setStations}
        placeholder={placeholder}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropDownContainer}
        textStyle={styles.text}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    elevation: 5,
  },
  dropdown: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  dropDownContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    color: "#374151",
  },
});

export default MetroStationDropdown;
