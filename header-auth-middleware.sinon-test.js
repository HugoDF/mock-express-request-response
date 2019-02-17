const test = require('ava');
const sinon = require('sinon');

const mockRequest = (authHeader, sessionData) => ({
  get(name) {
    if (name === 'authorization') return authHeader
    return null
  },
  session: { data: sessionData }
});

const mockResponse = () => {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
};

const headerAuthMiddleware = require('./header-auth-middleware');


test('should set req.session.data if API key is in authorization and is valid', async (t) => {
  const req = mockRequest('76b1e728-1c14-43f9-aa06-6de5cbc064c2');
  const res = mockResponse();
  await headerAuthMiddleware(req, res, () => {});

  t.deepEqual(
    req.session.data,
    { username: 'hugo' }
  );
});
test('should not do anything if req.session.data is already set', async (t) => {
  const req = mockRequest('76b1e728-1c14-43f9-aa06-6de5cbc064c2', { username: 'guest' });
  const res = mockResponse();
  await headerAuthMiddleware(req, res, () => {});

  t.deepEqual(
    req.session.data,
    { username: 'guest' }
  );
});
test('should not do anything if authorization header is not present', async (t) => {
  const req = mockRequest(undefined);
  const res = mockResponse();
  await headerAuthMiddleware(req, res, () => {});

  t.is(req.session.data, undefined);
});
test('should not do anything if api key is invalid', async (t) => {
  const req = mockRequest('invalid-api-key');
  const res = mockResponse();
  await headerAuthMiddleware(req, res, () => {});

  t.is(req.session.data, undefined);
});
