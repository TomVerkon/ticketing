import mongoose, { Date } from "mongoose";

export enum OrderStatus {
  OrderExpired = "order:expired",
  OrderPaid = "order:paid",
  OrderPending = "order:pending",
}

// properties that are required to create a new User
interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticketId: string;
}

// properties that a User Document has
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticketId: string;
}

// properties that a User model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    ticketId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);
orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
