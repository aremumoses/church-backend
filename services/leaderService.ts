import { Leader } from '../models/Leader';

// Mock database - replace with your actual database implementation
let leaders: Leader[] = [];

export const getAllLeaders = async (): Promise<Leader[]> => {
  return leaders;
};

export const getLeaderById = async (id: string): Promise<Leader | null> => {
  return leaders.find(leader => leader.id === id) || null;
};

export const createLeader = async (
  name: string,
  role: string,
  image: string,
  bio: string
): Promise<Leader> => {
  const newLeader: Leader = {
    id: Date.now().toString(), // Replace with proper ID generation
    name,
    role,
    image,
    bio
  };
  
  leaders.push(newLeader);
  return newLeader;
};

export const updateLeader = async (
  id: string,
  name: string,
  role: string,
  image: string,
  bio: string
): Promise<Leader | null> => {
  const leaderIndex = leaders.findIndex(leader => leader.id === id);
  
  if (leaderIndex === -1) {
    return null;
  }
  
  leaders[leaderIndex] = {
    id,
    name,
    role,
    image,
    bio
  };
  
  return leaders[leaderIndex];
};

export const deleteLeader = async (id: string): Promise<boolean> => {
  const leaderIndex = leaders.findIndex(leader => leader.id === id);
  
  if (leaderIndex === -1) {
    return false;
  }
  
  leaders.splice(leaderIndex, 1);
  return true;
};
