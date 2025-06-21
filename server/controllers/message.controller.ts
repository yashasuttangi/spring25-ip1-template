import express, { Response, Request } from 'express';
import { FakeSOSocket } from '../types/socket';
import { AddMessageRequest, Message, MessageResponse } from '../types/types';
import { saveMessage, getMessages } from '../services/message.service';

const messageController = (socket: FakeSOSocket) => {
  const router = express.Router();
  // TODO: Task 2 - Implement the isRequestValid function

  /**
   * Validates the Message object to ensure it contains the required fields.
   *
   * @param message The message to validate.
   *
   * @returns `true` if the message is valid, otherwise `false`.
   */
  const isMessageValid = (message: Message): boolean =>
    // TODO: Task 2 - Implement the isMessageValid function
    message &&
    typeof message.msg === 'string' &&
    message.msg.trim() !== '' &&
    typeof message.msgFrom === 'string' &&
    message.msgFrom.trim() !== '' &&
    message.msgDateTime instanceof Date &&
    !Number.isNaN(message.msgDateTime.getTime());
  // Moving this block below as isMessageValid was being used before defined - to resolve the lint error
  /**
   * Checks if the provided message request contains the required fields.
   *
   * @param req The request object containing the message data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isRequestValid = (req: AddMessageRequest): boolean =>
    req.body && req.body.messageToAdd && isMessageValid(req.body.messageToAdd);
  /**
   * Handles adding a new message. The message is first validated and then saved.
   * If the message is invalid or saving fails, the HTTP response status is updated.
   *
   * @param req The AddMessageRequest object containing the message and chat data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addMessageRoute = async (req: AddMessageRequest, res: Response): Promise<void> => {
    /**
     * TODO: Task 2 - Implement the addMessageRoute function.
     * Note: you will need to uncomment the line below. Refer to other controller files for guidance.
     * This emits a message update event to the client. When should you emit this event? You can find the socket event definition in the server/types/socket.d.ts file.
     */
    if (!isRequestValid(req)) {
      res.status(400).send('Invalid message data');
      return;
    }

    const messageToSave: Message = req.body.messageToAdd;
    try {
      const msgFromDb: MessageResponse = await saveMessage(messageToSave);

      if ('error' in msgFromDb) {
        res.status(500).send(msgFromDb.error);
        return;
      }

      socket.emit('messageUpdate', { msg: msgFromDb });

      res.status(201).json(msgFromDb);
    } catch (error) {
      res.status(500).send('Error saving message');
    }
  };

  /**
   * Fetch all messages in descending order of their date and time.
   * @param req The request object.
   * @param res The HTTP response object used to send back the messages.
   * @returns A Promise that resolves to void.
   */
  const getMessagesRoute = async (req: Request, res: Response): Promise<void> => {
    // TODO: Task 2 - Implement the getMessagesRoute function
    try {
      const messages = await getMessages();
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).send('Error fetching messages');
    }
    // res.status(501).send('Not implemented');
  };

  // Add appropriate HTTP verbs and their endpoints to the router
  router.post('/addMessage', addMessageRoute);
  router.get('/getMessages', getMessagesRoute);

  return router;
};

export default messageController;
