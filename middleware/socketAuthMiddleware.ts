// import { Socket } from 'socket.io';
// import jwt from 'jsonwebtoken';

// export const protectSocket = (socket: Socket, next: (err?: Error) => void) => {
//   const token = socket.handshake.auth.token;
//   if (!token) return next(new Error('Authentication token missing'));

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!);
//     socket.data.userId = (decoded as any).id;
//     socket.data.role = (decoded as any).role;
//     socket.data.name = (decoded as any).name; // Assuming name is also part of
//     next();
//   } catch (err) {
//     next(new Error('Invalid token'));
//   }
// };

import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: number;
  name: string;
  role: string;
  iat: number;
  exp: number;
}

export const protectSocket = (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Authentication token missing'));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    socket.data.userId = decoded.id;
    socket.data.name = decoded.name; // ✅ this MUST be here
    socket.data.role = decoded.role;
    next();
  } catch (error) {
    return next(new Error('Invalid token'));
  }
};

