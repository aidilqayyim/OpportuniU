import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import model from '../../assets/bgsignin.jpg'
import { FaUser, FaGraduationCap, FaBook, FaPen } from 'react-icons/fa';
import { UserAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';

const Postsignup = () => {
  const { session } = UserAuth();
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [faculty, setFaculty] = useState('');
  const [course, setCourse] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Session data:", session); // Log session data to ensure it's correct
  }, [session]);

  // List of faculties for dropdown
  const faculties = [
    "Select your Faculty",
    "Faculty of Agriculture", 
    "Faculty of Engineering", 
    "Faculty of Educational Studies", 
    "Faculty of Science", 
    "Faculty of Food Science and Technology", 
    "Faculty of Human Ecology", 
    "Faculty of Modern Languages and Communication", 
    "Faculty of Design and Architecture", 
    "Faculty of Medicine and Health Sciences", 
    "Faculty of Computer Science and Information Technology", 
    "Faculty of Biotechnology and Biomolecular Sciences"
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 1024 * 1024) { // 1MB limit
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert("File size exceeds 1MB limit.");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
  
    try {
      let photoUrl = null;
  
      // Upload profile image ONLY if one is selected
      if (profileImage) {
        const fileExt = profileImage.name.split('.').pop();
        const fileName = `${session.user.id}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;
  
        let { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, profileImage);
  
        if (uploadError) {
          console.error("Upload Error:", uploadError.message);
          throw uploadError;
        }
  
        const { data: { publicUrl } } = supabase
          .storage
          .from('avatars')
          .getPublicUrl(filePath);
  
        photoUrl = publicUrl;
      }
  
      // Call stored procedure with correct param names
      const { error } = await supabase.rpc("insert_userdetails", {
        in_userdesc: description,
        in_userfaculty: faculty,
        in_usercourse: course,
        in_userphoto: photoUrl // can be null if no image selected
      });
  
      if (error) {
        console.error("RPC error:", error);
        alert("Error updating profile");
        return;
      }
  
      alert("Profile updated successfully!");
      navigate('/');
    } catch (err) {
      console.error('Error during update:', err.message);
      alert("Something went wrong!");
    } finally {
      setUploading(false);
    }
  };  
  

  return (
    <div>
      <div className="relative min-h-screen bg-center bg-cover flex justify-center items-center" style={{ backgroundImage: `url(${model})` }}>
        <div className="absolute inset-0 bg-[#ecf1f4]/70"></div>
        <div className="flex flex-col md:flex-row gap-x-4 gap-y-4 w-full max-w-5xl md:px-4 px-20 md:py-0 py-10">
          {/* Profile Photo Card */}
          <div className="w-full md:w-[300px] rounded-md shadow-lg h-auto bg-white flex justify-center items-center flex-col px-4 py-6 z-10 text-center">
            <h1 className="text-[#373354] font-semibold mb-6 text-lg">Upload Profile Picture</h1>
            <div className="h-32 w-32 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-6xl mb-4 overflow-hidden">
              {previewUrl ? (
                <img src={previewUrl} alt="Profile preview" className="h-full w-full object-cover" />
              ) : (
                <FaUser />
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            <button 
              onClick={handleUploadClick}
              className="w-[60%] rounded-sm bg-[#56bb7c] py-3 text-sm font-medium text-white hover:bg-[#3E9B61] duration-200"
            >
              Upload New Photo
            </button>
            <div className="w-[90%] h-auto bg-[#80D7FF]/30 border-[#00AFFF]/30 border-4 text-xs px-2 py-2 mt-4 text-[#545859] rounded-sm">
              <p>Upload a new avatar. Larger images will be resized immediately.</p>
              <p className="mt-2">Maximum upload size is <span className="font-medium">1MB</span></p>
            </div>
          </div>
          
          {/* Profile Form Card */}
          <div className="w-full md:w-[500px] rounded-md shadow-lg bg-white flex flex-col py-7 px-6 md:px-10 z-10 text-[#373354]">
            <h1 className="font-semibold text-3xl mb-6">Complete Your Profile</h1>
            <h1 className="font-medium text-xl mb-3">{session?.user?.user_metadata?.fullname || "Your Name"}</h1>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
              {/* Faculty Dropdown */}
              <div className="flex flex-col">
                <label className="flex items-center gap-x-2 text-sm font-medium mb-1">
                  <FaGraduationCap className="text-[#56bb7c]" />
                  Select Your Faculty
                </label>
                <select 
            value={faculty} // The value should reflect the selected faculty
            onChange={(e) => setFaculty(e.target.value)} // Update the faculty state
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#56bb7c]/50"
            required
          >
            {faculties.map((fac, index) => (
              <option key={index} value={fac} disabled={index === 0}>
                {fac}
              </option>
            ))}
          </select>
              </div>
              
              {/* Course Input */}
              <div className="flex flex-col">
                <label className="flex items-center gap-x-2 text-sm font-medium mb-1">
                  <FaBook className="text-[#56bb7c]" />
                  Your Course
                </label>
                <input 
                  type="text" 
                  value={course} 
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g. Computer Science, Business Administration"
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#56bb7c]/50"
                  required
                />
              </div>
              
              {/* Description Textarea */}
              <div className="flex flex-col">
                <label className="flex items-center gap-x-2 text-sm font-medium mb-1">
                  <FaPen className="text-[#56bb7c]" />
                  About You
                </label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us about yourself, your interests, goals, and experience..."
                  className="border border-gray-300 rounded-md px-3 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#56bb7c]/50"
                  required
                />
              </div>
              
              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={uploading}
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
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Postsignup