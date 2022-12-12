# Best Practices

## [Reusing connections](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/node-reusing-connections.html)

By default, the default HTTP/HTTPS agent in Node.js creates a new TCP connection for each new request. This incurs a performance cost, as establishing a new connection can be expensive. To improve performance, you can reuse an existing connection instead of creating a new one for each request.

```
AWS_NODEJS_CONNECTION_REUSE_ENABLED=1
```
