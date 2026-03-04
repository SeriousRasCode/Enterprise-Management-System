import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { projectAPI } from '../services/api';
import ActionBar from '@/components/ui/action-bar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import TaskCard from '@/src/components/TaskCard';

interface Project {
  id: number;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
}

export default function ProjectsScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await projectAPI.getMyProjects();
      const body: any = resp?.data;
      let list: any[] = [];
      if (body && body.success && Array.isArray(body.data)) {
        list = body.data;
      } else if (Array.isArray(body)) {
        list = body;
      } else if (body && Array.isArray(body.data)) {
        list = body.data;
      }
      setProjects(list as Project[]);
      setError(null);
    } catch (e) {
      console.error('Failed to load projects', e);
      setError('Unable to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProjects().finally(() => setRefreshing(false));
  }, [fetchProjects]);

  return (
    <>
      <ActionBar title="Projects" />
      <View style={styles.container}>
        {loading && !refreshing ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={{ color: 'red' }}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={projects}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.list}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={
              <View style={styles.center}>
                <Text>No projects found</Text>
              </View>
            }
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} activeOpacity={0.8}>
                <View style={styles.cardRow}>
                  <IconSymbol name="folder.fill" size={28} color={Colors.light.tint} />
                  <View style={styles.cardContent}>
                    <Text style={styles.title}>{item.name}</Text>
                    {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}
                    <View style={styles.meta}>
                      <View style={styles.metaItem}>
                        <IconSymbol name="flag.fill" size={16} color={Colors.light.icon} />
                        <Text style={styles.metaText}> {item.status ?? 'unknown'}</Text>
                      </View>
                      {item.start_date ? (
                        <View style={styles.metaItem}>
                          <IconSymbol name="calendar" size={16} color={Colors.light.icon} />
                          <Text style={styles.metaText}> {new Date(item.start_date).toLocaleDateString()}</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingBottom: 16,
    paddingTop: 8,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  meta: {
    flexDirection: 'row',
    marginTop: 8,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
  },
  row: {
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  desc: {
    fontSize: 14,
    color: '#666',
  },
});
