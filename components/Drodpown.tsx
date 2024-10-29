import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Colors } from "@/constants/Colors";
import Input from "@/components/Input";
import { FontAwesome } from "@expo/vector-icons";

interface PopupSelectProps {
  label: string;
  options: Array<{ id: string; label: string }>;
  onSelect: (value: string) => void;
}

export default function Dropdown({
  label,
  options,
  onSelect,
}: PopupSelectProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onSelect(value);
    setModalVisible(false);
  };

  return (
    <View>
      {/* Display selected value or label */}
      <TouchableOpacity
        style={styles.selectContainer}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.selectText}>
          {selectedValue ? selectedValue : label}
        </Text>
        <FontAwesome
          name="chevron-down"
          size={16}
          color={Colors.default.colorTextBrown}
        />
      </TouchableOpacity>

      {/* Modal for options */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{label}</Text>
            <FlatList
              data={options}
              style={styles.selectionContainer}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.optionContainer,
                    index !== options.length - 1 && styles.evenOptionContainer,
                  ]}
                  onPress={() => handleSelect(item.label)}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  selectContainer: {
    backgroundColor: "#E6D4C5",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    color: Colors.default.colorTextBrown,
    fontFamily: "HazelnutMilktea-Bold",
  },
  selectionContainer: {
    width: "100%",
  },
  selectText: {
    color: Colors.default.colorTextBrown,
    fontWeight: "500",
    letterSpacing: 1.2,
    fontFamily: "HazelnutMilktea-Bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: Colors.default.colorSecondary,
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.default.colorTextBrown,
    marginBottom: 20,
    fontFamily: "HazelnutMilktea-Bold",
  },
  optionContainer: {
    paddingVertical: 15,
    paddingHorizontal: 5,
    width: "100%",
    alignItems: "flex-start",
  },
  evenOptionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.default.colorTextBrownAccent,
  },
  optionText: {
    color: Colors.default.colorTextBrown,
    fontWeight: "500",
    fontFamily: "HazelnutMilktea-Bold",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.default.colorPrimary,
    borderRadius: 10,
  },
  closeButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontFamily: "HazelnutMilktea-Bold",
  },
});
