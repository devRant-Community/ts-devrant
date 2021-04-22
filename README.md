# The great Rantscript done better in TypeScript

> Know what to provide!
> ![request-example](./images/request-example.png)

> Know what you get!
> ![response-suggestions](./images/response-suggestions.png)

# Custom requests

Endpoint not available, or not documented? Make a custom request!

```typescript

import DevRantAPI from 'ts-devrant'

DevRantAPI.request(
    'secret-endpoint',
    {
        myBody: true
    },
    {
        header: {
            x-new-header: "secret"
        }
    }
)

```
