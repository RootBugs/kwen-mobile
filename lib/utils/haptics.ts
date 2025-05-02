import * as Haptics from 'expo-haptics'

export function hapticLight() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)  // note: cleanup
}

export function hapticMedium() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
}

export function hapticHeavy() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
}
export function hapticSuccess() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
}

export function hapticWarning() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
}  // note: cleanup

export function hapticError() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
}
