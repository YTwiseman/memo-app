import { APIGatewayProxyHandler } from "aws-lambda";
import { saveMemo, getMemos } from "./memoService";

export const postMemo: APIGatewayProxyHandler = async (event) => {
  const body = JSON.parse(event.body || '{}');
  await saveMemo(body.text);
  return { statusCode: 200, body: JSON.stringify({ message: "Memo saved!" }) };
};

export const getMemo: APIGatewayProxyHandler = async () => {
  const memos = await getMemos();
  return { statusCode: 200, body: JSON.stringify(memos) };
};
