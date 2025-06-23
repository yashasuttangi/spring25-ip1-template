import express, { Response, Router } from 'express';
import { UserRequest, User, UserCredentials, UserByUsernameRequest } from '../types/types';
import {
  deleteUserByUsername,
  getUserByUsername,
  loginUser,
  saveUser,
  updateUser,
} from '../services/user.service';

const userController = () => {
  const router: Router = express.Router();

  /**
   * Validates that the request body contains all required fields for a user.
   * @param req The incoming request containing user data.
   * @returns `true` if the body contains valid user fields; otherwise, `false`.
   */
  const isUserBodyValid = (req: UserRequest): boolean => {
    const { username, password } = req.body;

    // Check if username and password are provided and are non-empty strings
    return (
      typeof username === 'string' &&
      username.trim().length > 0 &&
      typeof password === 'string' &&
      password.trim().length > 0
    );
  };
  // TODO: Task 1 - Implement the isUserBodyValid function

  /**
   * Handles the creation of a new user account.
   * @param req The request containing username, email, and password in the body.
   * @param res The response, either returning the created user or an error.
   * @returns A promise resolving to void.
   */
  const createUser = async (req: UserRequest, res: Response): Promise<void> => {
    // TODO: Task 1 - Implement the createUser function
    console.log('Request', req.body)
    if (!isUserBodyValid(req)) {
      res.status(400).send('Invalid user body');
      return;
    }
    const { username, password } = req.body;

    const newUserData: User = {
      username: username.trim(),
      password,
      dateJoined: new Date(),
    };

    try {
      const createdUser = await saveUser(newUserData);
      if ('error' in createdUser) {
        res.status(500).send(createdUser.error);
        return;
      }

      res.status(200).json(createdUser);
    } catch (error) {
      res.status(500).send('Error creating user');
    }
    // res.status(501).send('Not implemented');
  };

  /**
   * Handles user login by validating credentials.
   * @param req The request containing username and password in the body.
   * @param res The response, either returning the user or an error.
   * @returns A promise resolving to void.
   */
  const userLogin = async (req: UserRequest, res: Response): Promise<void> => {
    // TODO: Task 1 - Implement the userLogin function
    if (!isUserBodyValid(req)) {
      res.status(400).send('Invalid user body');
      return;
    }

    const credentials: UserCredentials = {
      username: req.body.username.trim(),
      password: req.body.password,
    };
    try {
      const user = await loginUser(credentials);
      if ('error' in user) {
        res.status(401).send(user.error);
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).send('Error logging in user');
    }
    // res.status(501).send('Not implemented');
  };

  /**
   * Retrieves a user by their username.
   * @param req The request containing the username as a route parameter.
   * @param res The response, either returning the user or an error.
   * @returns A promise resolving to void.
   */
  const getUser = async (req: UserByUsernameRequest, res: Response): Promise<void> => {
    // TODO: Task 1 - Implement the getUser function
    const username = req.params.username?.trim();

    if (typeof username !== 'string' || username.length === 0) {
      res.status(400).send('Username is required');
      return;
    }

    try {
      const user = await getUserByUsername(username);
      if ('error' in user) {
        res.status(404).send(user.error);
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).send('Error fetching user data');
    }
    // res.status(501).send('Not implemented');
  };

  /**
   * Deletes a user by their username.
   * @param req The request containing the username as a route parameter.
   * @param res The response, either the successfully deleted user object or returning an error.
   * @returns A promise resolving to void.
   */
  const deleteUser = async (req: UserByUsernameRequest, res: Response): Promise<void> => {
    // TODO: Task 1 - Implement the deleteUser function
    const username = req.params.username?.trim();

    if (!username || username.length === 0) {
      res.status(400).send('Username is required');
      return;
    }

    try {
      const deletedUser = await deleteUserByUsername(username);
      if ('error' in deletedUser) {
        res.status(404).send(deletedUser.error);
        return;
      }
      res.status(200).json(deletedUser);
    } catch (error) {
      res.status(500).send('Error deleting user');
    }
    // res.status(501).send('Not implemented');
  };

  /**
   * Resets a user's password.
   * @param req The request containing the username and new password in the body.
   * @param res The response, either the successfully updated user object or returning an error.
   * @returns A promise resolving to void.
   */
  const resetPassword = async (req: UserRequest, res: Response): Promise<void> => {
    // TODO: Task 1 - Implement the resetPassword function
    const username = req.body.username?.trim();
    const newPassword = req.body?.password;

    if (!username || !newPassword || username.length === 0 || newPassword.trim().length === 0) {
      res.status(400).send('Invalid user body');
      return;
    }

    try {
      const updatedUser = await updateUser(username, { password: newPassword });
      if ('error' in updatedUser) {
        res.status(404).send(updatedUser.error);
        return;
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).send('Error resetting password');
    }
    // res.status(501).send('Not implemented');
  };

  // Define routes for the user-related operations.
  // TODO: Task 1 - Add appropriate HTTP verbs and endpoints to the router
  router.post('/signup', createUser);
  router.post('/login', userLogin);
  router.get('/getUser/:username?', getUser);
  router.delete('/deleteUser/:username', deleteUser);
  router.patch('/resetPassword', resetPassword);

  return router;
};

export default userController;
