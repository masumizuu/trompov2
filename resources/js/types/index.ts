// resources/js/types/index.ts
export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  user_type: UserType;
  user_auth: UserAuth;
  is_verified: boolean;
  profile_picture?: string;
  date_registered: string;
}

export enum UserType {
  ADMIN = 'ADMIN',
  BUSINESSOWNER = 'BUSINESSOWNER',
  CUSTOMER = 'CUSTOMER'
}

export enum UserAuth {
  GOOGLE = 'GOOGLE',
  EMAIL = 'EMAIL'
}

export interface Admin {
  user_id: string;
  permissions?: string;
  user: User;
}

export interface BusinessOwner {
  user_id: string;
  businesses: Business[];
  user: User;
}

export interface Customer {
  user_id: string;
  saved_businesses?: any;
  user: User;
  disputes: Dispute[];
  reviews: Review[];
  transactions: Transaction[];
}

// Business Types
export interface Business {
  business_id: string;
  owner_id: string;
  business_name: string;
  banner?: string;
  logo?: string;
  description?: string;
  category?: string;
  address?: string;
  location_id?: string;
  contact_number?: string;
  website_url?: string;
  is_verified: boolean;
  date_registered: string;
  owner: BusinessOwner;
  categoryRef?: Category;
  location?: Location;
  sellables: Sellable[];
}

export interface Category {
  category_id: string;
  category_name: string;
  businesses: Business[];
}

export interface Location {
  location_id: string;
  city: string;
  province: string;
  postal_code: string;
  businesses: Business[];
}

export interface Sellable {
  sellable_id: string;
  name: string;
  sellable_type: SellableType;
  price: number;
  description?: string;
  media: string[];
  is_active: boolean;
  created_at: string;
  business_id: string;
  business: Business;
}

export enum SellableType {
  PRODUCT = 'PRODUCT',
  SERVICE = 'SERVICE'
}

// Transaction Types
export interface Transaction {
  transaction_id: string;
  customer_id: string;
  business_id: string;
  status: TransactionStatus;
  reason_incomplete?: string;
  date_initiated: string;
  date_completed?: string;
  customer: Customer;
  business: Business;
  items: TransactionItem[];
  dispute?: Dispute;
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  INCOMPLETE = 'INCOMPLETE',
  COMPLETED = 'COMPLETED',
  FINISHED = 'FINISHED'
}

export interface TransactionItem {
  item_id: string;
  transaction_id: string;
  sellable_id: string;
  quantity: number;
  price: number;
  sellable: Sellable;
  transaction: Transaction;
}

// Dispute Types
export interface Dispute {
  dispute_id: string;
  transaction_id?: string;
  complainant_id?: string;
  reason: string;
  status: DisputeStatus;
  admin_response?: string;
  created_at: string;
  updated_at: string;
  transaction?: Transaction;
  complainant?: Customer;
  messages: DisputeMessage[];
}

export enum DisputeStatus {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED'
}

export interface DisputeMessage {
  id: string;
  dispute_id: string;
  user_id: string;
  content: string;
  created_at: string;
  dispute: Dispute;
}

// Review Types
export interface Review {
  review_id: string;
  customer_id: string;
  business_id: string;
  rating: number;
  review_text?: string;
  media?: string[];
  review_date: string;
  is_verified: boolean;
  customer: Customer;
  business: Business;
}

// Message Types
export interface Conversation {
  id: string;
  participants: ConversationParticipant[];
  messages: Message[];
  title?: string;
  isGroup: boolean;
  createdAt: string;
  updatedAt: string;
  unread_count?: number;
}

export interface ConversationParticipant {
  id: string;
  conversationId: string;
  userId: string;
  joinedAt: string;
  lastSeen: string;
  user: User;
  conversation: Conversation;
}

export interface Message {
  message_id: string;
  content: string;
  timestamp: string;
  media?: any;
  senderId: string;
  recipientId?: string;
  sender: User;
  recipient?: User;
  conversationId: string;
  conversation: Conversation;
  readBy: ReadReceipt[];
}

export interface ReadReceipt {
  id: string;
  messageId: string;
  userId: string;
  readAt: string;
  user: User;
  message: Message;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  content: string;
  isRead: boolean;
  data?: any;
  createdAt: string;
  readAt?: string;
  user: User;
}

export enum NotificationType {
  MESSAGE = 'MESSAGE',
  TRANSACTION = 'TRANSACTION',
  DISPUTE = 'DISPUTE',
  VERIFICATION = 'VERIFICATION',
  REVIEW = 'REVIEW',
  SYSTEM = 'SYSTEM'
}

// Verification Types
export interface UserVerification {
  uv_id: string;
  user_id: string;
  uv_file: string;
  status: VerifStatus;
  reviewed_by: string;
  response_date: string;
  denial_reason?: string;
  user: User;
  reviewer: Admin;
}

export interface BusinessVerification {
  bv_id: string;
  business_id: string;
  bv_file: string;
  status: VerifStatus;
  reviewed_by: string;
  response_date: string;
  denial_reason?: string;
  business: Business;
  reviewer: Admin;
}

export enum VerifStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DENIED = 'DENIED'
}

// Additional types for frontend
export interface PageProps {
  auth: {
    user: User;
  };
  route: (name: string, params?: Record<string, any>, absolute?: boolean) => string;
}

// Pagination type
export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
}

// Type for Ziggy route function
export type RouteFunction = {
  (name: string, params?: Record<string, any>, absolute?: boolean): string;
  current: (name?: string) => boolean;
  has: (name: string) => boolean;
};