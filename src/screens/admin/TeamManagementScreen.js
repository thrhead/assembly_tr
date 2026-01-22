import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { Users, ChevronRight, Circle, Briefcase } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config';

const TeamManagementScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchTeams = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get(`${API_URL}/api/admin/teams`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTeams(response.data);
        } catch (error) {
            console.error('Fetch teams error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchTeams();
    };

    const renderTeamItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.colors.card }]}
            onPress={() => navigation.navigate('TeamDetail', { teamId: item.id, teamName: item.name })}
        >
            <View style={styles.cardHeader}>
                <View style={styles.titleGroup}>
                    <Users size={20} color={theme.colors.primary} style={styles.icon} />
                    <Text style={[styles.teamName, { color: theme.colors.text }]}>{item.name}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'BUSY' ? '#FEE2E2' : '#DCFCE7' }]}>
                    <Circle size={8} fill={item.status === 'BUSY' ? '#EF4444' : '#22C55E'} color={item.status === 'BUSY' ? '#EF4444' : '#22C55E'} />
                    <Text style={[styles.statusText, { color: item.status === 'BUSY' ? '#B91C1C' : '#15803D' }]}>
                        {item.status === 'BUSY' ? 'Meşgul' : 'Müsait'}
                    </Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.statRow}>
                    <Users size={16} color={theme.colors.textSecondary} />
                    <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
                        {item.memberCount} Üye
                    </Text>
                </View>

                {item.currentJob && (
                    <View style={styles.statRow}>
                        <Briefcase size={16} color={theme.colors.textSecondary} />
                        <Text style={[styles.statText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                            {item.currentJob.title}
                        </Text>
                    </View>
                )}
            </View>

            <ChevronRight size={20} color={theme.colors.textSecondary} style={styles.chevron} />
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <FlatList
                data={teams}
                renderItem={renderTeamItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
                ListEmptyComponent={
                    <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                        Ekip bulunamadı.
                    </Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContent: { padding: 16 },
    card: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        position: 'relative',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    titleGroup: { flexDirection: 'row', alignItems: 'center' },
    icon: { marginRight: 8 },
    teamName: { fontSize: 18, fontWeight: 'bold' },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        gap: 6,
    },
    statusText: { fontSize: 12, fontWeight: '600' },
    cardBody: { gap: 8 },
    statRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    statText: { fontSize: 14 },
    chevron: { position: 'absolute', right: 12, bottom: 12 },
    emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16 },
});

export default TeamManagementScreen;
