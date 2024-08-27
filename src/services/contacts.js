import { KEYS_OF_CONTACT, SORT_ORDER } from '../constants/index.js';
import { ContactsCollection } from '../db/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsFilters = ContactsCollection.find();

  if (filter.contactType) {
    contactsFilters
      .where(KEYS_OF_CONTACT.contactType)
      .equals(filter.contactType);
  }

  if (filter.isFavourite) {
    contactsFilters
      .where(KEYS_OF_CONTACT.isFavourite)
      .equals(filter.isFavourite);
  }
  if (userId) {
    contactsFilters.where('userId').equals(userId);
  }
  const [totalItems, contacts] = await Promise.all([
    ContactsCollection.find().merge(contactsFilters).countDocuments(),
    ContactsCollection.find()
      .merge(contactsFilters)
      .skip(skip)
      .limit(limit)
      .sort({
        [sortBy]: sortOrder,
      })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(totalItems, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, userId) => {
  return await ContactsCollection.findOne({ _id: contactId, userId: userId });
};

export const createContact = async (payload, userId) =>
  await ContactsCollection.create({ ...payload, userId: userId });

export const upsertContact = async (
  contactId,
  userId,
  payload,
  options = {},
) => {
  const rawResult = await ContactsCollection.findByIdAndUpdate(
    { _id: contactId, userId: userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );
  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = async (contactId, userId) => {
  const contact = await ContactsCollection.findByIdAndDelete({
    _id: contactId,
    userId: userId,
  });

  return contact;
};
