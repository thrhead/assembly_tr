import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';

const LanguageSwitcher = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const currentLanguage = i18n.language;

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
                {t('settings.language')}
            </Text>
            <View style={styles.optionsContainer}>
                <TouchableOpacity
                    style={[
                        styles.option,
                        { borderColor: theme.colors.border },
                        currentLanguage === 'tr' && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
                    ]}
                    onPress={() => changeLanguage('tr')}
                >
                    <Text style={[
                        styles.optionText,
                        { color: theme.colors.text },
                        currentLanguage === 'tr' && { color: '#fff', fontWeight: 'bold' }
                    ]}>Türkçe</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[
                        styles.option,
                        { borderColor: theme.colors.border },
                        currentLanguage === 'en' && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
                    ]}
                    onPress={() => changeLanguage('en')}
                >
                    <Text style={[
                        styles.optionText,
                        { color: theme.colors.text },
                        currentLanguage === 'en' && { color: '#fff', fontWeight: 'bold' }
                    ]}>English</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    optionsContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    option: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionText: {
        fontSize: 14,
    },
});

export default LanguageSwitcher;
