# Etapa 1: Build de dependências base
FROM node:22-alpine AS builder

# Diretório de trabalho
WORKDIR /opt/cdt/

# Copia o restante dos arquivos
COPY . .

# Instala dependências em cache e constrói o projeto
RUN npm install && npm run build:prd

# Etapa 2: Imagem final mais enxuta
FROM node:22-alpine

# Diretório de trabalho
WORKDIR /opt/cdt/

# Copia apenas os artefatos necessários da etapa de build
COPY --from=builder /opt/cdt/dist ./dist
COPY --from=builder /opt/cdt/node_modules ./node_modules
COPY --from=builder /opt/cdt/package*.json ./

ENV BANKS_TIMEOUT_IN_SECONDS=10
ENV BRASIL_API_URL=https://brasilapi.com.br/api
ENV CEP_TIMEOUT_IN_SECONDS=5
ENV CNPJ_TIMEOUT_IN_SECONDS=5
ENV HOLIDAYS_TIMEOUT_IN_SECONDS=5
ENV HTTP_PORT=3000

# Exposição de porta
EXPOSE 3000

# Comando de execução
CMD [ "node", "dist/index.js" ]
