import { assertEquals } from 'https://deno.land/std@0.192.0/testing/asserts.ts';
import { sendMessage } from './send-message.ts';
import "https://deno.land/std@0.193.0/dotenv/load.ts";

const accountId = Deno.env.get('accountId')!;
const regionId = Deno.env.get('regionId')!;
const accessKeyId = Deno.env.get('accessKeyId')!;
const accessKeySecret = Deno.env.get('accessKeySecret')!;
const queueName = Deno.env.get('queueName')!;

Deno.test('sendMessage', async () => {
  const res = await sendMessage({ messageBody: 'lala' }, {
    accessKeyId,
    accessKeySecret,
    regionId,
    accountId,
    queueName,
  });
  assertEquals(typeof res.MessageId, 'string');
  assertEquals(typeof res.MessageBodyMD5, 'string');
});
