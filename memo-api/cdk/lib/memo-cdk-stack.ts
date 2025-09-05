import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { Construct } from 'constructs';

export class MemoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ① DynamoDBテーブル
    const table = new dynamodb.Table(this, 'MemoTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    });

    // ② ECRリポジトリ（Lambda用イメージ格納先）
    const repo = new ecr.Repository(this, 'MemoRepo', {
      repositoryName: 'memo-api',
      removalPolicy: cdk.RemovalPolicy.RETAIN, // 本番はRETAIN推奨
    });

    // ③ Lambda (ECRイメージを参照する形にする)
    const memoLambda = new lambda.DockerImageFunction(this, 'MemoLambda', {
      code: lambda.DockerImageCode.fromEcr(repo), // ECRからデプロイ
      environment: { MEMO_TABLE: table.tableName },
    });

    table.grantReadWriteData(memoLambda);

    // ④ API Gateway
    const api = new apigateway.RestApi(this, 'MemoApi');
    const memoResource = api.root.addResource('memo');
    memoResource.addMethod('POST', new apigateway.LambdaIntegration(memoLambda));
    memoResource.addMethod('GET', new apigateway.LambdaIntegration(memoLambda));

    // ⑤ 出力にECRリポジトリURIを表示
    new cdk.CfnOutput(this, 'EcrRepoUri', {
      value: repo.repositoryUri,
    });
  }
}
