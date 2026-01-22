import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { formatDate } from '../../utils';
import GlassCard from '../ui/GlassCard';

const JobInfoCard = ({ job }) => {
    const { theme } = useTheme();

    if (!job) return null;

    return (
        <GlassCard style={styles.card} theme={theme}>
            <Text style={[styles.jobTitle, { color: theme.colors.text }]}>{job.title}</Text>
            <View style={styles.infoRow}>
                <MaterialIcons name="business" size={16} color={theme.colors.subText} />
                <Text style={[styles.infoText, { color: theme.colors.subText }]}>Müşteri: {job.customer?.name || 'Müşteri'}</Text>
            </View>
            <View style={styles.infoRow}>
                <MaterialIcons name="description" size={16} color={theme.colors.subText} />
                <Text style={[styles.description, { color: theme.colors.subText }]}>{job.description}</Text>
            </View>
            {job.status === 'IN_PROGRESS' && job.startedAt && job.steps && job.steps.length > 0 && (
                <View style={styles.estimationContainer}>
                    <View style={styles.separator} />
                    <View style={styles.infoRow}>
                        <MaterialIcons name="timer" size={16} color={theme.colors.primary} />
                        <Text style={[styles.infoText, { color: theme.colors.text, fontWeight: '600' }]}>
                            Tahmini Bitiş: {(() => {
                                const completed = job.steps.filter(s => s.isCompleted).length;
                                if (completed === 0) return 'Hesaplanıyor...';
                                const start = new Date(job.startedAt).getTime();
                                const now = new Date().getTime();
                                const elapsed = now - start;
                                const progress = completed / job.steps.length;
                                const totalEst = elapsed / progress;
                                const finishDate = new Date(start + totalEst);
                                return finishDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            })()}
                        </Text>
                    </View>
                    <View style={styles.progressBarBg}>
                        <View
                            style={[
                                styles.progressBarFill,
                                {
                                    backgroundColor: theme.colors.primary,
                                    width: `${(job.steps.filter(s => s.isCompleted).length / job.steps.length) * 100}%`
                                }
                            ]}
                        />
                    </View>
                </View>
            )}
        </GlassCard>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 16,
        marginBottom: 16,
    },
    jobTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoText: {
        marginLeft: 8,
        fontSize: 14,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        marginTop: 8,
    },
    estimationContainer: {
        marginTop: 12,
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginBottom: 12,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 3,
        marginTop: 8,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
    },
});

export default JobInfoCard;
