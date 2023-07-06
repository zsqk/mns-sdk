import { assertEquals } from 'https://deno.land/std@0.192.0/testing/asserts.ts';
import { genAuth } from './sign.ts';

const accessKeySecret = '3';

Deno.test('test', async () => {
  const queueName = 'test';
  const httpMethod = 'POST';
  const contentType = 'text/xml';
  const date = 'Wed, 01 Jan 2020 00:00:00 GMT';
  const uri = `/queues/${queueName}/messages`;
  const headers = {
    'Content-Type': contentType,
    'x-mns-version': '2015-06-06',
    'Date': date,
  };
  const auth = await genAuth({
    accessKeySecret,
    httpMethod,
    uri,
    headers,
  });

  assertEquals(auth, 'Yzmk08aMkvzpuwF+F4YK1xJefr0=');
});
