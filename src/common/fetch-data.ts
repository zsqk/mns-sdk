import { genAuth } from '../common/sign.ts';
import { XMLBuilder, XMLParser } from 'npm:fast-xml-parser@4.2.5';
import { MNSOptions } from '../types/mns-types.ts';

/**
 * MNS 通用请求
 * @param param0 业务参数
 * @param param1 鉴权参数
 * @returns
 */
export async function fetchData(
  { uri, method, payload, query }: {
    uri: string;
    method: string;
    payload?: unknown;
    query?: Record<string, string | number | undefined>;
  },
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

  let xmlContent: string | undefined = undefined;

  if (payload) {
    const builder = new XMLBuilder();
    xmlContent = builder.build(payload);
  }

  const p = new URLSearchParams();
  if (query) {
    Object.entries(query).forEach(([k,v]) => {
      if (v !== undefined) {
        p.set(k, v.toString());
      }
    })
  }

  const res = await fetch(
    `https://${accountId}.mns.${regionId}.aliyuncs.com${uri}?${p.toString()}`,
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
    console.error('error: ', v);
    return new Error(v.Message);
  }
  return new Error(JSON.stringify(v));
}
