import 'https://deno.land/std@0.193.0/dotenv/load.ts';
import { sendMessage } from './send-message.ts';
import { assertEquals } from 'https://deno.land/std@0.192.0/testing/asserts.ts';
import { changeMessageVisibility } from './change-message-visibility.ts';
import { receiveMessage } from './receive-message.ts';

const accountId = Deno.env.get('accountId')!;
const regionId = Deno.env.get('regionId')!;
const accessKeyId = Deno.env.get('accessKeyId')!;
const accessKeySecret = Deno.env.get('accessKeySecret')!;
const queueName = Deno.env.get('queueName')!;

Deno.test('changeMessageVisibility-s', async () => {
  const s = await sendMessage({ 'messageBody': 'test', delaySeconds: 100 }, {
    accessKeyId,
    accessKeySecret,
    regionId,
    accountId,
    queueName,
  });

  const r = await receiveMessage({}, {
    accessKeyId,
    accessKeySecret,
    regionId,
    accountId,
    queueName,
  });

  const res = await changeMessageVisibility({
    receiptHandle: r.ReceiptHandle,
    visibilityTimeout: 1,
  }, {
    accessKeyId,
    accessKeySecret,
    regionId,
    accountId,
    queueName,
  });
  assertEquals(typeof res.ReceiptHandle, 'string');
  assertEquals(typeof res.NextVisibleTime, 'number');
});
