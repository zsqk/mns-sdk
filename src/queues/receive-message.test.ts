import { assertEquals } from 'https://deno.land/std@0.192.0/testing/asserts.ts';
import { receiveMessage } from "./receive-message.ts";
import "https://deno.land/std@0.193.0/dotenv/load.ts";

const accountId = Deno.env.get('accountId')!;
const regionId = Deno.env.get('regionId')!;
const accessKeyId = Deno.env.get('accessKeyId')!;
const accessKeySecret = Deno.env.get('accessKeySecret')!;

Deno.test('receiveMessage', async () => {
  const queueName = 'test';
  console.log('accountId', accountId);
  const res = await receiveMessage({}, {
    accessKeyId,
    accessKeySecret,
    regionId,
    accountId,
    queueName,
  });
  console.log('res', res);
});
