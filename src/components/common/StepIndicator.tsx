import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../config/theme';

export interface Step {
  key: string;
  title: string;
  description?: string;
}

export interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  style?: ViewStyle;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isPending = index > currentStep;

        return (
          <View key={step.key} style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <View
                style={[
                  styles.stepNumber,
                  {
                    backgroundColor: isCompleted
                      ? theme.colors.success
                      : isCurrent
                      ? theme.colors.primary
                      : theme.colors.border,
                  },
                ]}
              >
                <Text style={[styles.stepNumberText, { color: theme.colors.white }]}>
                  {isCompleted ? '✓' : (index + 1).toString()}
                </Text>
              </View>

              <View style={styles.stepContent}>
                <Text
                  style={[
                    styles.stepTitle,
                    {
                      color: isCurrent ? theme.colors.primary : theme.colors.text,
                      fontWeight: isCurrent ? '600' : '400',
                    },
                  ]}
                >
                  {step.title}
                </Text>
                {step.description && (
                  <Text
                    style={[
                      styles.stepDescription,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {step.description}
                  </Text>
                )}
              </View>
            </View>

            {index < steps.length - 1 && (
              <View
                style={[
                  styles.stepConnector,
                  {
                    backgroundColor: isCompleted ? theme.colors.success : theme.colors.border,
                  },
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  stepContainer: {
    position: 'relative',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '600',
  },
  stepContent: {
    flex: 1,
    paddingTop: 4,
  },
  stepTitle: {
    fontSize: 16,
    lineHeight: 20,
  },
  stepDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  stepConnector: {
    position: 'absolute',
    left: 16,
    top: 32,
    width: 2,
    height: 40,
    zIndex: -1,
  },
});

export default StepIndicator;
