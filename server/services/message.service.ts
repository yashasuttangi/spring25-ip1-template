import MessageModel from '../models/messages.model';
import { Message, MessageResponse } from '../types/types';

/**
 * Saves a new message to the database.
 *
 * @param {Message} message - The message to save
 *
 * @returns {Promise<MessageResponse>} - The saved message or an error message
 */
export const saveMessage = async (message: Message): Promise<MessageResponse> => {
  // TODO: Task 2 - Implement the saveMessage function. Refer to other service files for guidance.
  try {
    const savedMessage = await MessageModel.create(message);
    return savedMessage.toObject() as MessageResponse;
  } catch (error) {
    return { error: 'Error saving message' };
  }
};
// ({ error: 'Not implemented' });

/**
 * Retrieves all messages from the database, sorted by date in ascending order.
 *
 * @returns {Promise<Message[]>} - An array of messages. If an error occurs, an empty array is returned.
 */
export const getMessages = async (): Promise<Message[]> => {
  // TODO: Task 2 - Implement the getMessages function
  try {
    const messages = await MessageModel.find().sort({ msgDateTime: 1 }).exec();
    return messages;
  } catch (error) {
    return [];
  }
};
