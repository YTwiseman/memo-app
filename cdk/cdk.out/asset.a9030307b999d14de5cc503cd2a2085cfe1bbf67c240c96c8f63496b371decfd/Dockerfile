# ベースイメージ
FROM public.ecr.aws/lambda/nodejs:18

# 作業ディレクトリ
WORKDIR /var/task

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# Lambda ソースコードをコピー
COPY ./dist ./dist 

# Lambda ハンドラ指定
CMD ["dist/index.handler"]
