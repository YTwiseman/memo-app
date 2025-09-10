import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

// MemoApiStack クラスを定義（CDK スタック）
export class MemoApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. DynamoDB テーブルを作成
    const table = new dynamodb.Table(this, "MemoTable", {
      // パーティションキーは "id"（文字列型）
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      // DynamoDB 上のテーブル名
      tableName: "MemoTable"
    });

    // 2. Lambda 関数（Docker イメージ）を作成
    const fn = new lambda.DockerImageFunction(this, "MemoFunction", {
      // Docker イメージを ../api ディレクトリの Dockerfile から作成
      code: lambda.DockerImageCode.fromImageAsset("../api"),
      // 環境変数としてテーブル名を渡す
      environment: { TABLE_NAME: table.tableName },
      // メモリサイズを 512MB に設定
      memorySize: 512
    });

    // Lambda に DynamoDB の読み書き権限を付与
    table.grantReadWriteData(fn);

    // 3. API Gateway（Lambda REST API）を作成
    // Lambda 関数をハンドラーとしてプロキシ統合
    new apigw.LambdaRestApi(this, "MemoApi", { handler: fn, proxy: true });
  }
}
