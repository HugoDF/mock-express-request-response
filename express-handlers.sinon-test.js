const test = require('ava');
const sinon = require('sinon');

const mockRequest = (sessionData) => ({
  session: { data: sessionData }
});

const mockResponse = () => {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
};

const { checkAuth } = require('./express-handlers');

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
