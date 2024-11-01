import React, { ReactNode } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";

interface ModalComponentProps {
  visible: boolean;
  title: string;
  content: ReactNode; // Accept any component as content
  onClose: () => void;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  visible,
  title,
  content,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose} // Close the modal when the overlay is pressed
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{title}</Text>
          <View style={styles.modalContent}>{content}</View>
          {/* Render the content component */}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#F9EFE3",
    padding: 20,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: Colors.default.colorTextBrown,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
    color: Colors.default.colorTextBrown,
  },
  modalContent: {
    marginTop: 10,
  },
});

export default ModalComponent;
