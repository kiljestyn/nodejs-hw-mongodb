import { Schema, model } from 'mongoose';

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    email: { type: String, required: false },
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      required: true,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
    },
    createdAt: { Date },
    updatedAt: { Date },
  },
  { timestamps: true, versionKey: false },
);

export const ContactsCollection = model('contacts', contactSchema);
