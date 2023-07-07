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
): Promise<Record<string, any>> {
  const contentType = 'text/xml';
  const date = new Date().toUTCString();
  const headers: HeadersInit = {
    'Content-Type': contentType,
    'x-mns-version': '2015-06-06',
    'Date': date,
  };

  const host = `https://${accountId}.mns.${regionId}.aliyuncs.com`;
  let url = `${host}${uri}`;

  if (query) {
    if (url.includes('?')) {
      // 为了部分绕过 URL 编码的异常做法
      const q = new URLSearchParams();
      Object.entries(query).forEach(([k, v]) => {
        if (v !== undefined) {
          q.set(k, v.toString());
        }
      });
      url += `&${q}`;
    } else {
      // 正常做法
      const p = new URL(url);
      Object.entries(query).forEach(([k, v]) => {
        if (v !== undefined) {
          p.searchParams.set(k, v.toString());
        }
      });
      url = p.toString();
    }
  }

  const auth = await genAuth({
    accessKeySecret,
    httpMethod: method,
    uri: url.slice(host.length),
    headers,
  });

  let xmlContent: string | undefined = undefined;

  if (payload) {
    const builder = new XMLBuilder();
    xmlContent = builder.build(payload);
  }

  const res = await fetch(
    url,
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
  const jObj: Record<string, unknown> = parser.parse(res);
  if ('Error' in jObj) {
    throw getErrInfo(jObj.Error);
  }
  return jObj;
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
