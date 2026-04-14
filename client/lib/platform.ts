export const isNativePlatform = () => {
  const win = window as Window & { Capacitor?: { isNativePlatform?: () => boolean } };
  return Boolean(win.Capacitor?.isNativePlatform?.());
};
