import { useCallback, useState } from 'react';

import { checkForUpdate } from './checkForUpdate';

interface OtaUpdateState {
  isChecking: boolean;
  isUpdateAvailable: boolean;
}

interface OtaUpdateActions {
  applyUpdate: () => Promise<void>;
}

export function useOtaUpdate(): OtaUpdateState & OtaUpdateActions {
  const [isChecking, setIsChecking] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  const applyUpdate = useCallback(async () => {
    setIsChecking(true);
    try {
      const result = await checkForUpdate();
      setIsUpdateAvailable(result.isAvailable);
    } finally {
      setIsChecking(false);
    }
  }, []);

  return { isChecking, isUpdateAvailable, applyUpdate };
}
