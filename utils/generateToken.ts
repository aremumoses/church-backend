 
import jwt from 'jsonwebtoken';

export const generateToken = (id: string, role: string, name: string,email:string): string => {
  return jwt.sign({ id, role, name,email }, process.env.JWT_SECRET!, {
    expiresIn: '30d',
  });
};
