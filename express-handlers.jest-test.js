const mockRequest = (sessionData, body) => ({
  session: { data: sessionData },
  body,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const { login, logout, checkAuth } = require('./express-handlers');

describe('login', () => {
  test('should 400 if username is missing from body', async () => {
    const req = mockRequest(
      {},
      { password: 'boss' }
    );
    const res = mockResponse();
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'username and password are required'
    });
  });
  test('should 400 if password is missing from body', async () => {
    const req = mockRequest(
      {},
      { username: 'hugo' }
    );
    const res = mockResponse();
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'username and password are required'
    });
  });
  test('should 401 with message if user with passed username does not exist', async () => {
    const req = mockRequest(
      {},
      {
        username: 'hugo-boss',
        password: 'boss'
      }
    );
    const res = mockResponse();
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'No user with matching username'
    });
  });
  test('should 401 with message if passed password does not match stored password', async () => {
    const req = mockRequest(
      {},
      {
        username: 'guest',
        password: 'not-good-password'
      }
    );
    const res = mockResponse();
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Wrong password'
    });
  });
  test('should 201 and set session.data with username if user exists and right password provided', async () => {
    const req = mockRequest(
      {},
      {
        username: 'guest',
        password: 'guest-boss'
      }
    );
    const res = mockResponse();
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
    expect(req.session.data).toEqual({
      username: 'guest',
    });
  });
});
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
