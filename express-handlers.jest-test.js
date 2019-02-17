const mockRequest = (sessionData) => ({
  session: { data: sessionData }
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const { logout, checkAuth } = require('./express-handlers');

// describe('login', () => {});
describe('logout', () => {
  test('should set session.data to null', async () => {
    const req = mockRequest({ username: 'hugo' });
    const res = mockResponse();
    await logout(req, res);
    expect(req.session.data).toBeNull();
  });
  test('should 200', async () => {
    const req = mockRequest({ username: 'hugo' });
    const res = mockResponse();
    await logout(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
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
