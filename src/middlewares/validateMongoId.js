import createHttpError from 'http-errors';
import mongoose from 'mongoose';

export const validateMongoId = (id) => (req, res, next) => {
  const validatedId = req.params[id];
  if (!validatedId) {
    throw new Error('Error entering Id');
  }
  if (!mongoose.isValidObjectId(validatedId)) {
    return next(createHttpError(400, `Id ${validatedId} is not valid`));
  }
  return next();
};
