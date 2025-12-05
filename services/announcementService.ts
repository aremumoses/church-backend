import Announcement from "../models/announcementsModel";

export const createAnnouncement = async (
  title: string,
  content: string,
  createdBy: string,
  image?: string
) => {
  const announcement = new Announcement({ title, content, image, createdBy });
  return await announcement.save();
};

export const getAllActiveAnnouncements = async () => {
  return await Announcement.find({ status: 'active' })
    .populate('createdBy', 'name email')
    .sort({ created_at: -1 });
};

export const updateAnnouncement = async (
  id: string,
  title: string,
  content: string,
  image?: string
) => {
  const updateData: any = { title, content };
  if (image !== undefined) {
    updateData.image = image;
  }
  return await Announcement.findByIdAndUpdate(id, updateData);
};

export const deleteAnnouncement = async (id: string) => {
  return await Announcement.findByIdAndDelete(id);
};
