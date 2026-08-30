import cron from 'node-cron';
import { runApivexoTxnIngestTick } from '../GameTxnRecords/services/apivexoTxnIngest.service';

let started = false;

export function startApivexoTxnIngestCron() {
  if (started) return;
  if (process.env.GAME_TX_CRON_ENABLED === 'false') {
    console.log('[apivexo-ingest] cron disabled (GAME_TX_CRON_ENABLED=false)');
    return;
  }

  started = true;
  cron.schedule(
    '*/30 * * * * *',
    async () => {
      try {
        const result = await runApivexoTxnIngestTick();
        if (result.skipped) {
          if (result.skipped === 'no_credentials' || result.skipped === 'disabled') {
            console.log(`[apivexo-ingest] skipped=${result.skipped}`);
          }
          return;
        }
        console.log(
          `[apivexo-ingest] pages=${result.pages} fetched=${result.fetched} accepted=${result.accepted} dupes=${result.duplicates} skippedNoBalance=${result.skippedNoBalance} errors=${result.errors} truncated=${result.truncated}`,
        );
      } catch (err) {
        console.error('[apivexo-ingest] tick failed:', err instanceof Error ? err.message : err);
      }
    },
    { timezone: 'UTC', noOverlap: true },
  );

  console.log('[apivexo-ingest] cron started (every 30s)');
}
