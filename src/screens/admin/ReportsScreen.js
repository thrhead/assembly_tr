import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { LucideIcon, BarChart3, TrendingUp, DollarSign, Briefcase, Users, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config';
import GlassCard from '../../components/ui/GlassCard';
import { Svg, Rect, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');

const ReportsScreen = () => {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [performanceData, setPerformanceData] = useState(null);
    const [costData, setCostData] = useState(null);
    const [activeTab, setActiveTab] = useState('performance');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            const [perfRes, costRes] = await Promise.all([
                axios.get(`${API_URL}/api/admin/reports/performance`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_URL}/api/admin/reports/costs`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setPerformanceData(perfRes.data);
            setCostData(costRes.data);
        } catch (error) {
            console.error('Fetch reports error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    const SimpleBarChart = ({ data, color }) => {
        if (!data || data.length === 0) return null;
        const maxVal = Math.max(...data.map(d => d.value || d.amount || 0));
        const chartHeight = 150;
        const barWidth = (width - 64) / data.length - 8;

        return (
            <View style={{ height: chartHeight + 30, marginTop: 16 }}>
                <Svg height={chartHeight + 20} width={width - 40}>
                    {data.map((item, i) => {
                        const val = item.value || item.amount || 0;
                        const barHeight = (val / (maxVal || 1)) * chartHeight;
                        return (
                            <React.Fragment key={i}>
                                <Rect
                                    x={i * (barWidth + 8)}
                                    y={chartHeight - barHeight}
                                    width={barWidth}
                                    height={barHeight}
                                    fill={color}
                                    rx={4}
                                />
                                <SvgText
                                    x={i * (barWidth + 8) + barWidth / 2}
                                    y={chartHeight + 15}
                                    fill={theme.colors.subText}
                                    fontSize="10"
                                    textAnchor="middle"
                                >
                                    {item.name || item.date?.split('-')[2]}
                                </SvgText>
                            </React.Fragment>
                        );
                    })}
                </Svg>
            </View>
        );
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.colors.text }]}>Analiz & Raporlar</Text>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'performance' && { borderBottomColor: theme.colors.primary, borderBottomWidth: 2 }]}
                    onClick={() => setActiveTab('performance')}
                >
                    <Text style={[styles.tabText, { color: activeTab === 'performance' ? theme.colors.primary : theme.colors.subText }]}>Performans</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'costs' && { borderBottomColor: theme.colors.primary, borderBottomWidth: 2 }]}
                    onClick={() => setActiveTab('costs')}
                >
                    <Text style={[styles.tabText, { color: activeTab === 'costs' ? theme.colors.primary : theme.colors.subText }]}>Maliyetler</Text>
                </TouchableOpacity>
            </View>

            {activeTab === 'performance' ? (
                <View style={styles.content}>
                    <View style={styles.statsGrid}>
                        <GlassCard style={styles.statCard} theme={theme}>
                            <Briefcase size={20} color={theme.colors.primary} />
                            <Text style={[styles.statVal, { color: theme.colors.text }]}>{performanceData?.stats?.totalJobs}</Text>
                            <Text style={[styles.statLabel, { color: theme.colors.subText }]}>Toplam İş</Text>
                        </GlassCard>
                        <GlassCard style={styles.statCard} theme={theme}>
                            <CheckCircle2 size={20} color={theme.colors.success} />
                            <Text style={[styles.statVal, { color: theme.colors.text }]}>{performanceData?.stats?.completedJobs}</Text>
                            <Text style={[styles.statLabel, { color: theme.colors.subText }]}>Tamamlanan</Text>
                        </GlassCard>
                    </View>

                    <GlassCard style={styles.chartCard} theme={theme}>
                        <View style={styles.cardHeader}>
                            <BarChart3 size={18} color={theme.colors.primary} />
                            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>İş Dağılımı</Text>
                        </View>
                        <SimpleBarChart
                            data={Object.entries(performanceData?.jobDistribution || {}).map(([name, value]) => ({ name, value }))}
                            color={theme.colors.primary}
                        />
                    </GlassCard>

                    <GlassCard style={styles.chartCard} theme={theme}>
                        <View style={styles.cardHeader}>
                            <Users size={18} color={theme.colors.primary} />
                            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Ekip Performansı (Ort. Dk)</Text>
                        </View>
                        <View style={styles.teamList}>
                            {performanceData?.teamPerformance.map((team, idx) => (
                                <View key={idx} style={styles.teamRow}>
                                    <Text style={[styles.teamName, { color: theme.colors.text }]}>{team.teamName}</Text>
                                    <Text style={[styles.teamVal, { color: theme.colors.primary }]}>{Math.round(team.avgCompletionTimeMinutes)} Dk</Text>
                                </View>
                            ))}
                        </View>
                    </GlassCard>
                </View>
            ) : (
                <View style={styles.content}>
                    <View style={styles.statsGrid}>
                        <GlassCard style={styles.statCard} theme={theme}>
                            <DollarSign size={20} color={theme.colors.success} />
                            <Text style={[styles.statVal, { color: theme.colors.text }]}>₺{performanceData?.stats?.totalCost.toLocaleString()}</Text>
                            <Text style={[styles.statLabel, { color: theme.colors.subText }]}>Toplam Maliyet</Text>
                        </GlassCard>
                        <GlassCard style={styles.statCard} theme={theme}>
                            <TrendingUp size={20} color={theme.colors.warning} />
                            <Text style={[styles.statVal, { color: theme.colors.text }]}>{performanceData?.stats?.pendingApprovals}</Text>
                            <Text style={[styles.statLabel, { color: theme.colors.subText }]}>Bekleyen Onay</Text>
                        </GlassCard>
                    </View>

                    <GlassCard style={styles.chartCard} theme={theme}>
                        <View style={styles.cardHeader}>
                            <BarChart3 size={18} color={theme.colors.success} />
                            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Maliyet Dağılımı</Text>
                        </View>
                        <View style={styles.teamList}>
                            {Object.entries(costData?.breakdown || {}).map(([cat, val], idx) => (
                                <View key={idx} style={styles.teamRow}>
                                    <Text style={[styles.teamName, { color: theme.colors.text }]}>{cat}</Text>
                                    <Text style={[styles.teamVal, { color: theme.colors.success }]}>₺{val.toLocaleString()}</Text>
                                </View>
                            ))}
                        </View>
                    </GlassCard>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { padding: 20, paddingTop: 40 },
    title: { fontSize: 24, fontWeight: 'bold' },
    tabContainer: { flexDirection: 'row', paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
    tab: { paddingVertical: 12, marginRight: 24 },
    tabText: { fontSize: 16, fontWeight: '600' },
    content: { padding: 20 },
    statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    statCard: { flex: 1, padding: 16, alignItems: 'center' },
    statVal: { fontSize: 20, fontWeight: 'bold', marginVertical: 4 },
    statLabel: { fontSize: 12 },
    chartCard: { padding: 16, marginBottom: 16 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
    cardTitle: { fontSize: 16, fontWeight: 'bold' },
    teamList: { gap: 12 },
    teamRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)', pb: 8 },
    teamName: { fontSize: 14 },
    teamVal: { fontSize: 14, fontWeight: 'bold' }
});

export default ReportsScreen;
