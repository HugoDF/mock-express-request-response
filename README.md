# Mock Express request/response with Jest or sinon

Full post at https://codewithhugo.com/express-request-response-mocking/

## Requirements

- Node 10
- npm 6

## Setup

1. Clone the repository
2. Run `npm install`
3. Run `npm start` (to start the application locally) or `npm t` to run the tests.

## npm scripts

- `npm t` (`npm run test`) will run both `ava` and `jest`-based test suites.
- `npm start` will start the application server (default PORT: 3000, can override using PORT environment variable)
- `npx jest` will run just `jest`-based tests
- `npx ava` will run just `ava`-based tests

## Requests

### Login

```sh
curl --request POST \
  --url http://localhost:3000/session \
  --header 'content-type: application/json' \
  --data '{
	"username": "hugo",
	"password": "boss"
}' -v
```

Sample Successful (200) Response:

```sh
> POST /session HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.54.0
> Accept: */*
> content-type: application/json
> Content-Length: 58
>
* upload completely sent off: 58 out of 58 bytes
< HTTP/1.1 201 Created
< X-Powered-By: Express
< Content-Type: application/json; charset=utf-8
< Set-Cookie: session=t_4OrqgrscRYVgGwtN0EMg.WmpPuJSiukSgV0iWS7oqg6a9rfsDTbtLcoQQiRkJyydfOjOI8HE9dP2kzcfTmRqR.1550427342962.3600000.Xajry447dwhSnzt1mXYN9SoYzd3PjTyo_Dwli5IrK6Y; path=/; expires=Fri, 15 Feb 2019 19:15:43 GMT; httponly
< Date: Fri, 15 Feb 2019 18:15:42 GMT
< Connection: keep-alive
< Content-Length: 0
```

What interests us is `Set-Cookie: session=t_4OrqgrscRYVgGwtN0EMg...` (truncated for readability).

This is an encrypted session (as created by `client-sessions`) contained in the `session` cookie.

### Logout

```sh
curl --request DELETE \
  --url http://localhost:3000/session \
  --cookie session=*INSERT_OUTPUT_OF_SET_COOKIE_SESSION_LOGIN_REQUEST* \
  -v
```

Sample Successful Response:
```sh
> DELETE /session HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.54.0
> Accept: */*
> Cookie: session=t_4OrqgrscRYVgGwtN0EMg.WmpPuJSiukSgV0iWS7oqg6a9rfsDTbtLcoQQiRkJyydfOjOI8HE9dP2kzcfTmRqR.1550427342962.3600000.Xajry447dwhSnzt1mXYN9SoYzd3PjTyo_Dwli5IrK6Y
>
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Content-Type: application/json; charset=utf-8
< Set-Cookie: session=97I-bC6WbilzHbqLhPJevg.vMfAWQscH6PChT-elMcYqy3vwtLcxKtTZ16X1abANHo.1550427342962.3600000.H6y03kGPA0Nd8sIJqDQHaOn4Rb377NOtOEGuGz9Ecu0; path=/; expires=Fri, 15 Feb 2019 19:15:43 GMT; httponly
< Date: Fri, 15 Feb 2019 18:19:13 GMT
< Connection: keep-alive
< Content-Length: 0
<
```

Again the interesting part of the response is `Set-Cookie: session=97I-bC6WbilzHbqLhPJevg.vMfAWQscH6PChT...` (truncated).

What the application code does is not actually clear the cookie, but override the contents of the cookie.

Therefore it sends back a `Set-Cookie` with this updated "session" (which is empty and `GET /session` using it will 401).

### Check

```sh
curl --request GET \
  --url http://localhost:3000/session \
  --cookie session=*INSERT_OUTPUT_OF_SET_COOKIE_SESSION_LOGIN_REQUEST* \
  -v
```

Sample Successful (200) Response:

```sh
> GET /session HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.54.0
> Accept: */*
> Cookie: session=t_4OrqgrscRYVgGwtN0EMg.WmpPuJSiukSgV0iWS7oqg6a9rfsDTbtLcoQQiRkJyydfOjOI8HE9dP2kzcfTmRqR.1550427342962.3600000.Xajry447dwhSnzt1mXYN9SoYzd3PjTyo_Dwli5IrK6Y
>
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Content-Type: application/json; charset=utf-8
< Content-Length: 19
< ETag: W/"13-NGIK6C7P0giZ5uHUWH1fsFMw4TY"
< Date: Sun, 17 Feb 2019 18:23:33 GMT
< Connection: keep-alive
<

{"username":"hugo"}
```

It reflects the username back to us from the session cookie.

Sample Fail (401) Response:

```sh
> GET /session HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.54.0
> Accept: */*
> Cookie: session=97I-bC6WbilzHbqLhPJevg.vMfAWQscH6PChT-elMcYqy3vwtLcxKtTZ16X1abANHo.1550427342962.3600000.H6y03kGPA0Nd8sIJqDQHaOn4Rb377NOtOEGuGz9Ecu0
>
< HTTP/1.1 401 Unauthorized
< X-Powered-By: Express
< Content-Type: application/json; charset=utf-8
< Date: Sun, 17 Feb 2019 18:25:38 GMT
< Connection: keep-alive
< Content-Length: 0
<
```

We're just interested in the 401 here :+1:.

### Header Authentication

```sh
curl --request GET \
  --url http://localhost:3000/session \
  --header 'authorization: Bearer 76b1e728-1c14-43f9-aa06-6de5cbc064c2' \
  -v
```
Sample Success (200) Response:
```sh
> GET /session HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.54.0
> Accept: */*
> authorization: Bearer 76b1e728-1c14-43f9-aa06-6de5cbc064c2
>
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Content-Type: application/json; charset=utf-8
< Content-Length: 19
< ETag: W/"13-NGIK6C7P0giZ5uHUWH1fsFMw4TY"
< Set-Cookie: session=-oSa0xHGDBZARqmdrTWjTQ.rExU9YRLm7dqNt3UfhVVTpnFnG0o_D2ZAlp-xfk3-1XOCFi_7Dc7d-MK3AguoyY8.1550437501888.3600000.tue12japVIW6kiCQ9o8UfTfYnIj5G_2auyeJXdOlOR0; path=/; expires=Sun, 17 Feb 2019 22:05:02 GMT; httponly
< Date: Sun, 17 Feb 2019 21:05:01 GMT
< Connection: keep-alive
<
{"username":"hugo"}
```
