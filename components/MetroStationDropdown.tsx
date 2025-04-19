import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";

const MetroStationDropdown = ({ placeholder, onSelect }: any) => {
  const [stations, setStations] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedLine, setSelectedLine] = useState(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await axios.get(
          "https://qgv0fszlng.execute-api.ap-south-1.amazonaws.com/default/GetStationsFromDB"
        );

        if (response.data && Array.isArray(response.data)) {
          const stationList = response.data.map((station, index) => ({
            label: station.name,
            value: station.name || "",
            name: station.name || "",
            line: station.line_name || "Unknown Line", // fallback
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

  const handleSelect = (value: any, line: any) => {
    setSelectedStation(value);
    setSelectedLine(line);

    // Send directly to parent immediately
    if (onSelect) {
      onSelect(value, line);
    }

    // Log actual values being selected
    console.log("Selected station:", value);
    console.log("Selected line:", line);
  };

  useEffect(() => {
    if (selectedStation && selectedLine) {
      console.log("State updated → Station:", selectedStation, "Line:", selectedLine);
    }
  }, [selectedStation, selectedLine]);

  const getLineClass = (lineName: any) => {
    switch ((lineName || "").toLowerCase()) {
      case "line 1":
        return "bg-blue-500";
      case "line 2a":
        return "bg-yellow-400";
      case "line 2b":
        return "bg-orange-400";
      case "line 7":
        return "bg-red-500";
      case "line 6":
        return "bg-purple-500";
      case "line 3":
        return "bg-red-600";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <View style={[styles.container, open ? { marginBottom: 200 } : {}]}>
      <DropDownPicker
        open={open}
        value={selectedStation}
        items={stations}
        searchable={true}
        setOpen={setOpen}
        setValue={setSelectedStation}
        setItems={setStations}
        onChangeValue={() => {}} // not used
        placeholder={placeholder || "Select a station"}
        style={styles.dropdownStyle}
        dropDownContainerStyle={styles.dropdownContainerStyle}
        textStyle={styles.textStyle}
        listItemContainerStyle={styles.listItem}
        searchContainerStyle={styles.searchContainer}
        searchTextInputStyle={styles.searchInput}
        renderListItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemRow}
            onPress={() => {
              handleSelect(item.value, item.line);
              setOpen(false);
            }}
          >
            <Text className="font-poppinsMedium w-40">{item.name}</Text>
            <Text
              className={`font-poppins text-white px-1 rounded ${getLineClass(
                item.line
              )}`}
            >
              {item.line}
            </Text>
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
  searchContainer: {
    borderBottomColor: "#D1D5DB",
    borderBottomWidth: 1,
  },
  searchInput: {
    fontSize: 16,
    color: "black",
    borderColor: "grey",
    backgroundColor: "#F3F4F6",
  },
});

export default MetroStationDropdown;
