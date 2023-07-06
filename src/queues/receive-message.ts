import { fetchData } from '../common/fetch-data.ts';
import { MNSQueueOptions } from '../types/mns-types.ts';

/**
 * 调用 ReceiveMessage 接口消费队列中的消息
 * [doc](https://help.aliyun.com/document_detail/35136.html)
 */
export async function receiveMessage(
  query: {
    /**
     * 本次ReceiveMessage请求最长的Polling等待时间，单位为秒。
     */
    waitseconds?: number;
  } = {},
  { queueName, ...auth }: MNSQueueOptions,
): Promise<{
  /**
   * 消息编号，在一个Queue中唯一。
   */
  MessageId: string;
  /**
   * 消息正文的MD5值。
   */
  MessageBodyMD5: string;
  /**
   * 消息正文。
   */
  MessageBody: string;
  /**
   * 本次获取消息产生的临时句柄，用于删除和修改处于Inactive状态的消息，NextVisibleTime之前有效。
   */
  ReceiptHandle: string;
  /**
   * 消息发送到队列的时间，从1970年01月01日00:00:00 000开始的毫秒数。
   */
  EnqueueTime: number | string;
  /**
   * 第一次被消费的时间，从1970年01月01日00:00:00 000开始的毫秒数。
   */
  FirstDequeueTime: number | string;
  /**
   * 下次可被再次消费的时间，从1970年01月01日00:00:00 000开始的毫秒数。
   */
  NextVisibleTime: number | string;
  /**
   * 	总共被消费的次数。
   */
  DequeueCount: number;
  /**
   * 	消息的优先级权值。
   */
  Priority: number;
}> {
  const method = 'GET';

  const uri = `/queues/${queueName}/messages`;

  const res = await fetchData({
    uri,
    method,
    query,
  }, auth);

  return res.Message;
}
