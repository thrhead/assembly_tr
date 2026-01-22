import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    ActivityIndicator,
    ScrollView,
    RefreshControl
} from 'react-native';
import { User, ShieldCheck, Mail, Award, Target } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config';

const TeamDetailScreen = ({ route }) => {
    const { theme } = useTheme();
    const { teamId, teamName } = route.params;
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchTeamDetails = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get(`${API_URL}/api/admin/teams/${teamId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTeam(response.data);
        } catch (error) {
            console.error('Fetch team details error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTeamDetails();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchTeamDetails();
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={[styles.scoreCard, { backgroundColor: theme.colors.primary }]}>
                <Award size={32} color="#FFF" />
                <View>
                    <Text style={styles.scoreTitle}>Performans Skoru</Text>
                    <Text style={styles.scoreValue}>%{team?.performanceScore || 0}</Text>
                </View>
            </View>

            <View style={styles.statsContainer}>
                <View style={[styles.statBox, { backgroundColor: theme.colors.card }]}>
                    <Target size={20} color={theme.colors.primary} />
                    <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Toplam İş</Text>
                    <Text style={[styles.statValue, { color: theme.colors.text }]}>{team?.stats?.totalJobs || 0}</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: theme.colors.card }]}>
                    <ShieldCheck size={20} color="#22C55E" />
                    <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Tamamlanan</Text>
                    <Text style={[styles.statValue, { color: theme.colors.text }]}>{team?.stats?.completedJobs || 0}</Text>
                </View>
            </View>

            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Ekip Üyeleri</Text>
        </View>
    );

    const renderMemberItem = ({ item }) => (
        <View style={[styles.memberCard, { backgroundColor: theme.colors.card }]}>
            <View style={styles.memberInfo}>
                {item.user.avatarUrl ? (
                    <Image source={{ uri: item.user.avatarUrl }} style={styles.avatar} />
                ) : (
                    <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.background }]}>
                        <User size={24} color={theme.colors.textSecondary} />
                    </View>
                )}
                <View>
                    <View style={styles.nameRow}>
                        <Text style={[styles.memberName, { color: theme.colors.text }]}>{item.user.name}</Text>
                        {item.isLead && (
                            <View style={styles.leadBadge}>
                                <ShieldCheck size={12} color="#FFF" />
                                <Text style={styles.leadText}>Lider</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.emailRow}>
                        <Mail size={14} color={theme.colors.textSecondary} />
                        <Text style={[styles.memberEmail, { color: theme.colors.textSecondary }]}>
                            {item.user.email}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
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
                data={team?.members || []}
                renderItem={renderMemberItem}
                keyExtractor={item => item.user.id}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { marginBottom: 20 },
    scoreCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        borderRadius: 16,
        gap: 16,
        marginBottom: 16,
    },
    scoreTitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
    scoreValue: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    statBox: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        gap: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    statLabel: { fontSize: 12 },
    statValue: { fontSize: 18, fontWeight: 'bold' },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
    listContent: { padding: 16 },
    memberCard: {
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        elevation: 1,
    },
    memberInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatar: { width: 48, height: 48, borderRadius: 24 },
    avatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    memberName: { fontSize: 16, fontWeight: '600' },
    leadBadge: {
        backgroundColor: '#F59E0B',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        gap: 4,
    },
    leadText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
    emailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
    memberEmail: { fontSize: 13 },
});

export default TeamDetailScreen;
