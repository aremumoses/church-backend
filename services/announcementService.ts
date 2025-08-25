import Announcement from "../models/announcementsModel";

export const createAnnouncement = async (
  title: string,
  content: string,
  createdBy: string
) => {
  const announcement = new Announcement({ title, content, createdBy });
  return await announcement.save();
};

export const getAllActiveAnnouncements = async () => {
  return await Announcement.find({ status: 'active' }).sort({ created_at: -1 });
};

export const updateAnnouncement = async (
  id: string,
  title: string,
  content: string
) => {
  return await Announcement.findByIdAndUpdate(id, { title, content });
};

export const deleteAnnouncement = async (id: string) => {
  return await Announcement.findByIdAndDelete(id);
};
