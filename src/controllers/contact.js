import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  upsertContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveToCloudinary } from '../utils/saveToCloudinary.js';
import { saveFileToLocalMachine } from '../utils/saveFileToLocalMachine.js';
import { ENV_VARS } from '../constants/index.js';
import { env } from '../utils/env.js';

export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user._id,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const contactId = req.params.contactId;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(contactId, userId)) {
    return res.status(404).json({
      status: 404,
      message: `Id ${contactId} is not valid`,
      data: { message: 'Contact not found' },
    });
  }

  const contact = await getContactById(contactId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

// POST
export const createContactController = async (req, res) => {
  const { body, file } = req;
  const contact = await createContact({ ...body, photo: file }, req.user._id);

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

// PATCH
export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env(ENV_VARS.ENABLE_CLOUDINARY) === 'true') {
      photoUrl = await saveToCloudinary(photo);
    } else {
      photoUrl = await saveFileToLocalMachine(photo);
    }
  }

  const contact = await upsertContact(contactId, userId, {
    ...req.body,
    photo: photoUrl,
  });

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    res.json({ data: { message: 'Contact not found!' } });
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: contact,
  });
};

// DELETE
export const deleteContactController = async (req, res, next) => {
  const contactId = req.params.contactId;
  const userId = req.user._id;
  const contact = await deleteContact(contactId, userId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).json({});
};
