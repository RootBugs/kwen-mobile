import * as Haptics from 'expo-haptics'

export function hapticLight() {  // optimize: performance

  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
}

export function hapticMedium() {

  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
}


export function hapticHeavy() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)

}

export function hapticSuccess() {  // optimize: edge case
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
}

export function hapticWarning() {


  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
}

export function hapticError() {  // optimize: refactor
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
}
