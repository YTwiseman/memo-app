// AWS SDK から DynamoDB クラスをインポート
import { DynamoDB } from "aws-sdk";
// UUID v4 を生成する関数をインポート（メモの一意ID用）
import { v4 as uuidv4 } from "uuid";

// DynamoDB にアクセスするためのクライアントを作成
const dynamo = new DynamoDB.DocumentClient();

// 環境変数から DynamoDB テーブル名を取得
const TABLE_NAME = process.env.TABLE_NAME!;

// メモを保存する関数
export const saveMemo = async (text: string) => {
  // 保存するアイテムを作成
  // id: 一意の UUID
  // text: 引数で渡されたメモ本文
  // createdAt: 保存時刻（ミリ秒）
  const item = { id: uuidv4(), text, createdAt: Date.now() };

  // DynamoDB にアイテムを保存
  await dynamo.put({ TableName: TABLE_NAME, Item: item }).promise();

  // 保存したアイテムを返す
  return item;
};

// メモを全件取得する関数
export const getMemos = async () => {
  // DynamoDB テーブルをスキャンして全アイテムを取得
  const result = await dynamo.scan({ TableName: TABLE_NAME }).promise();

  // 取得したアイテムを返す。もし空なら空配列を返す
  return result.Items || [];
};
