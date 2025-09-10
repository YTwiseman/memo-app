import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { saveMemo, getMemos } from "./memoService";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");
      const memo = await saveMemo(body.text);
      return { statusCode: 200, body: JSON.stringify(memo) };
    }

    if (event.httpMethod === "GET") {
      const memos = await getMemos();
      return { statusCode: 200, body: JSON.stringify(memos) };
    }

    return { statusCode: 405, body: "Method Not Allowed" };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify(err) };
  }
};
