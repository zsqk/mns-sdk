import { fetchData } from '../common/fetch-data.ts';
import { MNSQueueOptions } from '../types/mns-types.ts';

/**
 * 调用ChangeMessageVisibility接口,
 * 修改被消费过并且还处于Inactive状态的消息与其下次可被消费的时间间隔。
 * [doc](https://help.aliyun.com/document_detail/35142.html)
 *
 * 与删除相对应, 消费之后可以选择删除, 或者修改为可见以方便被其他人消费.
 *
 * https://github.com/zsqk/mns-sdk/issues/1
 */
export async function changeMessageVisibility(
  { receiptHandle, visibilityTimeout }: {
    /**
     * 上次消费后返回的消息的ReceiptHandle。
     */
    receiptHandle: string;
    /**
     * 从现在到下次可被用来消费的时间间隔，单位为秒。
     */
    visibilityTimeout: number;
  },
  { queueName, ...auth }: MNSQueueOptions,
): Promise<{
  /**
   * 本次修改消息VisibilityTimeout时返回的临时句柄，
   * 用于删除和修改状态为Inactive的消息，在NextVisibleTime时间之前有效。
   */
  ReceiptHandle: string;
  /**
   * 下次可被再次消费的时间，取值为从1970年01月01日00:00:00 000开始的毫秒数。
   */
  NextVisibleTime: number;
}> {
  const method = 'PUT';
  const uri = `/queues/${queueName}/messages?receiptHandle=${receiptHandle}`;

  const res = await fetchData({
    uri,
    method,
    query: {
      visibilityTimeout: visibilityTimeout,
    },
  }, auth);

  return res.ChangeVisibility;
}
