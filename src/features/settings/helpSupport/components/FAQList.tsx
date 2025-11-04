import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeContext } from '../../../../contexts/ThemeContext';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQListProps {
  faqs: FAQItem[];
}

export const FAQList: React.FC<FAQListProps> = ({ faqs }) => {
  const { theme } = useThemeContext();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      {faqs.map((faq) => (
        <View 
          key={faq.id} 
          style={[styles.faqItem, { 
            backgroundColor: theme.colors.surface, 
            borderColor: theme.colors.border 
          }]}
        >
          <TouchableOpacity 
            style={styles.questionContainer}
            onPress={() => toggleExpand(faq.id)}
          >
            <Text style={[styles.question, { color: theme.colors.text }]}>{faq.question}</Text>
            <Text style={[styles.expandIcon, { color: theme.colors.textSecondary }]}>
              {expandedId === faq.id ? '−' : '+'}
            </Text>
          </TouchableOpacity>
          
          {expandedId === faq.id && (
            <View style={styles.answerContainer}>
              <Text style={[styles.answer, { color: theme.colors.textSecondary }]}>{faq.answer}</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  faqItem: {
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  question: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginRight: 16,
  },
  expandIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  answerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  answer: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default FAQList;