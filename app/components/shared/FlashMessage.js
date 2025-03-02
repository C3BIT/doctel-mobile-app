import { showMessage } from "react-native-flash-message";

const FlashMessage = {
  success: (message) => {
    showMessage({
      message: "Success",
      description: message,
      type: "success",
      icon: "success",
      backgroundColor: "#28a745",
      color: "#fff",
    });
  },

  error: (message) => {
    showMessage({
      message: "Error",
      description: message,
      type: "danger",
    //   icon: "danger",
      backgroundColor: "#dc3545",
      color: "#fff",
    });
  },

  warning: (message) => {
    showMessage({
      message: "Warning",
      description: message,
      type: "warning",
    //   icon: "warning",
      backgroundColor: "#ffc107",
      color: "#333",
    });
  },

  info: (message) => {
    showMessage({
      message: "Info",
      description: message,
      type: "info",
      icon: "info",
      backgroundColor: "#17a2b8",
      color: "#fff",
    });
  },

  custom: (message, backgroundColor = "#6f42c1") => {
    showMessage({
      message: "Custom Alert",
      description: message,
      type: "default",
      icon: "auto",
      backgroundColor,
      color: "#fff",
    });
  },
};

export default FlashMessage;
