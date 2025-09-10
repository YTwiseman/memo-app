#!/usr/bin/env node
// 上の行はシェバン(shebang)と呼ばれ、スクリプトを直接実行したときに Node.js で実行されることを示す

// CDK ライブラリをインポート
import * as cdk from "aws-cdk-lib";

// 自作の CDK スタックをインポート
import { MemoApiStack } from "../lib/memo-api-stack";

// CDK アプリケーションを作成
const app = new cdk.App();

// MemoApiStack スタックを作成して CDK アプリに登録
// 第一引数: app インスタンス
// 第二引数: スタック名（AWS 上で作成されるリソースの論理IDや表示名に使われる）
new MemoApiStack(app, "MemoStack");
