let graphControls = {
  getState: () => null,
  resetState: () => {},
};

export const syncGraphControls = (controls) => {
  graphControls = controls;
};

export const saveGraph = (storageApi) => {
  const snapshot = graphControls.getState?.();

  if (snapshot === undefined) {
    return;
  }

  storageApi?.save?.(snapshot);
};

export const resetGraph = (storageApi) => {
  graphControls.resetState?.();

  const snapshot = graphControls.getState?.();

  if (snapshot === undefined) {
    return;
  }

  storageApi?.save?.(snapshot);
};
