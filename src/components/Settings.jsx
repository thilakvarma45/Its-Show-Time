import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Camera, Save, ArrowLeft } from 'lucide-react';
import { getInitials } from '../utils/formatters';
import { toast } from 'react-toastify';

const Settings = ({ user, onBack, onSave }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    profileImageUrl: user?.profileImageUrl || '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setIsEditing(true);
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      setProfileImageFile(file);
      setIsEditing(true);
    }
  };

  const uploadProfileImage = async () => {
    if (!profileImageFile || !user?.id) return null;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', profileImageFile);

      const response = await fetch(`http://localhost:8080/api/upload/profile/${user.id}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return `http://localhost:8080${data.imageUrl}`;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload profile image');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let updatedData = { ...formData };

    // Upload profile image if selected
    if (profileImageFile) {
      const imageUrl = await uploadProfileImage();
      if (imageUrl) {
        updatedData.profileImageUrl = imageUrl;
      }
    }

    // Update user profile via API
    try {
      const response = await fetch(`http://localhost:8080/api/auth/user/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      onSave(updatedUser);
      setFormData({
        ...updatedData,
        profileImageUrl: updatedUser.profileImageUrl || updatedData.profileImageUrl,
      });
      setIsEditing(false);
      setProfileImageFile(null);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 px-4 sm:px-8 py-8 sm:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mb-8"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
          Account Settings
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Manage your profile and preferences
        </p>
      </motion.div>

      {/* Settings Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Profile Picture Section */}
        <div className="relative h-32 bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 border-b border-slate-200">
          <div className="absolute -bottom-16 left-8">
            <div className="relative group">
              {formData.profileImageUrl || profileImageFile ? (
                <img
                  src={profileImageFile ? URL.createObjectURL(profileImageFile) : formData.profileImageUrl}
                  alt={formData.name}
                  className="w-32 h-32 rounded-full object-cover shadow-xl border-4 border-white"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white">
                  {getInitials(formData.name)}
                </div>
              )}
              <label className="absolute bottom-2 right-2 w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center shadow-lg hover:bg-violet-700 transition-colors cursor-pointer">
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 sm:px-8 pt-20 pb-8">
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </div>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </div>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </div>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </div>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                placeholder="City, Country"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              type="submit"
              disabled={!isEditing || uploadingImage}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                isEditing && !uploadingImage
                  ? 'bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg shadow-violet-500/30'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Save className="w-5 h-5" />
              {uploadingImage ? 'Uploading...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Additional Settings Sections */}
        <div className="px-6 sm:px-8 pb-8 space-y-4">
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Preferences</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors border border-slate-200">
                <span className="text-sm font-medium text-slate-700">Email Notifications</span>
                <input type="checkbox" className="w-5 h-5 rounded accent-violet-500" defaultChecked />
              </label>
              <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors border border-slate-200">
                <span className="text-sm font-medium text-slate-700">Show Booking History</span>
                <input type="checkbox" className="w-5 h-5 rounded accent-violet-500" defaultChecked />
              </label>
              <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors border border-slate-200">
                <span className="text-sm font-medium text-slate-700">Marketing Emails</span>
                <input type="checkbox" className="w-5 h-5 rounded accent-violet-500" />
              </label>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
