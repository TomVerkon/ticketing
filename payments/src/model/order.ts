import mongoose from 'mongoose'
import { OrderStatus } from '@tverkon-ticketing/common'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

export { OrderStatus }

/** properties that are required to create a new Order */
interface OrderAttrs {
  id: string
  status: OrderStatus
  version: number
  userId: string
  price: number
}

/**
 * properties that a User Document has.
 * mongoose.Document already has an id property
 */
export interface OrderDoc extends mongoose.Document {
  status: OrderStatus
  version: number
  userId: string
  price: number
}

// properties that a User model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
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
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
  }
)
orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)
orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    status: attrs.status,
    version: attrs.version,
    userId: attrs.userId,
    price: attrs.price,
  })
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order }
