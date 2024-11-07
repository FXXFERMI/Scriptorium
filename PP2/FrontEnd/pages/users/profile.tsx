import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Navbar from '../../components/Navbar';

const availableAvatars = [
    '/avatars/avatar1.png',
    '/avatars/avatar2.png',
    '/avatars/avatar3.png',
    '/avatars/avatar4.png',
    '/avatars/avatar5.png',
    '/avatars/avatar6.png',
    '/avatars/avatar7.png',
];

type ProfileType = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    avatarUrl: string;
};

const Profile = () => {
    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [showAvatarSelection, setShowAvatarSelection] = useState<boolean>(false);
    const [selectedAvatar, setSelectedAvatar] = useState<string>('');
    const [uploadedAvatar, setUploadedAvatar] = useState<string | null>(null);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [updatedFirstName, setUpdatedFirstName] = useState<string>('');
    const [updatedLastName, setUpdatedLastName] = useState<string>('');
    const [updatedPhoneNumber, setUpdatedPhoneNumber] = useState<string>('');
    const [refreshKey, setRefreshKey] = useState<number>(0);

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

    const handleProfileUpdate = async () => {
        try {
            const token = Cookies.get('accessToken');
            if (!token) {
                console.error("Access token is missing");
                return;
            }

            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/users/updateProfile`,
                {
                    firstName: updatedFirstName || profile?.firstName,
                    lastName: updatedLastName || profile?.lastName,
                    phoneNumber: updatedPhoneNumber || profile?.phoneNumber,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );

            setEditMode(false);
            setRefreshKey((prev) => prev + 1);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };


    // console.log("Show me the one on website now:", profile);

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
                ...prevProfile!,
                avatar: `${process.env.NEXT_PUBLIC_API_URL}/avatars/${avatarFilename}?t=${new Date().getTime()}`,
            }));

            setShowAvatarSelection(false);
            setRefreshKey((prev) => prev + 1);
        } catch (error) {
            console.error("Error updating avatar:", error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedAvatar(URL.createObjectURL(file));
        }
    };

    const handleFileUpload = async () => {
        const token = Cookies.get('accessToken');
        if (!token) {
            console.error("Access token is missing");
            return;
        }

        const fileInput = document.getElementById('avatarUpload') as HTMLInputElement;
        if (!fileInput.files || fileInput.files.length === 0) {
            console.error("No file selected");
            return;
        }

        const formData = new FormData();
        formData.append('profilePhoto', fileInput.files[0]);

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

            // console.log("print profile last", profile);

            setProfile((prevProfile) => ({
                ...prevProfile!,
                avatar: `${process.env.NEXT_PUBLIC_API_URL}${response.data.profilePhoto}?t=${new Date().getTime()}`,
            }));
            setUploadedAvatar(null);
            setShowAvatarSelection(false);
            setRefreshKey((prev) => prev + 1);
        } catch (error) {
            console.error("Error uploading avatar:", error);
        }
    };

    if (!profile) return <p>Loading...</p>;

    return (
        <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-md" >
            <Navbar />
            <h1 className="text-2xl font-bold mb-4 text-center" > {profile.firstName} {profile.lastName} </h1>
            < div className="flex flex-col items-center mb-6" >
                {/* <img src={profile.avatar} alt="Avatar" width={100} height={100} key={profile.avatar} /> */}
                < img src={profile.avatarUrl} alt="Avatar" width={100} height={100} key={profile.avatarUrl} className="w-24 h-24 rounded-full mb-4" />
                <p className="text-lg" > Email: {profile.email} </p>
                < p className="text-lg" > Phone: {profile.phoneNumber} </p>
            </div>

            < div className="flex justify-center gap-4 mb-6" >
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setEditMode(true)}> Edit Profile </button>
                < button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setShowAvatarSelection(true)}> Change Avatar </button>
            </div>

            {
                editMode && (
                    <div className="mt-6 p-4 border rounded-md bg-gray-50" >
                        <h2 className="text-xl font-semibold mb-4" > Edit Profile Information </h2>
                        < div className="flex flex-col gap-4" >
                            <input
                                type="text"
                                placeholder="First Name"
                                defaultValue={profile.firstName}
                                onChange={(e) => setUpdatedFirstName(e.target.value)
                                }
                                className="p-2 border rounded-md"
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                defaultValue={profile.lastName}
                                onChange={(e) => setUpdatedLastName(e.target.value)}
                                className="p-2 border rounded-md"
                            />
                            <input
                                type="text"
                                placeholder="Phone Number"
                                defaultValue={profile.phoneNumber}
                                onChange={(e) => setUpdatedPhoneNumber(e.target.value)}
                                className="p-2 border rounded-md"
                            />
                        </div>
                        < div className="flex gap-4 mt-4" >
                            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleProfileUpdate} > Save Changes </button>
                            < button className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400" onClick={() => setEditMode(false)}> Cancel </button>
                        </div>
                    </div>
                )}


            {
                showAvatarSelection && (
                    <div className="mt-6 p-4 border rounded-md bg-gray-50" >
                        <h2 className="text-xl font-semibold mb-4" > Select an Avatar </h2>
                        < div className="flex flex-wrap gap-4 justify-center mb-4" >
                            {
                                availableAvatars.map((avatar) => (
                                    <img
                                        key={avatar}
                                        src={avatar}
                                        alt="Available Avatar"
                                        className={`w-20 h-20 rounded-full cursor-pointer ${avatar === selectedAvatar ? 'ring-4 ring-blue-500' : 'ring-2 ring-transparent'}`}
                                        onClick={() => setSelectedAvatar(avatar)
                                        }
                                    />
                                ))}
                        </div>

                        < div className="flex gap-4" >
                            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleAvatarUpdate} disabled={!selectedAvatar}> Save Selected Avatar </button>
                            < button className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400" onClick={() => setShowAvatarSelection(false)}> Cancel </button>
                        </div>

                        < div className="mt-4" >
                            <input
                                type="file"
                                id="avatarUpload"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="mb-2"
                            />
                            {uploadedAvatar && (
                                <img src={uploadedAvatar} alt="Uploaded Avatar Preview" className="w-20 h-20 rounded-full mb-2" />
                            )}
                            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={handleFileUpload} > Upload and Save </button>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default Profile;