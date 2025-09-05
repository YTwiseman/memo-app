import { DynamoDBClient, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

export const saveMemo = async (text: string) => {
  await client.send(new PutItemCommand({
    TableName: process.env.MEMO_TABLE!,
    Item: {
      id: { S: `${Date.now()}` },
      text: { S: text },
    },
  }));
};

export const getMemos = async () => {
  const data = await client.send(new ScanCommand({
    TableName: process.env.MEMO_TABLE!,
  }));
  return data.Items?.map(item => ({ id: item.id.S, text: item.text.S })) || [];
};
