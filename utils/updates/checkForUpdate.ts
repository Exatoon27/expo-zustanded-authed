import * as Updates from 'expo-updates';

export interface UpdateCheckResult {
  isAvailable: boolean;
  applied: boolean;
}

/**
 * Checks for an OTA update and applies it if available.
 * No-ops silently in Expo Go / development builds where updates are disabled.
 */
export async function checkForUpdate(): Promise<UpdateCheckResult> {
  if (!Updates.isEnabled) {
    return { isAvailable: false, applied: false };
  }

  try {
    const check = await Updates.checkForUpdateAsync();
    if (!check.isAvailable) {
      return { isAvailable: false, applied: false };
    }

    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync();
    return { isAvailable: true, applied: true };
  } catch {
    return { isAvailable: false, applied: false };
  }
}
