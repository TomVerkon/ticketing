import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

/** properties that are required to create a new Payment */
interface PaymentAttrs {
  orderId: string;
  paymentId: string;
}

/**
 * properties that a User Document has.
 * mongoose.Document already has an id property
 */
export interface PaymentDoc extends mongoose.Document {
  orderId: string;
  paymentId: string;
}

// properties that a User model has
interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
paymentSchema.set('versionKey', 'version');
paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema);

export { Payment };
