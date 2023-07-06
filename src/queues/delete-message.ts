import { fetchData } from '../common/fetch-data.ts';
import { MNSQueueOptions } from '../types/mns-types.ts';

/**
 * 调用 DeleteMessage 接口删除已经被消费过的消息
 * [doc](https://help.aliyun.com/document_detail/35138.html)
 * 
 * https://github.com/zsqk/mns-sdk/issues/1
 */
export async function deleteMessage(
  param: {
    /**
     * 上次消费后返回的消息的ReceiptHandle。
     */
    receiptHandle: string;
  },
  { queueName, ...auth }: MNSQueueOptions,
): Promise<void> {
  const method = 'DELETE';
  const uri =
    `/queues/${queueName}/messages?ReceiptHandle=${param.receiptHandle}`;

  await fetchData({
    uri,
    method,
  }, auth);
}
