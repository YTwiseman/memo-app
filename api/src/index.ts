import express from 'express'; //HTTPサーバを作るライブラリ
import { DynamoDB } from 'aws-sdk'; //AWSサービスへのアクセス
import { v4 as uuidv4 } from 'uuid'; //メモのID用

const app = express(); //apiサーバーの本体
app.use(express.json()); //express.json()で受信したjsonを自動でパース
//POSTリクエストのボディをreq.bodyで扱えるように

//DynamoDBのクライアント準備
const tableName = process.env.MEMO_TABLE!; //DynamoDBのテーブル名を環境変数から取得
const db = new DynamoDB.DocumentClient(); //DynamoDB操作用のクライアント、DocumentClientはJSオブジェクトの形式で簡単に操作できるラッパー

//POST/memoエンドポイント、新しいメモを取得する
app.post('/memo', async (req, res)=> {
    const id = uuidv4();                 //uuidv4()で一意のIDを生成 
    const { text } = req.body;              //リクエストボディからtext取得
    await db.put({ TableName: tableName, Item: { id, text } }).promise(); //db.putでDynamoDBに｛ id, text }を保存
    res.status(201).json({id, text }); //HTTP201（Created）と共にJsonで返却
});

//GET/memoエンドポイント、保存された全メモを取得
app.get('/memo', async (req, res) => {
    const result = await db.scan({ TableName: tableName }).promise(); //db.scanでテーブル全体をスキャン
    res.json(result.Items); //result.Itemsに保存された全アイテムが入り、結果をJsonで返却
});

//サーバー起動
app.listen(3000, () => console.log('Server running')); //ポート3000でサーバー起動　console.logで起動確認