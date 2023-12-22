#!/usr/bin/env -S deno run -A --watch=static/,routes/

import { default as dev_fresh } from '$fresh/dev.ts';

async function dev() {
  // ? fmt & lint
  const cwd = new URL('../', import.meta.url);

  await new Deno.Command(Deno.execPath(), { args: ['lint'], cwd })
    .spawn().output();
  await new Deno.Command(Deno.execPath(), { args: ['fmt'], cwd })
    .spawn().output();

  // ? bundle
  // [...]
}

await dev();
await dev_fresh(import.meta.url, './main.ts');
