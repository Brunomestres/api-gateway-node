# API Gateway

Gateway HTTP do ecossistema Marketplace, construido com NestJS. O projeto centraliza a entrada das requisicoes, aplica camadas comuns de seguranca e expoe uma base pronta para encaminhar chamadas aos microsservicos da plataforma.

## Objetivo

Este servico foi estruturado para atuar como porta de entrada da aplicacao, concentrando responsabilidades como:

- roteamento para microsservicos internos;
- protecao basica da API com `helmet` e `CORS`;
- validacao global de payloads com `ValidationPipe`;
- limitacao de taxa com `@nestjs/throttler`;
- documentacao automatica com Swagger.

## Stack

- Node.js
- NestJS
- TypeScript
- Swagger
- Jest

## Funcionalidades ja presentes

- inicializacao de servidor NestJS;
- Swagger disponivel em `/api`;
- CORS habilitado;
- headers de seguranca via `helmet`;
- validacao global com remocao de campos nao permitidos;
- rate limiting global;
- configuracao dos endpoints-base dos microsservicos por variavel de ambiente;
- servico interno de proxy HTTP baseado em `HttpModule`;
- propagacao de contexto basico do usuario via headers;
- health check interno por servico upstream.

## Estado atual do projeto

No momento, o projeto ja possui a camada de servico de proxy implementada, com encaminhamento HTTP e verificacao de saude dos servicos. O que ainda nao existe e uma camada publica de controller/rotas usando esse servico como entrada oficial do gateway.

Hoje, as rotas observaveis no codigo sao:

- `GET /` retorna `Hello World!`;
- `GET /api` expoe a documentacao Swagger.

## Estrutura

```text
src/
  config/
    gateway.config.ts
  proxy/
    proxy.module.ts
    proxy.service.ts
  app.controller.ts
  app.module.ts
  app.service.ts
  main.ts
test/
  app.e2e-spec.ts
```

## Pre-requisitos

- Node.js 20+ recomendado
- npm

## Instalacao

```bash
npm install
```

## Como rodar

```bash
# desenvolvimento
npm run start:dev

# execucao padrao
npm run start

# producao
npm run build
npm run start:prod
```

Por padrao, a aplicacao sobe na porta `3000`. Voce pode alterar isso definindo a variavel `PORT`.

## Variaveis de ambiente

O projeto usa `@nestjs/config` com carregamento automatico de `.env`.

Exemplo:

```env
PORT=3000
USERS_SERVICE_URL=http://localhost:3001
PRODUCTS_SERVICE_URL=http://localhost:3002
CHECKOUT_SERVICE_URL=http://localhost:3003
PAYMENTS_SERVICE_URL=http://localhost:3004
```

Se alguma variavel nao for informada, o projeto utiliza os seguintes valores padrao:

| Variavel | Valor padrao |
| --- | --- |
| `USERS_SERVICE_URL` | `http://localhost:3001` |
| `PRODUCTS_SERVICE_URL` | `http://localhost:3002` |
| `CHECKOUT_SERVICE_URL` | `http://localhost:3003` |
| `PAYMENTS_SERVICE_URL` | `http://localhost:3004` |

## Scripts disponiveis

```bash
npm run build
npm run format
npm run lint
npm run start
npm run start:dev
npm run start:debug
npm run start:prod
npm run test
npm run test:watch
npm run test:cov
npm run test:debug
npm run test:e2e
```

## Testes

```bash
# testes unitarios
npm run test

# testes end-to-end
npm run test:e2e

# cobertura
npm run test:cov
```

## Seguranca e governanca

O projeto ja nasce com algumas preocupacoes transversais aplicadas globalmente:

- `helmet` para headers de seguranca;
- `CORS` habilitado;
- `ValidationPipe` com `transform`, `whitelist` e `forbidNonWhitelisted`;
- `ThrottlerModule` configurado com limite de `100` requisicoes por `600000 ms` por contexto.

## Swagger

Com a aplicacao em execucao, acesse:

```text
http://localhost:3000/api
```

## Modulo Proxy

O modulo `proxy` concentra a comunicacao HTTP com os microsservicos internos e hoje funciona como uma camada reutilizavel dentro da aplicacao.

O `ProxyService` atualmente oferece:

- `proxyRequest(serviceName, method, path, data, headers, userInfo)` para encaminhar requisicoes ao servico de destino;
- `getServiceHealth(serviceName)` para consultar o endpoint `/health` de cada upstream;
- enriquecimento dos headers com `X-User-id`, `X-User-email` e `X-User-role`;
- log basico de tentativas e falhas de proxy.

Servicos mapeados hoje:

- `users`
- `products`
- `checkout`
- `payments`

## Proximos passos sugeridos

- criar controllers que exponham rotas do gateway usando o `ProxyService`;
- mapear rotas publicas e protegidas do gateway;
- adicionar autenticacao e propagacao de tokens;
- criar health checks por servico;
- expandir os testes para cobrir fluxos de proxy e falhas upstream.
