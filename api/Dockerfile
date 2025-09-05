FROM public.ecr.aws/lambda/nodejs:18

# アプリコピー
COPY api/ ${LAMBDA_TASK_ROOT}/
WORKDIR ${LAMBDA_TASK_ROOT}

# 依存関係インストール
RUN npm install

# Lambdaハンドラ
CMD ["index.handler"]
