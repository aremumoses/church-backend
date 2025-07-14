import ChurchInfo from '../models/churchInfoModel';

export const getChurchInfo = async () => {
  const info = await ChurchInfo.findOne();
  return info;
};

export const updateChurchInfo = async (data: {
  history?: string;
  mission?: string;
  vision?: string;
  doctrines?: string;
  leadership?: string;
}) => {
  let info = await ChurchInfo.findOne();

  if (!info) {
    // Create new record if none exists
    info = new ChurchInfo(data);
  } else {
    // Update existing record
    Object.assign(info, data);
  }

  return await info.save();
};
