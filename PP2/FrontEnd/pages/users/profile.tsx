import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Header from '../../components/Header';
import Head from "next/head";
// import Footer from "../../components/Footer";
import { NextSeo } from "next-seo";
import api from '../../utils/axiosInstance';

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
                const response = await api.get('/api/users/showProfile');

                setProfile(response.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchProfile();
    }, [refreshKey]);

    const handleProfileUpdate = async () => {
        try {
            // const token = Cookies.get('accessToken');
            // if (!token) {
            //     console.error("Access token is missing");
            //     return;
            // }

            // await axios.put(
            // `${process.env.NEXT_PUBLIC_API_URL}/api/users/updateProfile`,
            await api.put(
                '/api/users/updateProfile',
                {
                    firstName: updatedFirstName || profile?.firstName,
                    lastName: updatedLastName || profile?.lastName,
                    phoneNumber: updatedPhoneNumber || profile?.phoneNumber,
                    // },
                    // {
                    //     headers: {
                    //         Authorization: `Bearer ${token}`,
                    //         'Content-Type': 'application/json',
                    //     },
                    //     withCredentials: true,
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
            // const token = Cookies.get('accessToken');
            // if (!token) {
            //     console.error("Access token is missing");
            //     return;
            // }

            const avatarFilename = selectedAvatar.split('/').pop();
            await api.put(
                '/api/users/updateAvatar',
                { avatar: avatarFilename }
                // await axios.put(
                //     `${process.env.NEXT_PUBLIC_API_URL}/api/users/updateAvatar`,
                //     { avatar: avatarFilename },
                //     {
                //         headers: {
                //             Authorization: `Bearer ${token}`,
                //             'Content-Type': 'application/json',
                //         },
                //         withCredentials: true,
                //     }
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
        // const token = Cookies.get('accessToken');
        // if (!token) {
        //     console.error("Access token is missing");
        //     return;
        // }

        const fileInput = document.getElementById('avatarUpload') as HTMLInputElement;
        if (!fileInput.files || fileInput.files.length === 0) {
            console.error("No file selected");
            return;
        }

        const formData = new FormData();
        formData.append('profilePhoto', fileInput.files[0]);

        try {
            // const response = await axios.post(
            //     `${process.env.NEXT_PUBLIC_API_URL}/api/users/updateProfilePhoto`,
            const response = await api.post(
                '/api/users/updateProfilePhoto',
                formData, {
                headers: {
                    // Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                // withCredentials: true,
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

    if (!profile) return <p className="text-center text-gray-300">Loading...</p>;

    return (
        <div className="text-black bg-black">
            <NextSeo
                title="About Us: SFJ Scriptorium"
                description="Learn more about SFJ Scriptorium: the new way of writing code."
                canonical={`${process.env.NEXT_PUBLIC_BASE_URL}/users/profile`}
                openGraph={{
                    url: `${process.env.NEXT_PUBLIC_BASE_URL}/users/profile`,
                }}
            />
            <Head>
                <title>Profile - SFJ Scriptorium</title>
                <link rel="icon" href="/favicon.png" />
            </Head>
            {/* <Header /> */}
            <section className="text-gray-600 body-font">

                <div className="max-w-5xl pt-52 pb-24 mx-auto">
                    <h1 className="text-4xl font-bold text-center mb-6" >
                        {profile.firstName} {profile.lastName}
                    </h1>
                    {/* < div className="flex flex-col items-center mb-6" >
                    < img src={profile.avatarUrl} alt="Avatar" width={100} height={100} key={profile.avatarUrl} className="w-24 h-24 rounded-full mb-4" />
                    <p className="text-lg" > Email: {profile.email} </p>
                    < p className="text-lg" > Phone: {profile.phoneNumber} </p>
                </div> */}
                    <div className="flex flex-col items-center mb-6">
                        <img
                            src={profile.avatarUrl}
                            alt="Avatar"
                            className="w-24 h-24 rounded-full mb-4 border shadow-md"
                        />
                        <p className="text-lg mb-2">Email: {profile.email}</p>
                        <p className="text-lg">Phone: {profile.phoneNumber}</p>
                    </div>

                    {/* < div className="flex justify-center gap-4 mb-6" >
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setEditMode(true)}> Edit Profile </button>
                    < button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setShowAvatarSelection(true)}> Change Avatar </button>
                </div> */}

                    <div className="flex justify-center gap-4 mb-6">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={() => setEditMode(true)}
                        >
                            Edit Profile
                        </button>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={() => setShowAvatarSelection(true)}
                        >
                            Change Avatar
                        </button>
                    </div>

                    {
                        editMode && (
                            <div className="p-6 bg-gray-800 rounded-lg shadow-md mb-6" >
                                <h2 className="text-2xl font-semibold mb-4" > Edit Profile Information </h2>
                                < div className="space-y-4" >
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        defaultValue={profile.firstName}
                                        onChange={(e) => setUpdatedFirstName(e.target.value)}
                                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-300"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        defaultValue={profile.lastName}
                                        onChange={(e) => setUpdatedLastName(e.target.value)}
                                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-300"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Phone Number"
                                        defaultValue={profile.phoneNumber}
                                        onChange={(e) => setUpdatedPhoneNumber(e.target.value)}
                                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-300"
                                    />
                                </div>
                                {/* < div className="flex gap-4 mt-4" >
                                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleProfileUpdate} > Save Changes </button>
                                < button className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400" onClick={() => setEditMode(false)}> Cancel </button>
                            </div> */}
                                <div className="flex justify-end mt-4 gap-4">
                                    <button
                                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                        onClick={handleProfileUpdate}
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        className="bg-gray-600 text-gray-300 px-4 py-2 rounded hover:bg-gray-500"
                                        onClick={() => setEditMode(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}


                    {
                        showAvatarSelection && (
                            <div className="p-6 bg-gray-800 rounded-lg shadow-md" >
                                <h2 className="text-2xl font-semibold mb-4" > Select an Avatar </h2>
                                < div className="flex flex-wrap gap-4 justify-center" >
                                    {
                                        availableAvatars.map((avatar) => (
                                            <img
                                                key={avatar}
                                                src={avatar}
                                                alt="Available Avatar"
                                                className={`w-16 h-16 rounded-full cursor-pointer border-2 ${avatar === selectedAvatar ? 'border-blue-500' : 'border-transparent'}`}
                                                onClick={() => setSelectedAvatar(avatar)
                                                }
                                            />
                                        ))}
                                </div>

                                < div className="mt-4 flex justify-end gap-4" >
                                    {/* <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleAvatarUpdate} disabled={!selectedAvatar}> Save Selected Avatar </button>
                                < button className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400" onClick={() => setShowAvatarSelection(false)}> Cancel </button> */}
                                    <button
                                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                        onClick={handleAvatarUpdate}
                                        disabled={!selectedAvatar}
                                    >
                                        Save Selected Avatar
                                    </button>
                                    <button
                                        className="bg-gray-600 text-gray-300 px-4 py-2 rounded hover:bg-gray-500"
                                        onClick={() => setShowAvatarSelection(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>

                                < div className="mt-6" >
                                    <input
                                        type="file"
                                        id="avatarUpload"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="text-gray-300"
                                    />
                                    {uploadedAvatar && (
                                        <img src={uploadedAvatar} alt="Uploaded Avatar Preview" className="w-16 h-16 rounded-full mt-4" />
                                    )}
                                    {/* <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={handleFileUpload} > Upload and Save </button> */}
                                    <button
                                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        onClick={handleFileUpload}
                                    >
                                        Upload and Save
                                    </button>
                                </div>
                            </div>
                        )}
                </div>
                {/* <Footer /> */}

            </section >
        </div>
    );
};

export default Profile;