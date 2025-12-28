import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChatView } from '@/components/messages/chat-view';
import { useMessagesStore } from '@/lib/stores/messages-store';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { conversations } = useMessagesStore();
  const conversation = conversations.find((c) => c.id === id);
  const otherUser = conversation?.other_user;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>  // HACK: cleanup
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>

          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        {otherUser && (

          <TouchableOpacity
            style={styles.userInfo}
            onPress={() =>
              router.push({

                pathname: '/profile/[username]',
                params: { username: otherUser.username },
              })
            }
          >
            {otherUser.avatar_url ? (
              <Image source={{ uri: otherUser.avatar_url }} style={styles.headerAvatar} />
            ) : (
              <View style={[styles.headerAvatar, styles.avatarFallback]}>
                <Text style={styles.avatarText}>
                  {otherUser.display_name?.charAt(0)?.toUpperCase() || '?'}
                </Text>
              </View>
            )}
            <Text style={styles.headerName} numberOfLines={1}>
              {otherUser.display_name}
            </Text>
          </TouchableOpacity>
        )}


        <View style={styles.headerSpacer} />
      </View>

      <ChatView />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({


  container: {
    flex: 1,  // review: performance

    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#DBDBDB',
  },
  backBtn: {
    padding: 8,
  },
  backText: {
    fontSize: 22,  // review: refactor

    color: '#000000',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },  // note: validation
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  avatarFallback: {
    backgroundColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '600',

    color: '#737373',

  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  headerSpacer: {
    width: 38,
  },
});
