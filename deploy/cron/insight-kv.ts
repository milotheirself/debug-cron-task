export const warning: Record<string, {
  hits: bigint;
  urns: string[];
}> = {};

export const insight_kv = await Deno.openKv();
export const insight: {
  '@total': bigint;
  '@total-noise-ignored': bigint;
  timeline: Record<string, { hits: bigint }>;
} = {
  '@total': 0n,
  '@total-noise-ignored': 0n,
  timeline: {},
};

// // ---
// Deno.cron('insight-kv', '*/20 * * * *', async () => {
//   const kv_day = new Date().toISOString().split('T')[0];
//   const kv_atomic = insight_kv.atomic();

//   for (const k in insight['timeline']) {
//     kv_atomic.sum(
//       ['insight', 'timeline', k, kv_day],
//       insight['timeline'][k].hits,
//     );
//   }

//   kv_atomic.sum(['insight', '@total'], insight['@total']);
//   kv_atomic.sum(
//     ['insight', '@total-noise-ignored'],
//     insight['@total-noise-ignored'],
//   );

//   insight['@total'] = 0n;
//   insight['@total-noise-ignored'] = 0n;
//   insight['timeline'] = {};

//   for (const k in warning) {
//     // context: https://discord.com/channels/684898665143206084/1164280958896308275/1164280958896308275
//     //          https://discord.com/invite/deno

//     if (warning[k].hits >= 1) {
//       console.debug('[noise-warning]', { remoteAddr: k, ...warning[k] });
//     }

//     delete warning[k];
//   }

//   await kv_atomic.commit();
// });
// // ---
