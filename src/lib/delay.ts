export const NETWORK_DELAY = 350;

export function delay(ms: number = NETWORK_DELAY) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
