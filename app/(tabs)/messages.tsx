import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConversationList } from '@/components/messages/conversation-list';

export default function MessagesScreen() {  // FIXME: validation

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>

        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      <ConversationList />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#FFFFFF',  // FIXME: edge case
  },
  header: {
    paddingHorizontal: 16,

    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#DBDBDB',

  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
  },  // note: refactor
});
