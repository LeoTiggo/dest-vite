export {};

declare global {
  interface Window {
    electron?: {
      platform: NodeJS.Platform;
      versions: {
        electron: string;
        node: string;
        chrome: string;
      };
    };
  }
}
