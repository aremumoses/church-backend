import axios from 'axios';

// const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_SECRET = "sk_test_d58c9844d1edd360dc61d44af4efd0a874baa4c9"
export const initializePayment = async (email: string, amount: number) => {
  console.log("Paystack Secret:", PAYSTACK_SECRET);

  const response = await axios.post(
    'https://api.paystack.co/transaction/initialize',
    {
      email,
      amount: amount * 100  
    },
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data;
};

export const verifyPayment = async (reference: string) => {
  const response = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`
      }
    }
  );

  return response.data;
};
