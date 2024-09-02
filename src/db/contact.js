import { Schema, model } from 'mongoose';

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: false },
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      required: false,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
    },
    userId: { type: Schema.ObjectId, required: false },
    photoUrl: { type: String },
    // createdAt: { Date },
    // updatedAt: { Date },
  },
  { timestamps: true, versionKey: false },
);

export const ContactsCollection = model('contacts', contactSchema);
