import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const availableAvatars = [
    '/avatars/avatar1.png',
    '/avatars/avatar2.png',
    '/avatars/avatar3.png',
    '/avatars/avatar4.png',
    '/avatars/avatar5.png',
    '/avatars/avatar6.png',
    '/avatars/avatar7.png',
];

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [showAvatarSelection, setShowAvatarSelection] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState('');
    const [uploadedAvatar, setUploadedAvatar] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = Cookies.get('accessToken');
                if (!token) {
                    console.error("Access token is missing");
                    return;
                }

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/users/showProfile`,
                    { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
                );

                setProfile(response.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchProfile();
    }, [refreshKey]);

    const handleAvatarUpdate = async () => {
        try {
            const token = Cookies.get('accessToken');
            if (!token) {
                console.error("Access token is missing");
                return;
            }

            const avatarFilename = selectedAvatar.split('/').pop();

            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/users/updateAvatar`,
                { avatar: avatarFilename },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );

            setProfile((prevProfile) => ({
                ...prevProfile,
                avatar: `${process.env.NEXT_PUBLIC_API_URL}/avatars/${avatarFilename}?t=${new Date().getTime()}`,
            }));

            setShowAvatarSelection(false);
            setRefreshKey((prev) => prev + 1);
        } catch (error) {
            console.error("Error updating avatar:", error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setUploadedAvatar(URL.createObjectURL(file));
    };

    const handleFileUpload = async () => {
        const token = Cookies.get('accessToken');
        if (!token) {
            console.error("Access token is missing");
            return;
        }

        const formData = new FormData();
        formData.append('profilePhoto', document.getElementById('avatarUpload').files[0]);

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/users/updateProfilePhoto`,
                formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            }
            );

            console.log("print profile", profile);

            setProfile((prevProfile) => ({
                ...prevProfile,
                avatar: `${process.env.NEXT_PUBLIC_API_URL}/uploads/${response.data.profilePhoto}?t=${new Date().getTime()}`,
            }));
            setUploadedAvatar(null);
            setShowAvatarSelection(false);
        } catch (error) {
            console.error("Error uploading avatar:", error);
        }
    };

    if (!profile) return <p>Loading...</p>;

    return (
        <div>
            <h1>{profile.firstName} {profile.lastName}</h1>
            {/* <img src={profile.avatar} alt="Avatar" width={100} height={100} key={profile.avatar} /> */}
            <img src={profile.avatar} alt="Avatar" width={100} height={100} key={profile.avatar} />
            <p>Email: {profile.email}</p>
            <p>Phone: {profile.phoneNumber}</p>

            <button onClick={() => setShowAvatarSelection(true)}>
                Change Avatar
            </button>

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

                    <button onClick={handleAvatarUpdate} disabled={!selectedAvatar}>
                        Save Selected Avatar
                    </button>

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

                    <button onClick={() => setShowAvatarSelection(false)} style={{ marginLeft: 10 }}>
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default Profile;
