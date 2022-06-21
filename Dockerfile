FROM --platform=linux/amd64 node:18-alpine AS builder

RUN apk update
RUN apk add git
RUN npm install -g pnpm

RUN wget -q -t3 "https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key" -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && \
    echo "https://packages.doppler.com/public/cli/alpine/any-version/main" | tee -a /etc/apk/repositories && \
    apk add doppler

WORKDIR /app
ARG SCOPE
ENV SCOPE=${SCOPE}

ADD . ./
RUN pnpm install --ignore-scripts
RUN pnpx turbo run build --scope=${SCOPE} --include-dependencies --no-deps
RUN pnpm run --filter ${SCOPE} build

# FROM --platform=linux/amd64 node:16-alpine AS prd
# WORKDIR "/app"
# EXPOSE 3000

# COPY --from=builder /app/apps/api/package.json ./package.json
# COPY --from=builder /app/apps/api/dist ./dist
# COPY --from=builder /app/apps/api/hard_modules ./node_modules
# COPY --from=builder /app/apps/api/prisma ./prisma

RUN ["chmod", "+x", "/app/entrypoint.sh"]
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["doppler", "run", "--", "pnpm", "run", "--filter", "@lightdotso/api", "nest:start"]
