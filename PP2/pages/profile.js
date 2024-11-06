// THIS CODE IS BASED ON CHAT GPT AND NOT OUR ORIGINAL THOUGHTS 

import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie to read cookies

const availableAvatars = [
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  '/avatars/avatar4.png',
  '/avatars/avatar5.png',
  '/avatars/avatar6.png',
  '/avatars/avatar7.png',
]; // List of avatar paths

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [showAvatarSelection, setShowAvatarSelection] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [uploadedAvatar, setUploadedAvatar] = useState(null); // For uploaded avatar preview

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get('accessToken'); // Get token from cookies
        // console.log("Retrieved token:", token);
        if (!token) {
          console.error("Access token is missing");
          return;
        }

        const response = await axios.get('/api/users/showProfile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleAvatarUpdate = async () => {
    try {
      const token = Cookies.get('accessToken'); // Get token from cookies
      if (!token) {
        console.error("Access token is missing");
        return;
      }

      await axios.put(
        '/api/users/updateProfilePhoto',
        { avatar: selectedAvatar },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProfile((prevProfile) => ({
        ...prevProfile,
        avatar: selectedAvatar,
      }));

      setShowAvatarSelection(false); // Close avatar selection after updating
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadedAvatar(URL.createObjectURL(file)); // Preview selected file
  };

  const handleFileUpload = async () => {
    const token = Cookies.get('accessToken');
    if (!token) {
      console.error("Access token is missing");
      return;
    }

    const formData = new FormData();
    formData.append('avatar', document.getElementById('avatarUpload').files[0]);

    try {
      const response = await axios.post('/api/users/uploadAvatar', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfile((prevProfile) => ({
        ...prevProfile,
        avatar: response.data.avatar,
      }));
      setUploadedAvatar(null); // Clear preview after upload
      setShowAvatarSelection(false); // Close modal after upload
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h1>{profile.firstName} {profile.lastName}</h1>
      <img src={profile.avatar} alt="Avatar" width={100} height={100} />
      <p>Email: {profile.email}</p>
      <p>Phone: {profile.phoneNumber}</p>

      {/* Button to show avatar selection */}
      <button onClick={() => setShowAvatarSelection(true)}>
        Change Avatar
      </button>

      {/* Avatar selection modal */}
      {showAvatarSelection && (
        <div style={{ marginTop: 20 }}>
          <h2>Select an Avatar</h2>
          <div style={{ display: 'flex', gap: 10 }}>
            {availableAvatars.map((avatar) => (
              <img
                key={avatar}
                src={avatar}
                alt="Available Avatar"
                width={80}
                height={80}
                style={{
                  border: avatar === selectedAvatar ? '2px solid blue' : '2px solid transparent',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedAvatar(avatar)}
              />
            ))}
          </div>

          {/* File upload for custom avatar */}
          <div style={{ marginTop: 20 }}>
            <input
              type="file"
              id="avatarUpload"
              accept="image/*"
              onChange={handleFileChange}
            />
            {uploadedAvatar && (
              <img src={uploadedAvatar} alt="Uploaded Avatar Preview" width={80} height={80} />
            )}
            <button onClick={handleFileUpload}>Upload and Save</button>
          </div>

          <button onClick={handleAvatarUpdate} disabled={!selectedAvatar}>
            Save Selected Avatar
          </button>
          <button onClick={() => setShowAvatarSelection(false)} style={{ marginLeft: 10 }}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
