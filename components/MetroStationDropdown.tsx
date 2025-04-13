import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";

const MetroStationDropdown = ({ placeholder, onSelect }) => {
  const [stations, setStations] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await axios.get("https://qgv0fszlng.execute-api.ap-south-1.amazonaws.com/default/GetStationsFromDB");
        
        if (response.data && Array.isArray(response.data)) {
          const stationList = response.data.map((station, index) => ({
            label: station.name,
            value: station.name || '',
            name: station.name || '',
            line: station.line_name || '',
            key: `station-${index}`,
          }));
          
          setStations(stationList);
        } else {
          console.error("Invalid response data format:", response.data);
          setStations([]);
        }
      } catch (error) {
        console.error("Error fetching stations:", error);
        setStations([]);
      }
    };
    fetchStations();
  }, []);

  const handleSelect = (value: any) => {
    setSelectedStation(value);
    if (onSelect) {
      onSelect(value);
    }
  };

  return (
    <View style={[styles.container, open ? { marginBottom: 200 } : {}]}>
      <DropDownPicker
        open={open}
        value={selectedStation}
        items={stations}
        setOpen={setOpen}
        setValue={setSelectedStation}
        setItems={setStations}
        onChangeValue={handleSelect}
        placeholder={placeholder || "Select a station"}
        style={styles.dropdownStyle}
        dropDownContainerStyle={styles.dropdownContainerStyle}
        textStyle={styles.textStyle}
        listItemContainerStyle={styles.listItem}
        renderListItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemRow}
            onPress={() => {
              setSelectedStation(item.value);
              handleSelect(item.value);
              setOpen(false); 
            }}
          >
            <Text className="font-poppinsMedium w-40">{item.name}</Text>
            <Text className="font-poppins bg-blue-200 p-[1] px-1">{item.line}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    position: "relative",
    paddingBottom: 10,
  },
  dropdownStyle: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  dropdownContainerStyle: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  textStyle: {
    fontSize: 16,
    color: "#374151",
  },
  listItem: {
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
  },
  stationText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937", // dark gray
    fontFamily: "Poppins-Medium",
  },
  lineText: {
    fontSize: 14,
    color: "#2563EB", // blue-600
    fontFamily: "Poppins-Regular",
  },
});

export default MetroStationDropdown;
