import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../config/theme';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  style?: ViewStyle;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback onReset={this.handleReset} style={this.props.style} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  onReset: () => void;
  style?: ViewStyle;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ onReset, style }) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.errorBox, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.errorTitle, { color: theme.colors.error }]}>
          Something went wrong
        </Text>
        <Text style={[styles.errorMessage, { color: theme.colors.textSecondary }]}>
          An unexpected error occurred. Please try again.
        </Text>
        <TouchableOpacity
          onPress={onReset}
          style={[styles.resetButton, { backgroundColor: theme.colors.primary }]}
        >
          <Text style={[styles.resetButtonText, { color: theme.colors.white }]}>
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorBox: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    maxWidth: 300,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  resetButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ErrorBoundary;
