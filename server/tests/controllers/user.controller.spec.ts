import supertest from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import * as util from '../../services/user.service';
import { SafeUser, User } from '../../types/types';

const mockUser: User = {
  _id: new mongoose.Types.ObjectId(),
  username: 'user1',
  password: 'password',
  dateJoined: new Date('2024-12-03'),
};

const mockSafeUser: SafeUser = {
  _id: mockUser._id,
  username: 'user1',
  dateJoined: new Date('2024-12-03'),
};

const mockUserJSONResponse = {
  _id: mockUser._id?.toString(),
  username: 'user1',
  dateJoined: new Date('2024-12-03').toISOString(),
};

const saveUserSpy = jest.spyOn(util, 'saveUser');
const loginUserSpy = jest.spyOn(util, 'loginUser');
const updatedUserSpy = jest.spyOn(util, 'updateUser');
const getUserByUsernameSpy = jest.spyOn(util, 'getUserByUsername');
const deleteUserByUsernameSpy = jest.spyOn(util, 'deleteUserByUsername');

describe('Test userController', () => {
  describe('POST /signup', () => {
    it('should create a new user given correct arguments', async () => {
      const mockReqBody = {
        username: mockUser.username,
        password: mockUser.password,
      };

      saveUserSpy.mockResolvedValueOnce(mockSafeUser);

      // ADDING A SPY AS I HAVE ADDED A CHECK TO

      const response = await supertest(app).post('/user/signup').send(mockReqBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUserJSONResponse);
      expect(saveUserSpy).toHaveBeenCalledWith({ ...mockReqBody, dateJoined: expect.any(Date) });
    });

    it('should return 400 for request missing username', async () => {
      const mockReqBody = {
        password: mockUser.password,
      };

      const response = await supertest(app).post('/user/signup').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    // TODO: Task 1 - Write additional test cases for signupRoute
    it('should return 400 for request missing password', async () => {
      const mockReqBody = {
        username: mockUser.username,
      };

      const response = await supertest(app).post('/user/signup').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    it('should return 400 for empty username and password', async () => {
      const mockReqBody = {
        username: '',
        password: '',
      };

      const response = await supertest(app).post('/user/signup').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    it('should return 500 if saveUser returns error', async () => {
      saveUserSpy.mockRejectedValueOnce(new Error('Database error'));

      const response = await supertest(app).post('/user/signup').send({
        username: mockUser.username,
        password: mockUser.password,
      });

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Error creating user');
    });
  });

  describe('POST /login', () => {
    it('should succesfully login for a user given correct arguments', async () => {
      const mockReqBody = {
        username: mockUser.username,
        password: mockUser.password,
      };

      loginUserSpy.mockResolvedValueOnce(mockSafeUser);

      const response = await supertest(app).post('/user/login').send(mockReqBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUserJSONResponse);
      expect(loginUserSpy).toHaveBeenCalledWith(mockReqBody);
    });

    it('should return 400 for request missing username', async () => {
      const mockReqBody = {
        password: mockUser.password,
      };

      const response = await supertest(app).post('/user/login').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    // TODO: Task 1 - Write additional test cases for loginRoute
    it('should return 400 for request missing password', async () => {
      const mockReqBody = {
        username: mockUser.username,
      };

      const response = await supertest(app).post('/user/login').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    it('should return 401 if user login fails with invalid credentials', async () => {
      const mockReqBody = {
        username: mockUser.username,
        password: 'wrongPassword',
      };

      loginUserSpy.mockResolvedValueOnce({ error: 'Invalid credentials / user not found' });

      const response = await supertest(app).post('/user/login').send(mockReqBody);

      expect(response.status).toBe(401);
      expect(response.text).toEqual('Invalid credentials / user not found');
    });

    it('should return 500 if an unexpected error occurs', async () => {
      const mockReqBody = {
        username: mockUser.username,
        password: mockUser.password,
      };

      loginUserSpy.mockRejectedValueOnce(new Error('Database error'));

      const response = await supertest(app).post('/user/login').send(mockReqBody);

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error logging in user');
    });
  });

  describe('PATCH /resetPassword', () => {
    it('should succesfully return updated user object given correct arguments', async () => {
      const mockReqBody = {
        username: mockUser.username,
        password: 'newPassword',
      };

      updatedUserSpy.mockResolvedValueOnce(mockSafeUser);

      const response = await supertest(app).patch('/user/resetPassword').send(mockReqBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ...mockUserJSONResponse });
      expect(updatedUserSpy).toHaveBeenCalledWith(mockUser.username, { password: 'newPassword' });
    });

    it('should return 400 for request missing username', async () => {
      const mockReqBody = {
        password: 'newPassword',
      };

      const response = await supertest(app).patch('/user/resetPassword').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    // TODO: Task 1 - Write additional test cases for resetPasswordRoute
    it('should return 400 for request missing password', async () => {
      const mockReqBody = {
        username: mockUser.username,
      };

      const response = await supertest(app).patch('/user/resetPassword').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid user body');
    });

    it('should return 400 for empty username', async () => {
      const mockReqBody = {
        username: '   ',
        password: mockUser.password,
      };

      const response = await supertest(app).patch('/user/resetPassword').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid user body');
    });

    it('should return 400 for empty password', async () => {
      const mockReqBody = {
        username: mockUser.username,
        password: '   ',
      };

      const response = await supertest(app).patch('/user/resetPassword').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid user body');
    });

    it('should return 404 if user not found', async () => {
      const mockReqBody = {
        username: mockUser.username,
        password: mockUser.password,
      };

      updatedUserSpy.mockResolvedValueOnce({ error: 'User not found' });

      const response = await supertest(app).patch('/user/resetPassword').send(mockReqBody);

      expect(response.status).toBe(404);
      expect(response.text).toBe('User not found');
    });

    it('should return 500 on internal server error', async () => {
      const mockReqBody = {
        username: mockUser.username,
        password: mockUser.password,
      };

      updatedUserSpy.mockRejectedValueOnce(new Error('Database error'));

      const response = await supertest(app).patch('/user/resetPassword').send(mockReqBody);

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error resetting password');
    });
  });

  describe('GET /getUser', () => {
    it('should return the user given correct arguments', async () => {
      getUserByUsernameSpy.mockResolvedValueOnce(mockSafeUser);

      const response = await supertest(app).get(`/user/getUser/${mockUser.username}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUserJSONResponse);
      expect(getUserByUsernameSpy).toHaveBeenCalledWith(mockUser.username);
    });

    it('should return 400 if username not provided', async () => {
      // Express automatically returns 404 for missing parameters when
      // defined as required in the route
      const response = await supertest(app).get('/user/getUser/');
      expect(response.status).toBe(400);
      expect(response.text).toBe('Username is required');
    });

    // TODO: Task 1 - Write additional test cases for getUserRoute
    it('should return 400 if username is empty string', async () => {
      const response = await supertest(app).get('/user/getUser/   ');
      expect(response.status).toBe(400);
      expect(response.text).toBe('Username is required');
    });

    it('should return 404 if user is not found', async () => {
      getUserByUsernameSpy.mockResolvedValueOnce({ error: 'User not found' });

      const response = await supertest(app).get('/user/getUser/nonExistingUser');

      expect(response.status).toBe(404);
      expect(response.text).toBe('User not found');
    });

    it('should return 500 if there is an internal server error', async () => {
      getUserByUsernameSpy.mockRejectedValueOnce(new Error('Database error'));

      const response = await supertest(app).get(`/user/getUser/${mockUser.username}`);

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error fetching user data');
    });
  });

  describe('DELETE /deleteUser', () => {
    it('should return the deleted user given correct arguments', async () => {
      deleteUserByUsernameSpy.mockResolvedValueOnce(mockSafeUser);

      const response = await supertest(app).delete(`/user/deleteUser/${mockUser.username}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUserJSONResponse);
      expect(deleteUserByUsernameSpy).toHaveBeenCalledWith(mockUser.username);
    });

    it('should return 404 if username not provided', async () => {
      // Express automatically returns 404 for missing parameters when
      // defined as required in the route
      const response = await supertest(app).delete('/user/deleteUser/');
      expect(response.status).toBe(404);
    });

    // TODO: Task 1 - Write additional test cases for deleteUserRoute
    it('should return 404 if username is an empty string', async () => {
      const response = await supertest(app).delete('/user/deleteUser/   ');
      expect(response.status).toBe(404);
    });

    it('should return 404 if user is not found', async () => {
      deleteUserByUsernameSpy.mockResolvedValueOnce({ error: 'User not found' });

      const response = await supertest(app).delete('/user/deleteUser/nonExistingUser');

      expect(response.status).toBe(404);
      expect(response.text).toBe('User not found');
    });

    it('should return 500 if an internal error occurs', async () => {
      deleteUserByUsernameSpy.mockRejectedValueOnce(new Error('Database error'));

      const response = await supertest(app).delete(`/user/deleteUser/${mockUser.username}`);

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error deleting user');
    });
  });
});
