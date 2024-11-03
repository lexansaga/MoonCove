import React, { ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
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
          <View style={styles.modalContent}>
            {content}

            <View
              style={{
                flex: 1,
                height: "100%",
                width: "100%",
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
              }}
              pointerEvents="none"
            >
              <Image
                source={require("@Assets/shooting-star.png")}
                style={styles.floatingRight}
              />
              <Image
                source={require("@Assets/planet.png")}
                style={styles.floatingLeft}
              />
            </View>
          </View>
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
    color: Colors.default.colorTextBrown,
    fontFamily: "HazelnutMilktea-Bold",
  },
  modalContent: {
    marginTop: 10,
  },
  floatingLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    transform: [{ translateX: -75 }, { translateY: 280 }],
    width: "50%",
    resizeMode: "contain",
    pointerEvents: "none",
  },
  floatingRight: {
    position: "absolute",
    top: 0,
    right: 0,
    transform: [{ translateX: 50 }, { translateY: -280 }],
    width: "50%",
    resizeMode: "contain",
    pointerEvents: "none",
  },
});

export default ModalComponent;
