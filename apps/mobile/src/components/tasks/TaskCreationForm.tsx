import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { taskRepo } from '@automation/data';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface TaskCreationFormProps {
  visible: boolean;
  onClose: () => void;
  onTaskCreated?: () => void;
}

export function TaskCreationForm({ visible, onClose, onTaskCreated }: TaskCreationFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [focusLevel, setFocusLevel] = useState<'shallow' | 'medium' | 'deep'>('medium');
  const [energyRequirement, setEnergyRequirement] = useState<'low' | 'medium' | 'high'>('medium');
  const [kind, setKind] = useState<'reminder' | 'todo' | 'habit' | 'daily'>('todo');
  const [estimatedTime, setEstimatedTime] = useState('30');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      return;
    }

    setLoading(true);
    try {
      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await taskRepo.create({
        title: title.trim(),
        description: description.trim() || undefined,
        status: 'pending',
        priority,
        estimatedTime: parseInt(estimatedTime) || 30,
        focusLevel,
        energyRequirement,
        context: 'anywhere',
        kind,
        tags: tagsArray,
        subtasks: [],
        dependencies: [],
      });

      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setFocusLevel('medium');
      setEnergyRequirement('medium');
      setKind('todo');
      setEstimatedTime('30');
      setTags('');

      onTaskCreated?.();
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Create New Task</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Title Input */}
              <View style={styles.section}>
                <Text style={styles.label}>Title *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="What needs to be done?"
                  placeholderTextColor="#6b7280"
                  value={title}
                  onChangeText={setTitle}
                  autoFocus
                />
              </View>

              {/* Description Input */}
              <View style={styles.section}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Add more details..."
                  placeholderTextColor="#6b7280"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Priority Selection */}
              <View style={styles.section}>
                <Text style={styles.label}>Priority</Text>
                <View style={styles.optionsRow}>
                  {(['low', 'medium', 'high', 'urgent'] as const).map((p) => (
                    <TouchableOpacity
                      key={p}
                      style={[
                        styles.option,
                        priority === p && styles.optionActive,
                      ]}
                      onPress={() => setPriority(p)}
                    >
                      <Badge variant="priority" type={p}>
                        {p}
                      </Badge>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Kind Selection */}
              <View style={styles.section}>
                <Text style={styles.label}>Type</Text>
                <View style={styles.optionsRow}>
                  {(['todo', 'reminder', 'habit', 'daily'] as const).map((k) => (
                    <TouchableOpacity
                      key={k}
                      style={[
                        styles.option,
                        kind === k && styles.optionActive,
                      ]}
                      onPress={() => setKind(k)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          kind === k && styles.optionTextActive,
                        ]}
                      >
                        {k}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Focus Level Selection */}
              <View style={styles.section}>
                <Text style={styles.label}>Focus Level</Text>
                <View style={styles.optionsRow}>
                  {(['shallow', 'medium', 'deep'] as const).map((f) => (
                    <TouchableOpacity
                      key={f}
                      style={[
                        styles.option,
                        focusLevel === f && styles.optionActive,
                      ]}
                      onPress={() => setFocusLevel(f)}
                    >
                      <Badge variant="focus" type={f}>
                        {f}
                      </Badge>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Energy Requirement Selection */}
              <View style={styles.section}>
                <Text style={styles.label}>Energy Requirement</Text>
                <View style={styles.optionsRow}>
                  {(['low', 'medium', 'high'] as const).map((e) => (
                    <TouchableOpacity
                      key={e}
                      style={[
                        styles.option,
                        energyRequirement === e && styles.optionActive,
                      ]}
                      onPress={() => setEnergyRequirement(e)}
                    >
                      <Badge variant="energy" type={e}>
                        {e}
                      </Badge>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Estimated Time Input */}
              <View style={styles.section}>
                <Text style={styles.label}>Estimated Time (minutes)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="30"
                  placeholderTextColor="#6b7280"
                  value={estimatedTime}
                  onChangeText={setEstimatedTime}
                  keyboardType="number-pad"
                />
              </View>

              {/* Tags Input */}
              <View style={styles.section}>
                <Text style={styles.label}>Tags (comma-separated)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="work, urgent, review"
                  placeholderTextColor="#6b7280"
                  value={tags}
                  onChangeText={setTags}
                />
              </View>

              {/* Buttons */}
              <View style={styles.buttons}>
                <Button
                  variant="outline"
                  onPress={onClose}
                  style={styles.button}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onPress={handleSubmit}
                  style={styles.button}
                  loading={loading}
                  disabled={!title.trim() || loading}
                >
                  Create Task
                </Button>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#a0a0a0',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#ffffff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    backgroundColor: '#0a0a0a',
  },
  optionActive: {
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  optionText: {
    fontSize: 14,
    color: '#a0a0a0',
    textTransform: 'capitalize',
  },
  optionTextActive: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 32,
  },
  button: {
    flex: 1,
  },
});
