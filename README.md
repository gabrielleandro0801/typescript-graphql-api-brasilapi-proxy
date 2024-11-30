<h1 align="center"> Typescript GraphQL API BrasilAPI Proxy :brazil:</h1>

Repository with a GraphQL API with a proxy for [Brasil API](https://brasilapi.com.br/docs)

## Building Docker image :whale:
``` bash
docker build -t graphql-api .
```

## Running container :computer:
``` bash
docker run \
 -p 3000:3000 \
 --name graphql-api \
 graphql-api
```

## Example

### Building image
![image](https://github.com/gabrielleandro0801/typescript-graphql-api-brasilapi-proxy/blob/master/images/building-image.png)

### Running container
![image](https://github.com/gabrielleandro0801/typescript-graphql-api-brasilapi-proxy/blob/master/images/running-container.png)

### Requesting through Postman
![image](https://github.com/gabrielleandro0801/typescript-graphql-api-brasilapi-proxy/blob/master/images/requesting-through-postman.png)

## Acknowledgments
Brasil API
- [Brasil API](https://brasilapi.com.br/docs)

GraphQL in NodeJS
- [Medium - Aman Ahmed](https://medium.com/@aman.ahmed1897/an-introduction-to-graphql-in-node-js-with-typescript-5bb839d1f26d)
- [dev.to - Abeinemukama Vicent](https://dev.to/abeinevincent/build-a-graphql-api-with-nodejs-and-typescript-a-comprehensive-guide-ajj)

This repository is not intended to replace Brasil API, it's a study case instead.
