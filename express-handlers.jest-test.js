const mockRequest = (sessionData) => ({
  session: { data: sessionData }
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const { checkAuth } = require('./express-handlers');

// describe('login', () => {});
// describe('logout', () => {});
describe('checkAuth', () => {
  test('should 401 if session data is not set', async () => {
    const req = mockRequest();
    const res = mockResponse();
    await checkAuth(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });
  test('should 200 with username from session if session data is set', async () => {
    const req = mockRequest({ username: 'hugo' });
    const res = mockResponse();
    await checkAuth(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ username: 'hugo' });
  });
});
