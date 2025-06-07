import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import model from '../../assets/bgsignin.jpg';
import { FaUser } from 'react-icons/fa';
import { UserAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';

const Postsignup = () => {
  const { session } = UserAuth();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Session data:", session);
  }, [session]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("File too large. Max size is 1MB.");
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFinaliseProfile = async () => {
    if (!selectedFile) {
      alert("Please select a profile picture first.");
      return;
    }

    const fileExt = selectedFile.name.split('.').pop();
    const fileName = `${session.user.id}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    setUploading(true);

    try {
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, selectedFile, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      // Update empphoto in employers table
      const { error: updateError } = await supabase
        .from('employers')
        .update({ empphoto: publicUrl })
        .eq('empid', session.user.id);

      if (updateError) throw updateError;

      navigate('/organiser/');
    } catch (error) {
      console.error("Upload error:", error.message);
      alert("Upload failed.");
      console.error("Upload error:", error);

    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="relative min-h-screen bg-center bg-cover flex justify-center items-center" style={{ backgroundImage: `url(${model})` }}>
        <div className="absolute inset-0 bg-[#ecf1f4]/70"></div>
        <div className="flex items-center justify-center w-full max-w-5xl md:px-4 px-20 md:py-0 py-10">
          <div className="w-full md:w-[300px] rounded-md shadow-lg h-auto bg-white flex justify-center items-center flex-col px-4 py-6 z-10 text-center">
            <h1 className="text-[#373354] font-semibold mb-6 text-lg">Upload Profile Picture</h1>

            <div className="h-32 w-32 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-6xl mb-4 overflow-hidden">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <FaUser />
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current.click()}
              className="w-[60%] rounded-sm bg-[#56bb7c] py-3 text-sm font-medium text-white hover:bg-[#3E9B61] duration-200"
            >
              Upload New Photo
            </button>

            <div className="w-[90%] h-auto bg-[#80D7FF]/30 border-[#00AFFF]/30 border-4 text-xs px-2 py-2 mt-4 text-[#545859] rounded-sm">
              <p>Upload a new avatar. Larger images will be resized immediately.</p>
              <p className="mt-2">Maximum upload size is <span className="font-medium">1MB</span></p>
            </div>

            <button
              type="button"
              disabled={uploading}
              onClick={handleFinaliseProfile}
              className="w-full rounded-md bg-[#373354] py-3 mt-4 text-white font-medium hover:bg-[#292542] transition duration-200 flex items-center justify-center"
            >
              {uploading ? (
                <div className="flex items-center gap-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </div>
              ) : "Finalise Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Postsignup;
