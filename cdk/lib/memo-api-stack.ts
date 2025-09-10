import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

/**
 * MemoApiStack クラス
 * このスタックは以下を構築します：
 * - DynamoDB テーブル（メモ保存用）
 * - Lambda 関数（Docker イメージで API ロジックを実行）
 * - API Gateway（Lambda を REST API として公開）
 */
export class MemoApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. DynamoDB テーブルを作成
    const table = new dynamodb.Table(this, "MemoTable", {
      // パーティションキーは "id"（文字列型）
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      // DynamoDB 上のテーブル名
      tableName: "MemoTable",
      // ストレージ削除時に自動削除（開発環境用）
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // 2. Lambda 関数（Docker イメージ）を作成
    const fn = new lambda.DockerImageFunction(this, "MemoFunction", {
      // Dockerfile を参照してイメージをビルド
      code: lambda.DockerImageCode.fromImageAsset("../api"),
      // Lambda 内で環境変数として DynamoDB のテーブル名を利用
      environment: { TABLE_NAME: table.tableName },
      // Lambda のメモリサイズ
      memorySize: 512
    });

    // Lambda に DynamoDB の読み書き権限を付与
    table.grantReadWriteData(fn);

    // 3. API Gateway（Lambda REST API）を作成
    // Lambda をプロキシ統合として REST API に接続
    new apigw.LambdaRestApi(this, "MemoApi", {
      handler: fn,
      proxy: true // 全てのリクエストを Lambda に転送
    });
  }
}

