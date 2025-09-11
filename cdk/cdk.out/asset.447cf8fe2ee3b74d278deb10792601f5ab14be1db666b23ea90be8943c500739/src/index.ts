// API Gateway からのイベント型と戻り値型をインポート
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
// memoService から保存・取得関数をインポート
import { saveMemo, getMemos } from "./memoService";

// Lambda ハンドラー関数を定義
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // POST リクエストの場合（メモの保存）
    if (event.httpMethod === "POST") {
      // リクエストボディを JSON としてパース
      const body = JSON.parse(event.body || "{}");

      // memoService の saveMemo を呼び出してメモを保存
      const memo = await saveMemo(body.text);

      // 保存したメモをレスポンスとして返す
      return { statusCode: 200, body: JSON.stringify(memo) };
    }

    // GET リクエストの場合（メモの取得）
    if (event.httpMethod === "GET") {
      // memoService の getMemos を呼び出して全メモを取得
      const memos = await getMemos();

      // 取得したメモをレスポンスとして返す
      return { statusCode: 200, body: JSON.stringify(memos) };
    }

    // POST でも GET でもない場合は 405 Method Not Allowed
    return { statusCode: 405, body: "Method Not Allowed" };
  } catch (err) {
    // エラー発生時は 500 とエラー内容を返す
    return { statusCode: 500, body: JSON.stringify(err) };
  }
};

