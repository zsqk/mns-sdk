import { fetchData } from '../common/fetch-data.ts';
import { MNSQueueOptions } from '../types/mns-types.ts';

/**
 * 调用 SendMessage 接口发送消息到指定的队列
 * [doc](https://help.aliyun.com/document_detail/35134.html)
 */
export function sendMessage(param: {
  /**
   * 消息正文。
   */
  messageBody: string;
  /**
   * 指定消息的优先级权值，优先级更高的消息，将更早被消费。
   * 取值范围：1~16，数值越小优先级越高。
   * 默认值：8。
   */
  priority?: number;
}, { queueName, ...auth }: MNSQueueOptions): Promise<{
  /**
   * 消息编号，在一个队列中唯一。
   */
  MessageId: string;
  /**
   * 	消息正文的MD5值。
   */
  MessageBodyMD5: string;
}>;

/**
 * 调用 SendMessage 接口发送消息到指定的队列
 * [doc](https://help.aliyun.com/document_detail/35134.html)
 */
export function sendMessage(param: {
  /**
   * 消息正文。
   */
  messageBody: string;
  /**
   * 消息发送后，经过DelaySeconds设置的时间后可被消费。
   * 取值范围：0~604800，单位为秒。
   * 默认值：0。
   */
  delaySeconds: number;
  /**
   * 指定消息的优先级权值，优先级更高的消息，将更早被消费。
   * 取值范围：1~16，数值越小优先级越高。
   * 默认值：8。
   */
  priority?: number;
}, { queueName, ...auth }: MNSQueueOptions): Promise<{
  /**
   * 消息编号，在一个队列中唯一。
   */
  MessageId: string;
  /**
   * 	消息正文的MD5值。
   */
  MessageBodyMD5: string;
  /**
   * 发送延迟消息后返回的消息句柄。
   */
  ReceiptHandle: string;
}>;

export async function sendMessage(
  param: {
    messageBody: string;
    delaySeconds?: number;
    priority?: number;
  },
  { queueName, ...auth }: MNSQueueOptions,
) {
  const method = 'POST';
  const uri = `/queues/${queueName}/messages`;

  const res = await fetchData({
    uri,
    method,
    payload: {
      Message: {
        MessageBody: param.messageBody,
        DelaySeconds: param.delaySeconds,
        Priority: param.priority,
      },
    },
  }, auth);

  return res.Message;
}
