import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as ecr from "aws-cdk-lib/aws-ecr";

export class MemoApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. DynamoDB テーブル作成
    const table = new dynamodb.Table(this, "MemoTable", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      tableName: "MemoTable",
      removalPolicy: cdk.RemovalPolicy.DESTROY, // 開発用。削除時にテーブルも消える
    });

    // 2. ECR リポジトリ参照
    const repo = ecr.Repository.fromRepositoryName(this, "MemoApiRepo", "memo-api");

    // 3. Lambda (Dockerイメージ) 作成
    const fn = new lambda.DockerImageFunction(this, "MemoFunction", {
      code: lambda.DockerImageCode.fromEcr(repo, {
        tagOrDigest: "latest", // 自分が push したイメージのタグ
      }),
      environment: { TABLE_NAME: table.tableName },
      memorySize: 512,
    });

    // Lambda に DynamoDB 権限を付与
    table.grantReadWriteData(fn);

    // 4. API Gateway
    new apigw.LambdaRestApi(this, "MemoApi", {
      handler: fn,
      proxy: true,
    });
  }
}

