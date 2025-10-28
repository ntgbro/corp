import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { Service } from '../../../types/firestore';

interface ServiceCardProps {
  service: Service;
  onPress: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onPress }) => {
  const { theme } = useThemeContext();

  return (
    <TouchableOpacity onPress={onPress} style={{ alignItems: 'center', margin: 5 }}>
      <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: theme.colors.surface, justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ color: theme.colors.text, fontSize: 24 }}>{service.icon}</Text>
      </View>
      <Text style={{ color: theme.colors.text, fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>{service.name}</Text>
    </TouchableOpacity>
  );
};

export default ServiceCard;
