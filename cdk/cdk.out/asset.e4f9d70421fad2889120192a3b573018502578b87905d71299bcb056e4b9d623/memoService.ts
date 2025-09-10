import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const dynamo = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME!;

export const saveMemo = async (text: string) => {
  const item = { id: uuidv4(), text, createdAt: Date.now() };
  await dynamo.put({ TableName: TABLE_NAME, Item: item }).promise();
  return item;
};

export const getMemos = async () => {
  const result = await dynamo.scan({ TableName: TABLE_NAME }).promise();
  return result.Items || [];
};
