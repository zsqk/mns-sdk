import { fetchData } from '../common/fetch-data.ts';
import { MNSQueueOptions } from '../types/mns-types.ts';

/**
 * 调用 ReceiveMessage 接口消费队列中的消息
 * [doc](https://help.aliyun.com/document_detail/35136.html)
 */
export async function receiveMessage(
  { waitseconds }: {
    /**
     * 本次ReceiveMessage请求最长的Polling等待时间，单位为秒。
     */
    waitseconds?: number;
  } = {},
  { queueName, ...auth }: MNSQueueOptions,
) {
  const method = 'GET';
  const p = new URLSearchParams();
  if (waitseconds) {
    p.set('waitseconds', waitseconds.toString());
  }
  const uri = `/queues/${queueName}/messages`;

  const res = await fetchData({
    uri,
    method,
    query: { waitseconds },
  }, auth);

  return res;
}
