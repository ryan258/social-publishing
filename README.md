# Social Publishing Project

- http requests are stateless - no knowledge of what happened before it
  - so how do we establish trust & identity requests?
    - sessions - (w/ express-session)
    - tokens

## Glossary

**promise** - an object that represents the eventual completion of an asynchronous operation.

**session** - allows us to have persistent data from one req to the other

1. the server stores the session data in memory
2. sends instructions to the web browsers to create a cookie
3. once a browser has a cookie, it'll send any/all cookies for the current domain back to the server w/ every single request

## Links

- [codepen - promises](https://codepen.io/anon/pen/eabJgY?editors=0010)
