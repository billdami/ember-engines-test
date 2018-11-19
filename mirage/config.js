export default function() {

  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    http://www.ember-cli-mirage.com/docs/v0.3.x/shorthands/
  */

    let server = this;
    this.pretender.passthroughRequest = function (verb, path, request) {
        if (server.shouldLog()) {
            //eslint-disable-next-line no-console
            console.log(`Passthrough request: ${verb.toUpperCase()} ${request.url}`);
        }

        if (request.requestHeaders['content-type']) {
            request.requestHeaders['Content-Type'] = request.requestHeaders['content-type'];
            delete request.requestHeaders['content-type'];
        }
    };


    this.post('/token', (schema, req) => {
        const bodyPairs = req.requestBody.split('&').reduce((p, v) => {
            const pair = v.split('=');
            p[pair[0]] = pair[1];
            return p;
        }, {});

        return {
            access_token: `860cc0c8-6d5d-43bd-b619-a430cb54fd1a-${bodyPairs.client_id}`,
            token_type: "bearer",
            refresh_token: "13085b0e-4b27-4d19-b90e-cd6920d75c9f",
            expires_in: 1558668,
            scope: "read write"
        };
    });
}
