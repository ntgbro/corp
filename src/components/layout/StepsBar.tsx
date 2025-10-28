import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../config/theme';

interface Step {
  id: string;
  title: string;
  description?: string;
  isCompleted?: boolean;
  isActive?: boolean;
  isDisabled?: boolean;
}

interface StepsBarProps {
  steps: Step[];
  style?: ViewStyle;
  variant?: 'horizontal' | 'vertical';
  size?: 'small' | 'medium' | 'large';
  showDescriptions?: boolean;
  showNumbers?: boolean;
}

export const StepsBar: React.FC<StepsBarProps> = ({
  steps,
  style,
  variant = 'horizontal',
  size = 'medium',
  showDescriptions = false,
  showNumbers = true,
}) => {
  const theme = useTheme();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          iconSize: 24,
          textSize: 12,
          spacing: 8,
        };
      case 'large':
        return {
          iconSize: 40,
          textSize: 16,
          spacing: 16,
        };
      default: // medium
        return {
          iconSize: 32,
          textSize: 14,
          spacing: 12,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const getStepIcon = (step: Step, index: number) => {
    if (showNumbers) {
      if (step.isCompleted) {
        return '✓';
      } else if (step.isActive) {
        return (index + 1).toString();
      } else {
        return (index + 1).toString();
      }
    } else {
      if (step.isCompleted) {
        return '✓';
      } else if (step.isActive) {
        return '●';
      } else {
        return '○';
      }
    }
  };

  const getStepColor = (step: Step) => {
    if (step.isCompleted) {
      return theme.colors.success;
    } else if (step.isActive) {
      return theme.colors.primary;
    } else if (step.isDisabled) {
      return theme.colors.textSecondary;
    } else {
      return theme.colors.border;
    }
  };

  const getTextColor = (step: Step) => {
    if (step.isCompleted) {
      return theme.colors.success;
    } else if (step.isActive) {
      return theme.colors.primary;
    } else if (step.isDisabled) {
      return theme.colors.textSecondary;
    } else {
      return theme.colors.textSecondary;
    }
  };

  const renderStep = (step: Step, index: number) => {
    const isLast = index === steps.length - 1;

    return (
      <View
        key={step.id}
        style={[
          styles.step,
          variant === 'vertical' && styles.verticalStep,
        ]}
      >
        {/* Step Circle/Icon */}
        <View
          style={[
            styles.stepIcon,
            {
              width: sizeStyles.iconSize,
              height: sizeStyles.iconSize,
              borderRadius: sizeStyles.iconSize / 2,
              backgroundColor: step.isCompleted || step.isActive
                ? getStepColor(step)
                : 'transparent',
              borderColor: getStepColor(step),
              borderWidth: step.isCompleted || step.isActive ? 0 : 2,
            },
          ]}
        >
          <Text
            style={[
              styles.stepIconText,
              {
                color: step.isCompleted || step.isActive
                  ? theme.colors.white
                  : getStepColor(step),
                fontSize: sizeStyles.textSize,
                fontWeight: step.isActive ? 'bold' : 'normal',
              },
            ]}
          >
            {getStepIcon(step, index)}
          </Text>
        </View>

        {/* Step Content */}
        <View style={styles.stepContent}>
          <Text
            style={[
              styles.stepTitle,
              {
                color: getTextColor(step),
                fontSize: sizeStyles.textSize,
                fontWeight: step.isActive ? '600' : '400',
              },
            ]}
          >
            {step.title}
          </Text>

          {showDescriptions && step.description && (
            <Text
              style={[
                styles.stepDescription,
                {
                  color: theme.colors.textSecondary,
                  fontSize: sizeStyles.textSize - 2,
                },
              ]}
            >
              {step.description}
            </Text>
          )}
        </View>

        {/* Connector Line */}
        {!isLast && variant === 'horizontal' && (
          <View
            style={[
              styles.connector,
              {
                backgroundColor: step.isCompleted
                  ? theme.colors.success
                  : theme.colors.border,
                width: sizeStyles.spacing * 2,
                height: 2,
              },
            ]}
          />
        )}
      </View>
    );
  };

  if (variant === 'vertical') {
    return (
      <View style={[styles.verticalContainer, style]}>
        {steps.map(renderStep)}
      </View>
    );
  }

  return (
    <View style={[styles.horizontalContainer, style]}>
      {steps.map(renderStep)}
    </View>
  );
};

const styles = StyleSheet.create({
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  verticalContainer: {
    flexDirection: 'column',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verticalStep: {
    marginBottom: 24,
  },
  stepIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepIconText: {
    textAlign: 'center',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    marginBottom: 2,
  },
  stepDescription: {
    marginTop: 2,
    lineHeight: 16,
  },
  connector: {
    marginHorizontal: 8,
  },
});

export default StepsBar;
