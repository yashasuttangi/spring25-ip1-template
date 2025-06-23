import { MongoServerError } from 'mongodb';
import UserModel from '../models/users.model';
import { User, UserCredentials, UserResponse } from '../types/types';

/**
 * Saves a new user to the database.
 *
 * @param {User} user - The user object to be saved, containing user details like username, password, etc.
 * @returns {Promise<UserResponse>} - Resolves with the saved user object (without the password) or an error message.
 */
export const saveUser = async (user: User): Promise<UserResponse> => {
  // TODO: Task 1 - Implement the saveUser function. Refer to other service files for guidance.
  // This function should save the user to the database and return the saved user object without the password.
  try {
    const savedUser = await UserModel.create(user);
    const safeUser: UserResponse = {
      _id: savedUser._id,
      username: savedUser.username,
      dateJoined: savedUser.dateJoined,
    };
    return safeUser as UserResponse;
  } catch (error: unknown) {
    if (error instanceof MongoServerError && error.code === 11000 && error.keyPattern?.username) {
      return { error: 'Username already exists' };
    }
    return { error: 'Error saving user' };
  }
};
// ({ error: 'Not implemented' });

/**
 * Retrieves a user from the database by their username.
 *
 * @param {string} username - The username of the user to find.
 * @returns {Promise<UserResponse>} - Resolves with the found user object (without the password) or an error message.
 */
export const getUserByUsername = async (username: string): Promise<UserResponse> => {
  // TODO: Task 1 - Implement the getUserByUsername function. Refer to other service files for guidance.
  try {
    const user = await UserModel.findOne({ username }).select('-password').exec();
    if (!user) {
      return { error: 'User not found' };
    }
    const safeUser = user.toObject();
    return safeUser as UserResponse;
  } catch (error) {
    return { error: 'Error fetching user data' };
  }
};
// ({ error: 'Not implemented' });

/**
 * Authenticates a user by verifying their username and password.
 *
 * @param {UserCredentials} loginCredentials - An object containing the username and password.
 * @returns {Promise<UserResponse>} - Resolves with the authenticated user object (without the password) or an error message.
 */
export const loginUser = async (loginCredentials: UserCredentials): Promise<UserResponse> => {
  // TODO: Task 1 - Implement the loginUser function. Refer to other service files for guidance.
  try {
    const user = await UserModel.findOne(loginCredentials).select('-password').exec();
    if (!user) {
      return { error: 'Invalid credentials / user not found' };
    }
    const safeUser = user.toObject();
    return safeUser as UserResponse;
  } catch (error) {
    return { error: 'Error logging in user' };
  }
};
// ({ error: 'Not implemented' });

/**
 * Deletes a user from the database by their username.
 *
 * @param {string} username - The username of the user to delete.
 * @returns {Promise<UserResponse>} - Resolves with the deleted user object (without the password) or an error message.
 */
export const deleteUserByUsername = async (username: string): Promise<UserResponse> => {
  // TODO: Task 1 - Implement the deleteUserByUsername function. Refer to other service files for guidance.
  try {
    const deletedUser = await UserModel.findOneAndDelete({ username }).select('-password').exec();
    if (!deletedUser) {
      return { error: 'User not found' };
    }
    const safeUser = deletedUser.toObject();
    return safeUser as UserResponse;
  } catch (error) {
    return { error: 'Error deleting user' };
  }
};
// ({ error: 'Not implemented' });

/**
 * Updates user information in the database.
 *
 * @param {string} username - The username of the user to update.
 * @param {Partial<User>} updates - An object containing the fields to update and their new values.
 * @returns {Promise<UserResponse>} - Resolves with the updated user object (without the password) or an error message.
 */
export const updateUser = async (
  username: string,
  updates: Partial<User>,
): Promise<UserResponse> => {
  // TODO: Task 1 - Implement the updateUser function. Refer to other service files for guidance.
  try {
    const updatedUser = await UserModel.findOneAndUpdate({ username }, updates, {
      new: true,
      runValidators: true,
    })
      .select('-password')
      .exec();

    if (!updatedUser) {
      return { error: 'User not found' };
    }
    const safeUser = updatedUser.toObject();
    return safeUser as UserResponse;
  } catch (error) {
    return { error: 'Error updating user' };
  }
};
// ({ error: 'Not implemented' });
