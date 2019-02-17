const test = require('ava');
const sinon = require('sinon');

const mockRequest = (sessionData, body) => ({
  session: { data: sessionData },
  body,
});

const mockResponse = () => {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
};

const { login, logout, checkAuth } = require('./express-handlers');

test('login > should 400 if username is missing from body', async (t) => {
  const req = mockRequest(
    {},
    { password: 'boss' }
  );
  const res = mockResponse();
  await login(req, res);
  t.true(res.status.calledWith(400));
  t.true(res.json.calledWith({
    message: 'username and password are required'
  }));
});
test('should 400 if password is missing from body', async (t) => {
  const req = mockRequest(
    {},
    { username: 'hugo' }
  );
  const res = mockResponse();
  await login(req, res);
  t.true(res.status.calledWith(400));
  t.true(res.json.calledWith({
    message: 'username and password are required'
  }));
});
test('should 401 with message if user with passed username does not exist', async (t) => {
  const req = mockRequest(
    {},
    {
      username: 'hugo-boss',
      password: 'boss'
    }
  );
  const res = mockResponse();
  await login(req, res);
  t.true(res.status.calledWith(401));
  t.true(res.json.calledWith({
    message: 'No user with matching username'
  }));
});
test('should 401 with message if passed password does not match stored password', async (t) => {
  const req = mockRequest(
    {},
    {
      username: 'guest',
      password: 'not-good-password'
    }
  );
  const res = mockResponse();
  await login(req, res);
  t.true(res.status.calledWith(401));
  t.true(res.json.calledWith({
    message: 'Wrong password'
  }));
});
test('should 201 and set session.data with username if user exists and right password provided', async (t) => {
  const req = mockRequest(
    {},
    {
      username: 'guest',
      password: 'guest-boss'
    }
  );
  const res = mockResponse();
  await login(req, res);
  t.true(res.status.calledWith(201));
  t.true(res.json.called);
  t.deepEqual(
    req.session.data,
    { username: 'guest' }
  );
});

test('logout > should set session.data to null', async (t) => {
  const req = mockRequest({ username: 'hugo' });
  const res = mockResponse();
  await logout(req, res);
  t.is(req.session.data, null);
});

test('logout > should 200', async (t) => {
  const req = mockRequest({ username: 'hugo' });
  const res = mockResponse();
  await logout(req, res);
  t.true(res.status.calledWith(200));
});

test('checkAuth > should 401 if session data is not set', async (t) => {
  const req = mockRequest();
  const res = mockResponse();
  await checkAuth(req, res);
  t.true(res.status.calledWith(401));
});

test('checkAuth > should 200 with username from session if data is set', async (t) => {
  const req = mockRequest({ username: 'hugo' });
  const res = mockResponse();
  await checkAuth(req, res);
  t.true(res.status.calledWith(200));
  t.true(res.json.calledWith({ username: 'hugo' }));
})
