import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { Calendar, Filter, Clock, MapPin, Users } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config';

const AdvancedPlanningScreen = () => {
    const { theme } = useTheme();
    const [data, setData] = useState({ jobs: [], teams: [] });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState(null);

    const fetchPlanningData = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get(`${API_URL}/api/admin/planning`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data);
        } catch (error) {
            console.error('Fetch planning error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPlanningData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchPlanningData();
    };

    const filteredJobs = selectedTeamId
        ? data.jobs.filter(j => j.teamId === selectedTeamId)
        : data.jobs;

    const renderStatusBadge = (status) => {
        const colors = {
            PLANNED: { bg: '#DBEAFE', text: '#1E40AF', label: 'Planlandı' },
            ASSIGNED: { bg: '#E0E7FF', text: '#3730A3', label: 'Atandı' },
            IN_PROGRESS: { bg: '#FEF3C7', text: '#92400E', label: 'Devam Ediyor' }
        };
        const config = colors[status] || { bg: '#F3F4F6', text: '#374151', label: status };
        return (
            <View style={[styles.badge, { backgroundColor: config.bg }]}>
                <Text style={[styles.badgeText, { color: config.text }]}>{config.label}</Text>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Team Filter */}
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    <TouchableOpacity
                        style={[
                            styles.filterItem,
                            !selectedTeamId && { backgroundColor: theme.colors.primary }
                        ]}
                        onPress={() => setSelectedTeamId(null)}
                    >
                        <Text style={[styles.filterText, !selectedTeamId && { color: '#FFF' }]}>Hepsi</Text>
                    </TouchableOpacity>
                    {data.teams.map(team => (
                        <TouchableOpacity
                            key={team.id}
                            style={[
                                styles.filterItem,
                                selectedTeamId === team.id && { backgroundColor: theme.colors.primary },
                                { borderColor: theme.colors.border, borderWidth: 1 }
                            ]}
                            onPress={() => setSelectedTeamId(team.id)}
                        >
                            <Text style={[
                                styles.filterText,
                                selectedTeamId === team.id && { color: '#FFF' },
                                { color: theme.colors.text }
                            ]}>{team.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
            >
                {filteredJobs.length === 0 ? (
                    <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>Bu kriterlerde iş bulunamadı.</Text>
                ) : (
                    filteredJobs.map(job => (
                        <View key={job.id} style={[styles.jobCard, { backgroundColor: theme.colors.card }]}>
                            <View style={styles.jobHeader}>
                                <Text style={[styles.jobTitle, { color: theme.colors.text }]}>{job.title}</Text>
                                {renderStatusBadge(job.status)}
                            </View>

                            <View style={styles.infoRow}>
                                <MapPin size={16} color={theme.colors.textSecondary} />
                                <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>{job.customer}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Clock size={16} color={theme.colors.textSecondary} />
                                <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                                    {new Date(job.start).toLocaleDateString('tr-TR')} {new Date(job.start).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </View>

                            <View style={[styles.teamFooter, { borderTopColor: theme.colors.border }]}>
                                <Users size={16} color={theme.colors.primary} />
                                <Text style={[styles.teamName, { color: theme.colors.primary }]}>{job.teamName}</Text>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    filterContainer: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
    filterScroll: { paddingHorizontal: 16, gap: 8 },
    filterItem: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6'
    },
    filterText: { fontSize: 14, fontWeight: '600' },
    scrollContent: { padding: 16 },
    jobCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    jobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    jobTitle: { fontSize: 16, fontWeight: 'bold', flex: 1, marginRight: 8 },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    badgeText: { fontSize: 11, fontWeight: '700' },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    infoText: { fontSize: 14 },
    teamFooter: {
        marginTop: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    teamName: { fontSize: 14, fontWeight: '600' },
    emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16 },
});

export default AdvancedPlanningScreen;
