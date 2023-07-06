import { receiveMessage } from './receive-message.ts';
import 'https://deno.land/std@0.193.0/dotenv/load.ts';
import { deleteMessage } from './delete-message.ts';
import { sendMessage } from './send-message.ts';
import { assertEquals } from 'https://deno.land/std@0.192.0/testing/asserts.ts';

const accountId = Deno.env.get('accountId')!;
const regionId = Deno.env.get('regionId')!;
const accessKeyId = Deno.env.get('accessKeyId')!;
const accessKeySecret = Deno.env.get('accessKeySecret')!;
const queueName = Deno.env.get('queueName')!;

Deno.test('deleteMessage-s', async () => {
  const s = await sendMessage({ 'messageBody': 'test', delaySeconds: 1 }, {
    accessKeyId,
    accessKeySecret,
    regionId,
    accountId,
    queueName,
  });

  const res = await deleteMessage({ receiptHandle: s.ReceiptHandle! }, {
    accessKeyId,
    accessKeySecret,
    regionId,
    accountId,
    queueName,
  });
  assertEquals(res, undefined);
});
