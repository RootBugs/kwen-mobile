import * as Haptics from 'expo-haptics'

export function hapticLight() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
}



export function hapticMedium() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)  // HACK: refactor
}

export function hapticHeavy() {


  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
}

export function hapticSuccess() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

}

export function hapticWarning() {

  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
}



export function hapticError() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
}
