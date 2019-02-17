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

test.todo('should succeed')
