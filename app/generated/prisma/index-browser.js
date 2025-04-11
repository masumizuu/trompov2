
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.UserScalarFieldEnum = {
  user_id: 'user_id',
  first_name: 'first_name',
  last_name: 'last_name',
  email: 'email',
  password: 'password',
  phone_number: 'phone_number',
  user_type: 'user_type',
  user_auth: 'user_auth',
  is_verified: 'is_verified',
  profile_picture: 'profile_picture',
  date_registered: 'date_registered'
};

exports.Prisma.AdminScalarFieldEnum = {
  user_id: 'user_id',
  permissions: 'permissions'
};

exports.Prisma.BusinessOwnerScalarFieldEnum = {
  user_id: 'user_id'
};

exports.Prisma.CustomerScalarFieldEnum = {
  user_id: 'user_id',
  saved_businesses: 'saved_businesses'
};

exports.Prisma.SavedBusinessScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  business_id: 'business_id',
  saved_at: 'saved_at'
};

exports.Prisma.BusinessScalarFieldEnum = {
  business_id: 'business_id',
  owner_id: 'owner_id',
  business_name: 'business_name',
  banner: 'banner',
  logo: 'logo',
  description: 'description',
  category: 'category',
  address: 'address',
  location_id: 'location_id',
  contact_number: 'contact_number',
  website_url: 'website_url',
  is_verified: 'is_verified',
  date_registered: 'date_registered'
};

exports.Prisma.CategoryScalarFieldEnum = {
  category_id: 'category_id',
  category_name: 'category_name'
};

exports.Prisma.LocationScalarFieldEnum = {
  location_id: 'location_id',
  city: 'city',
  province: 'province',
  postal_code: 'postal_code'
};

exports.Prisma.SellableScalarFieldEnum = {
  sellable_id: 'sellable_id',
  name: 'name',
  sellable_type: 'sellable_type',
  price: 'price',
  description: 'description',
  media: 'media',
  is_active: 'is_active',
  created_at: 'created_at',
  business_id: 'business_id'
};

exports.Prisma.DisputeScalarFieldEnum = {
  dispute_id: 'dispute_id',
  transaction_id: 'transaction_id',
  complainant_id: 'complainant_id',
  reason: 'reason',
  status: 'status',
  admin_response: 'admin_response',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.DisputeMessageScalarFieldEnum = {
  id: 'id',
  dispute_id: 'dispute_id',
  user_id: 'user_id',
  content: 'content',
  created_at: 'created_at'
};

exports.Prisma.ReviewScalarFieldEnum = {
  review_id: 'review_id',
  customer_id: 'customer_id',
  business_id: 'business_id',
  rating: 'rating',
  review_text: 'review_text',
  media: 'media',
  review_date: 'review_date',
  is_verified: 'is_verified'
};

exports.Prisma.TransactionScalarFieldEnum = {
  transaction_id: 'transaction_id',
  customer_id: 'customer_id',
  business_id: 'business_id',
  status: 'status',
  reason_incomplete: 'reason_incomplete',
  date_initiated: 'date_initiated',
  date_completed: 'date_completed'
};

exports.Prisma.TransactionItemScalarFieldEnum = {
  item_id: 'item_id',
  transaction_id: 'transaction_id',
  sellable_id: 'sellable_id',
  quantity: 'quantity',
  price: 'price'
};

exports.Prisma.UserVerificationScalarFieldEnum = {
  uv_id: 'uv_id',
  user_id: 'user_id',
  uv_file: 'uv_file',
  status: 'status',
  reviewed_by: 'reviewed_by',
  response_date: 'response_date',
  denial_reason: 'denial_reason'
};

exports.Prisma.BusinessVerificationScalarFieldEnum = {
  bv_id: 'bv_id',
  business_id: 'business_id',
  bv_file: 'bv_file',
  status: 'status',
  reviewed_by: 'reviewed_by',
  response_date: 'response_date',
  denial_reason: 'denial_reason'
};

exports.Prisma.ConversationParticipantScalarFieldEnum = {
  id: 'id',
  conversationId: 'conversationId',
  userId: 'userId',
  joinedAt: 'joinedAt',
  lastSeen: 'lastSeen'
};

exports.Prisma.ConversationScalarFieldEnum = {
  id: 'id',
  title: 'title',
  isGroup: 'isGroup',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MessageScalarFieldEnum = {
  message_id: 'message_id',
  content: 'content',
  timestamp: 'timestamp',
  media: 'media',
  senderId: 'senderId',
  recipientId: 'recipientId',
  conversationId: 'conversationId'
};

exports.Prisma.ReadReceiptScalarFieldEnum = {
  id: 'id',
  messageId: 'messageId',
  userId: 'userId',
  readAt: 'readAt'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  title: 'title',
  content: 'content',
  isRead: 'isRead',
  data: 'data',
  createdAt: 'createdAt',
  readAt: 'readAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};
exports.UserType = exports.$Enums.UserType = {
  ADMIN: 'ADMIN',
  BUSINESSOWNER: 'BUSINESSOWNER',
  CUSTOMER: 'CUSTOMER'
};

exports.UserAuth = exports.$Enums.UserAuth = {
  GOOGLE: 'GOOGLE',
  EMAIL: 'EMAIL'
};

exports.SellableType = exports.$Enums.SellableType = {
  PRODUCT: 'PRODUCT',
  SERVICE: 'SERVICE'
};

exports.DisputeStatus = exports.$Enums.DisputeStatus = {
  PENDING: 'PENDING',
  RESOLVED: 'RESOLVED',
  DISMISSED: 'DISMISSED'
};

exports.TransactionStatus = exports.$Enums.TransactionStatus = {
  PENDING: 'PENDING',
  INCOMPLETE: 'INCOMPLETE',
  COMPLETED: 'COMPLETED',
  FINISHED: 'FINISHED'
};

exports.VerifStatus = exports.$Enums.VerifStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  DENIED: 'DENIED'
};

exports.NotificationType = exports.$Enums.NotificationType = {
  MESSAGE: 'MESSAGE',
  TRANSACTION: 'TRANSACTION',
  DISPUTE: 'DISPUTE',
  VERIFICATION: 'VERIFICATION',
  REVIEW: 'REVIEW',
  SYSTEM: 'SYSTEM'
};

exports.Prisma.ModelName = {
  User: 'User',
  Admin: 'Admin',
  BusinessOwner: 'BusinessOwner',
  Customer: 'Customer',
  SavedBusiness: 'SavedBusiness',
  Business: 'Business',
  Category: 'Category',
  Location: 'Location',
  Sellable: 'Sellable',
  Dispute: 'Dispute',
  DisputeMessage: 'DisputeMessage',
  Review: 'Review',
  Transaction: 'Transaction',
  TransactionItem: 'TransactionItem',
  UserVerification: 'UserVerification',
  BusinessVerification: 'BusinessVerification',
  ConversationParticipant: 'ConversationParticipant',
  Conversation: 'Conversation',
  Message: 'Message',
  ReadReceipt: 'ReadReceipt',
  Notification: 'Notification'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
