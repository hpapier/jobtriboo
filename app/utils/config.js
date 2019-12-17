export const serverURL = process.env.ENV === 'dev' ? process.env.API_URL_DEV : process.env.API_URL_PROD;
export const socketURL = process.env.ENV === 'dev' ? process.env.SOCKET_URL_DEV : process.env.SOCKET_URL_PROD;
export const serverFileURL = process.env.ENV === 'dev' ? process.env.API_FILE_URL_DEV : process.env.API_FILE_URL_PROD;
export const stripeKey = process.env.ENV === 'dev' ? process.env.STRIPE_API_KEY_DEV : process.env.STRIPE_API_KEY_PROD;