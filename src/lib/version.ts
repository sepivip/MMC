export const APP_VERSION = '1.2.0';
export const BUILD_DATE = new Date().toISOString().split('T')[0];
export const GIT_COMMIT_HASH = process.env.NEXT_PUBLIC_GIT_COMMIT_HASH || 'dev';

export function getVersionInfo() {
  return {
    version: APP_VERSION,
    buildDate: BUILD_DATE,
    commitHash: GIT_COMMIT_HASH,
    fullVersion: `v${APP_VERSION} (${GIT_COMMIT_HASH.slice(0, 7)})`,
  };
}
