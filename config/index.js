import dotenv from 'dotenv';
dotenv.config();
export const {PORT,DB_URL,DEBUG_MODE,JWT_SECRET,REFRESH_JWT_SECRET,HASH_SECRET,EMAIL,PASSWORD,PAYMENT_API_KEY,PAYMENT_API_SECRET}= process.env;
