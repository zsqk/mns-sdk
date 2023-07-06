import {
  assertIsError,
} from 'https://deno.land/std@0.192.0/testing/asserts.ts';
import { receiveMessage } from './receive-message.ts';
import 'https://deno.land/std@0.193.0/dotenv/load.ts';

const accountId = Deno.env.get('accountId')!;
const regionId = Deno.env.get('regionId')!;
const accessKeyId = Deno.env.get('accessKeyId')!;
const accessKeySecret = Deno.env.get('accessKeySecret')!;
const queueName = Deno.env.get('queueName')!;

Deno.test('receiveMessage-s', async () => {
  const res = await receiveMessage({}, {
    accessKeyId,
    accessKeySecret,
    regionId,
    accountId,
    queueName,
  });
  console.log('res', res);
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
