import {
  assertEquals,
  assertIsError,
} from 'https://deno.land/std@0.192.0/testing/asserts.ts';
import { receiveMessage } from './receive-message.ts';
import 'https://deno.land/std@0.193.0/dotenv/load.ts';
import { sendMessage } from './send-message.ts';
import { deleteMessage } from "./delete-message.ts";

const accountId = Deno.env.get('accountId')!;
const regionId = Deno.env.get('regionId')!;
const accessKeyId = Deno.env.get('accessKeyId')!;
const accessKeySecret = Deno.env.get('accessKeySecret')!;
const queueName = Deno.env.get('queueName')!;

Deno.test('receiveMessage-s', async () => {
  const s = await sendMessage({ messageBody: 'test', delaySeconds: 1 }, {
    accessKeyId,
    accessKeySecret,
    regionId,
    accountId,
    queueName,
  });
  const res = await receiveMessage({}, {
    accessKeyId,
    accessKeySecret,
    regionId,
    accountId,
    queueName,
  });
  assertEquals(typeof res.MessageId, 'string');
  assertEquals(typeof res.MessageBodyMD5, 'string');
  assertEquals(typeof res.MessageBody, 'string');
  assertEquals(typeof res.ReceiptHandle, 'string');
  assertEquals(typeof res.EnqueueTime, 'number'); // UNIX 毫秒时间戳
  assertEquals(typeof res.FirstDequeueTime, 'number'); // UNIX 毫秒时间戳
  assertEquals(typeof res.NextVisibleTime, 'number'); // UNIX 毫秒时间戳
  assertEquals(typeof res.DequeueCount, 'number');
  assertEquals(typeof res.Priority, 'number');

  // 删除 s 消息, 避免测试残留
  await deleteMessage({ receiptHandle: s.ReceiptHandle }, {
    accessKeyId,
    accessKeySecret,
    regionId,
    accountId,
    queueName,
  });
});

Deno.test('receiveMessage-fail-no-queue', async () => {
  const res = await receiveMessage({}, {
    accessKeyId,
    accessKeySecret,
    regionId,
    accountId,
    queueName: 'no-queue',
  }).catch((err) => err);
  assertIsError(res, Error, 'queue name you provided is not exist');
});
