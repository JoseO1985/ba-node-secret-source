import supertest from 'supertest';
import { getTestableApi } from '../../tests/utils';
import { authRouter } from './auth';
import User from "../../models/User";
import Token from "../../services/Token/Token";
import Password from "../../services/Password/Password";

jest.mock('../../models/User');
jest.mock('../../services/Token/Token');
jest.mock('../../services/Password/Password');

const app = getTestableApi('/auth', authRouter);
const api = supertest(app);

describe('/login', () => {
  test('returns status 200 if the user data is correct', async () => {
    const mockToken = 'this_is_the_token';
    User.findOne.mockReturnValueOnce({ password: 'pass', id: 'randomId' })
    Token.generateToken.mockReturnValueOnce(mockToken);
    Password.compare.mockReturnValueOnce(true);
    Password.hashPassword.mockReturnValueOnce('randomHash');

    await api
      .post('/auth/login')
      .send({ email: 'f@mail.com', password: 'pass' })
      .expect(200)
      .expect({ token: mockToken, userId: 'randomId'});
  });

  test('returns status 400 if there is some missing data', (done) => {
    api
      .post('/auth/login')
      .send({ email: 'test@mail.com' })
      .expect(400, { error: 'Missing data' }, done);
  });
});
