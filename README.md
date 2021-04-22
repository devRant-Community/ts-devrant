# The great Rantscript done better in TypeScript

-   All Responses are properly typed
-   Support for Browser AND NodeJS
-   Just plain cooler.

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
