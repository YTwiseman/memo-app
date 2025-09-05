FROM public.ecr.aws/lambda/nodejs:18

# 作業ディレクトリを指定
WORKDIR ${LAMBDA_TASK_ROOT}

# package.json と package-lock.json だけ先にコピー
COPY package*.json ./

# 依存関係インストール
COPY api/package*.json ${LAMBDA_TASK_ROOT}/
WORKDIR ${LAMBDA_TASK_ROOT}

# クリーンインストール
RUN npm install --production


# 残りのアプリをコピー
COPY ./api /.

# Lambdaハンドラ
CMD ["index.handler"]
