import ChurchInfo from '../models/churchInfoModel';

// Get church information
export const getChurchInfo = async () => {
  return await ChurchInfo.findOne();
};

// Create church information (if not exists)
export const createChurchInfo = async (data: {
  history: string;
  mission: string;
  vision: string;
  doctrines?: string;
  leadership?: string;
}) => {
  // Ensure only one record exists
  const existingInfo = await ChurchInfo.findOne();
  if (existingInfo) {
    throw new Error('Church information already exists. Use update instead.');
  }

  const info = new ChurchInfo(data);
  return await info.save();
};

// Update church information
export const updateChurchInfo = async (data: {
  history?: string;
  mission?: string;
  vision?: string;
  doctrines: { type: [String], required: true };
  leadership?: string;
}) => {
  let info = await ChurchInfo.findOne();

  if (!info) {
    throw new Error('No church info found. Create it first.');
  }

  Object.assign(info, data);
  return await info.save();
};
