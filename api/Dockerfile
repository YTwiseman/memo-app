FROM public.ecr.aws/lambda/nodejs:18

# 作業ディレクトリを指定
WORKDIR ${LAMBDA_TASK_ROOT}

# package.json と package-lock.json だけ先にコピー
COPY package*.json ./

# 依存関係インストール
RUN npm install

# 残りのアプリをコピー
COPY . .

# Lambdaハンドラ
CMD ["index.handler"]
