import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#FF6B35',
  secondary: '#F7931E',
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  gray: '#6C757D',
  lightGray: '#F8F9FA',
  darkGray: '#495057',
  white: '#FFFFFF',
  black: '#212529',
  background: '#F8F9FA',
  cardBackground: '#FFFFFF',
  border: '#DEE2E6',
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: colors.darkGray,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: colors.white,
    marginVertical: 8,
  },
});