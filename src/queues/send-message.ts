import { genAuth } from '../common/sign.ts';
import { XMLBuilder, XMLParser, XMLValidator } from 'npm:fast-xml-parser@4.2.5';

type MNSOptions = {
  accountId: string;
  regionId: string;
  accessKeyId: string;
  accessKeySecret: string;
};

type MNSQueueOptions = { queueName: string } & MNSOptions;

/**
 * MNS 通用请求
 * @param param0 业务参数
 * @param param1 鉴权参数
 * @returns 
 */
async function fetchData(
  { uri, method, payload }: { uri: string; method: string; payload: unknown },
  { accessKeySecret, accountId, regionId, accessKeyId }: MNSOptions,
) {
  const contentType = 'text/xml';
  const date = new Date().toUTCString();
  const headers = {
    'Content-Type': contentType,
    'x-mns-version': '2015-06-06',
    'Date': date,
  };
  const auth = await genAuth({
    accessKeySecret,
    httpMethod: method,
    uri,
    headers,
  });

  const builder = new XMLBuilder();
  const xmlContent = builder.build(payload);

  const res = await fetch(
    `https://${accountId}.mns.${regionId}.aliyuncs.com${uri}`,
    {
      method,
      headers: {
        'Authorization': `MNS ${accessKeyId}:${auth}`,
        ...headers,
      },
      body: xmlContent,
    },
  ).then((v) => v.text());
  const parser = new XMLParser();
  console.log('res', res);
  const jObj: unknown = parser.parse(res);
  if (typeof jObj !== 'object' || jObj === null) {
    throw new Error('cannot parse');
  }
  if ('Message' in jObj) {
    return jObj.Message;
  }
  if ('Error' in jObj) {
    throw getErrInfo(jObj.Error);
  }
  throw new Error('cannot parse');
}

/**
 * 调用 SendMessage 接口发送消息到指定的队列
 * [doc](https://help.aliyun.com/document_detail/35134.html)
 */
export async function sendMessage(
  param: {
    /**
     * 消息正文。
     */
    messageBody: string;
    /**
     * 消息发送后，经过DelaySeconds设置的时间后可被消费。
     * 取值范围：0~604800，单位为秒。
     * 默认值：0。
     */
    delaySeconds?: number;
    /**
     * 指定消息的优先级权值，优先级更高的消息，将更早被消费。
     * 取值范围：1~16，数值越小优先级越高。
     * 默认值：8。
     */
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

  return res;
}

/**
 * 生成预期内的错误
 * [错误信息格式](https://help.aliyun.com/document_detail/27500.html)
 * [枚举错误代码](https://help.aliyun.com/document_detail/27501.html)
 * @param v
 * @returns
 */
function getErrInfo(v: unknown): Error {
  if (typeof v !== 'object' || v === null) {
    throw new Error('cannot parse');
  }

  if (
    'Code' in v && typeof v.Code === 'string' &&
    'Message' in v && typeof v.Message === 'string' &&
    'RequestId' in v && typeof v.RequestId === 'string' &&
    'HostId' in v && typeof v.HostId === 'string'
  ) {
    console.error(v);
    return new Error(v.Message);
  }
  return new Error(JSON.stringify(v));
}
