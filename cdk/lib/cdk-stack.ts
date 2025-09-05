import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as ecr from 'aws-cdk-lib/aws-ecr';
//cdk：CDKの基本クラスや機能
//Construct：CDKの基本構造単位
//dynamodb, lambda, apigateway, ecr：それぞれのAWSサービスをCDKで扱うためのモジュール

//クラス定義
export class MemoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
//MemoStack がこのプロジェクトの全リソースをまとめるスタック
//scope：このスタックがどの親に属するか
//id：スタックの一意な名前
//props：オプションのCDK設定

    //DynamoDB テーブル作成
    const table = new dynamodb.Table(this, 'MemoTable',{
      partitionKey:{ name: 'id', type: dynamodb.AttributeType.STRING },
    });
    //MemoTable1という名前でテーブル作成
    //パーティションキー：id(文字列)
    //メモのIDをキーにして一意に管理

    // ECRリポジトリの作成
    const repo = new ecr.Repository(this, 'MemoRep', {
      repositoryName: 'memo-api',
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });
    //Dockerイメージを格納するECRリポジトリを作成
    //RemovalPolicy.RETAIN→スタック削除時にリポジトリは残す

    // Lambda(Dockerイメージ関数）ECR参照
    const memoLambda = new lambda.DockerImageFunction(this, 'Memolambda', {
      code: lambda.DockerImageCode.fromEcr(repo),
      environment: { MEMO_TABLE: table.tableName },
    });
    //DockerImageFunction を使ってECRのコンテナイメージからLambdaを作成
    //環境変数MEMO_TABLEにDynamoDBテーブル名をセット
    //LambdaがDynamoDBにアクセス可能にする
    
    table.grantReadWriteData(memoLambda);
    //Lambdaにテーブルの読み書き権限を付与

    //API Gateway
    const api = new apigateway.RestApi(this, 'MemoAPI');
    const memo = api.root.addResource('memo');
    memo.addMethod('POST', new apigateway.LambdaIntegration(memoLambda));
    memo.addMethod('GET', new apigateway.LambdaIntegration(memoLambda));
    //RestAPIでHTTPエンドポイントを作成
    // /memoリソースを作成
    // POSTとGETメソッドをLambdaに結合
    //これでユーザーが/memoにアクセスするとLambdaが呼ばれる

    //出力　（CloudFormation Output）
    new cdk.CfnOutput(this, 'EcrRepoUri', { value: repo.repositoryUri});
    new cdk.CfnOutput(this, 'ApiUri', { value: api.url });
    //デプロイ後にECRリポジトリURIとAPI URLを出力
    //GithubActionsや手動確認時に便利
  }
}
