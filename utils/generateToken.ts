 
// import jwt from 'jsonwebtoken';

// export const generateToken = (id: string, role: string,name:string) => {
//   return jwt.sign({ id, role,name }, process.env.JWT_SECRET as string, {
//     expiresIn: '30d',
//   });
// };

import jwt from 'jsonwebtoken';

export const generateToken = (id: string, role: string, name: string): string => {
  return jwt.sign({ id, role, name }, process.env.JWT_SECRET!, {
    expiresIn: '30d',
  });
};
