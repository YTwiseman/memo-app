#それぞれのツールの役割

1. TypeScript（APIとCDK定義）

API

`POST /memo`：ユーザーから送られた `text` をDynamoDBに保存
`GET /memo`：DynamoDBから全メモを取得して返却


CDK定義:
Lambda関数、API Gateway、DynamoDBなどをTypeScriptでコード化

ポイント:
アプリケーションのビジネスロジックとインフラを一貫して管理可能
変更履歴や型安全性が確保できる


2. Docker（コンテナ化）

役割
TypeScriptで作ったAPIをコンテナ化
Lambdaが受け取れる形式（コンテナイメージ）に変換

ポイント

ローカル開発環境と本番環境で動作を統一
GitHub ActionsでビルドしてECRにプッシュ可能

 3. CDK（AWSリソースのIaC）

Lambda関数: Dockerコンテナを使ってAPIロジックを実行

API Gateway: `POST /memo` と `GET /memo` のエンドポイントを提供

DynamoDB: メモを保存するテーブル

IAMロール: LambdaからDynamoDBへのアクセス権限を付与

ポイント:
コードでAWSリソースを管理できる
インフラの再現性・安全性が高い


 4. GitHub Actions（CI/CD自動化）

役割:
mainブランチへのプッシュを検知
TypeScriptのビルド → Dockerイメージ作成 → ECRにプッシュ → `cdk deploy` でAWSにデプロイ

ポイント:
手動作業不要で変更をAWS環境に反映
デプロイの一貫性・安全性を確保

 5. DynamoDB（データストア）

役割:
メモ（テキスト）の保存
LambdaからCRUD操作
ポイント:

サーバレスでスケーラブル
高速アクセス可能、運用負荷が低い


6. API Gateway（HTTPエンドポイント）

役割:
`POST /memo` と `GET /memo` を提供
Lambda関数にリクエストをルーティング
ポイント:
認証やCORS設定も可能
Lambdaを外部から安全に公開

まとめ

1. TypeScriptでAPI実装 → GitHubにプッシュ
2. GitHub Actionsが自動でビルド → DockerイメージをECRにプッシュ
3. CDKでLambda・API Gateway・DynamoDBをデプロイ
4. ユーザーがAPI Gateway経由で `POST /memo` → DynamoDBに保存
5. `GET /memo` で保存済みメモを取得