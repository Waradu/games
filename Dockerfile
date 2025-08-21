FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lock ./

RUN apt-get update -y && \
    apt-get install -y libstdc++6 openssl && \
    rm -rf /var/lib/apt/lists/*

RUN bun install

COPY . .
RUN bun run build

CMD ["bun", "run", "start"]