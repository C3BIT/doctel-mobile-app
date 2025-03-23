import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';

export const DatePicker = ({
  label,
  value,
  onPress,
  isVisible,
  onDateSelect,
  onCancel,
}) => {
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    
    try {
      if (dateStr.includes('-')) {
        return new Date(dateStr + 'T00:00:00');
      }
      
      if (dateStr.includes('/')) {
        const [year, month, day] = dateStr.split('/');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
      
      return new Date();
    } catch (error) {
      console.error('Error parsing date:', error);
      return new Date();
    }
  };

  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return '';
    
    try {
      const date = parseDate(dateStr);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch (error) {
      return dateStr;
    }
  };

  const selectedDate = parseDate(value);
  const displayDate = formatDateForDisplay(value);

  const toISODateString = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateSelect = (date) => {
    const isoDate = toISODateString(date);
    onDateSelect(isoDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={styles.dateText}>{displayDate || 'Select date'}</Text>
        <Calendar size={20} color="#666" />
      </TouchableOpacity>

      {isVisible && (
        Platform.OS === 'ios' ? (
          <Modal
            visible={isVisible}
            transparent
            animationType="slide"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={onCancel}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDateSelect(selectedDate)}>
                    <Text style={styles.doneText}>Done</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  onChange={(event, date) => {
    
                  }}
                  style={styles.iosDatePicker}
                />
              </View>
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              onCancel();
              if (date && event.type === 'set') handleDateSelect(date);
            }}
          />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: 'white',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
  },
  doneText: {
    fontSize: 16,
    color: '#20ACE2',
    fontWeight: '600',
  },
  iosDatePicker: {
    height: 200,
  },
});