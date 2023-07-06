import { hmac } from 'https://deno.land/x/somefn@v0.25.0/js/hash.ts';
import { encode } from 'https://deno.land/std@0.192.0/encoding/base64.ts';

/**
 * 生成 MNS auth 参数
 * [doc](https://help.aliyun.com/document_detail/27487.htm)
 * @param param0
 * @returns
 */
export async function genAuth({
  accessKeySecret,
  httpMethod,
  uri,
  headers,
}: {
  accessKeySecret: string;
  httpMethod: string;
  /** 包含 path 和 query */
  uri: string;
  /** 需要提前为 x-mns- 排好顺序, 名字需要变成小写 */
  headers: Record<string, string>;
}) {
  const contentMd5 = '';
  const canonicalizedMNSHeaders = Object.entries(headers).reduce(
    (pre, [k, v]) => {
      if (!k.startsWith('x-mns-')) {
        return pre;
      }
      return pre + `${k}:${v}\n`;
    },
    '',
  );
  const body = `${httpMethod}
${contentMd5}
${headers['Content-Type']}
${headers['Date']}
${canonicalizedMNSHeaders}${uri}`;
  const u8a = await hmac({ hash: 'SHA-1', s: accessKeySecret }, body);
  return encode(u8a);
}
