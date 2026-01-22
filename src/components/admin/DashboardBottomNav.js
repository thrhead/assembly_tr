import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const DashboardBottomNav = ({ navigation, activeTab = 'Dashboard' }) => {
    const { theme, isDark } = useTheme();
    const { t } = useTranslation();

    const navItems = [
        { id: 'Dashboard', title: t('navigation.home'), icon: 'grid-view', route: 'AdminDashboard' },
        { id: 'TeamList', title: t('navigation.teams'), icon: 'people', route: 'TeamList' },
        { id: 'QuickAdd', title: '', icon: 'add', route: 'CreateJob', isCenter: true },
        { id: 'Jobs', title: t('navigation.jobs'), icon: 'assignment', route: 'Jobs' },
        { id: 'Profile', title: t('navigation.profile'), icon: 'person', route: 'Profile' },
    ];

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: theme.colors.card,
                borderTopColor: theme.colors.border,
                // Shadow for light mode
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: isDark ? 0.3 : 0.08,
                shadowRadius: 12,
                elevation: 24
            }
        ]}>
            <View style={styles.navInner}>
                {navItems.map((item) => {
                    if (item.isCenter) {
                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={[styles.centerButton, { backgroundColor: theme.colors.primary }]}
                                onPress={() => navigation.navigate(item.route)}
                                activeOpacity={0.8}
                            >
                                <MaterialIcons name={item.icon} size={32} color={isDark ? '#000' : '#fff'} />
                            </TouchableOpacity>
                        );
                    }

                    const isActive = activeTab === item.id;
                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.navItem}
                            onPress={() => item.route && navigation.navigate(item.route)}
                            activeOpacity={0.6}
                        >
                            <MaterialIcons
                                name={item.icon}
                                size={26}
                                color={isActive ? theme.colors.primary : theme.colors.subText}
                            />
                            <Text style={[
                                styles.navText,
                                {
                                    color: isActive ? theme.colors.primary : theme.colors.subText,
                                    fontWeight: isActive ? 'bold' : '500'
                                }
                            ]}>
                                {item.title}
                            </Text>
                            {isActive && <View style={[styles.activeIndicator, { backgroundColor: theme.colors.primary }]} />}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: Platform.OS === 'ios' ? 95 : 80,
        borderTopWidth: 1,
    },
    navInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        paddingHorizontal: 10,
        paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        paddingTop: 10,
    },
    centerButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginTop: -40, // Floating effect
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 4,
        borderColor: 'transparent', // Will be set by container bg ideally or just keep simple
    },
    navText: {
        fontSize: 10,
        marginTop: 4,
    },
    activeIndicator: {
        width: 4,
        height: 4,
        borderRadius: 2,
        marginTop: 4,
    }
});

export default DashboardBottomNav;
