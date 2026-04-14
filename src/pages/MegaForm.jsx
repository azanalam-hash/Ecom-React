import { useState, useEffect } from "react";

const countriesMap = {
  "USA": ["New York", "Los Angeles", "Chicago", "Houston"],
  "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary"],
  "UK": ["London", "Manchester", "Birmingham", "Edinburgh"]
};

function MegaForm() {
  // --- STATE ---
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    gender: "",
    hobbies: [],
    country: "",
    city: "",
    dateOfBirth: "",
    appointmentTime: "",
    favoriteColor: "#ff0000",
    experience: "5",
    isActive: false,
    address: "",
    description: "",
    salary: "",
    taxPercentage: "",
    search: "",
    filterCountry: "",
    filterSkills: []
  });

  // Dynamic Array for Skills
  const [skills, setSkills] = useState([""]);

  // File states (need to hold raw File objects, so we keep them separate from formData object for ease)
  const [profileImageFiles, setProfileImageFiles] = useState(null);
  const [documentFiles, setDocumentFiles] = useState(null);

  // Derived state
  const [netSalary, setNetSalary] = useState("");

  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "hobbies") {
      setFormData(prev => {
        let newHobbies = [...prev.hobbies];
        if (checked) {
          newHobbies.push(value);
        } else {
          newHobbies = newHobbies.filter(h => h !== value);
        }
        return { ...prev, hobbies: newHobbies };
      });
    } else if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === "select-multiple") {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setFormData(prev => ({ ...prev, [name]: selectedOptions }));
    } else {
      setFormData(prev => {
        const newData = { ...prev, [name]: value };
        // Dependent Dropdown reset logic
        if (name === "country") {
          newData.city = ""; // reset city when country changes
        }
        return newData;
      });
    }
  };

  // Dynamic Skills Array Handlers
  const handleSkillChange = (index, value) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  const addSkill = () => setSkills([...skills, ""]);

  const removeSkill = (index) => {
    const newSkills = skills.filter((_, idx) => idx !== index);
    setSkills(newSkills);
  };

  // --- EFFECTS ---
  useEffect(() => {
    // Calculated net salary
    const s = parseFloat(formData.salary);
    const t = parseFloat(formData.taxPercentage);
    if (!isNaN(s) && !isNaN(t)) {
      const net = s - (s * (t / 100));
      setNetSalary(net.toFixed(2));
    } else {
      setNetSalary("");
    }
  }, [formData.salary, formData.taxPercentage]);


  // --- VALIDATION ---
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.fullName || formData.fullName.trim() === "") {
      newErrors.fullName = "Full Name is required.";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "A valid email address is required.";
      isValid = false;
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
      isValid = false;
    }

    if (formData.country && !formData.city) {
      newErrors.city = "Please select a city for your country.";
      isValid = false;
    }

    const validSkills = skills.filter(s => s.trim() !== "");
    if (validSkills.length === 0) {
      newErrors.skills = "Please provide at least one valid skill.";
      isValid = false;
    }

    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      if (age < 18) {
        newErrors.dateOfBirth = "You must be at least 18 years old.";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setStatus("Error: Please correct the marked fields before submitting.");
      return;
    }

    setStatus("Submitting...");

    const uploadData = new FormData();

    // 1. Append text/primitive fields
    for (const key in formData) {
      if (key === "hobbies" || key === "filterSkills") {
        uploadData.append(key, JSON.stringify(formData[key]));
      } else {
        uploadData.append(key, formData[key]);
      }
    }

    // 2. Append skills array
    uploadData.append("skills", JSON.stringify(skills.filter(s => s.trim() !== "")));

    // 3. Append netSalary explicitly since it's computed state separately
    uploadData.append("netSalary", netSalary);

    // 4. Append files
    if (profileImageFiles && profileImageFiles.length > 0) {
      uploadData.append("profileImage", profileImageFiles[0]);
    }

    if (documentFiles && documentFiles.length > 0) {
      Array.from(documentFiles).forEach(file => {
        uploadData.append("documents", file);
      });
    }

    try {
      const res = await fetch("http://localhost:5000/api/mega-form", {
        method: "POST",
        body: uploadData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit");

      setStatus(`Success! Document created with ID: ${data.id}`);
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-all">
      <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/40">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-center mb-8 pb-4 border-b border-gray-100">
          Mega Form Masterclass
        </h1>

        {status && (
          <div className={`p-4 rounded-xl mb-8 text-center font-semibold text-sm shadow-sm ${status.startsWith("Error") ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}>
            {status}
          </div>
        )}

        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6" onSubmit={handleSubmit} encType="multipart/form-data">

          {/* 1. Full Name */}
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Full Name <span className="text-rose-500">*</span></label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required minLength="2" maxLength="50"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white outline-none transition-all duration-200 bg-gray-50/50 text-gray-800" />
          </div>

          {/* 2. Email */}
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email <span className="text-rose-500">*</span></label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white outline-none transition-all duration-200 bg-gray-50/50 text-gray-800" />
          </div>

          {/* 3. Password */}
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200 bg-gray-50/50 text-gray-800 ${errors.password ? 'border-rose-400 focus:ring-rose-200' : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white'}`} />
            {errors.password && <span className="text-rose-500 text-xs mt-1.5 ml-1 font-medium">{errors.password}</span>}
          </div>

          {/* 4. Phone Number */}
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Phone Number</label>
            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} pattern="^\d{10}$" title="Must be exactly 10 digits"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white outline-none transition-all duration-200 bg-gray-50/50 text-gray-800" />
          </div>

          {/* 5. Gender */}
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Gender</label>
            <div className="flex gap-6 items-center w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 h-[50px]">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700"><input type="radio" name="gender" value="Male" checked={formData.gender === "Male"} onChange={handleChange} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" /> Male</label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700"><input type="radio" name="gender" value="Female" checked={formData.gender === "Female"} onChange={handleChange} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" /> Female</label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700"><input type="radio" name="gender" value="Other" checked={formData.gender === "Other"} onChange={handleChange} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" /> Other</label>
            </div>
          </div>

          {/* 6. Hobbies */}
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Hobbies</label>
            <div className="flex gap-4 items-center w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 flex-wrap min-h-[50px]">
              {["Reading", "Gaming", "Coding"].map(hobby => (
                <label key={hobby} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                  <input type="checkbox" name="hobbies" value={hobby} checked={formData.hobbies.includes(hobby)} onChange={handleChange} className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" /> {hobby}
                </label>
              ))}
            </div>
          </div>

          {/* 7. Country */}
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Country</label>
            <div className="relative">
              <select name="country" value={formData.country} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white outline-none transition-all duration-200 bg-gray-50/50 text-gray-800 appearance-none cursor-pointer">
                <option value="">Select country...</option>
                {Object.keys(countriesMap).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-indigo-500">
                <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
              </div>
            </div>
          </div>

          {/* 8. City (Dependent) */}
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">City</label>
            <div className="relative">
              <select name="city" value={formData.city} onChange={handleChange} disabled={!formData.country} className={`w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200 text-gray-800 appearance-none cursor-pointer ${!formData.country ? 'bg-gray-100 italic text-gray-400 cursor-not-allowed' : 'bg-gray-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 flex-grow'} ${errors.city ? 'border-rose-400 focus:ring-rose-200' : 'border-gray-200 focus:ring-indigo-200'}`}>
                <option value="">Select city...</option>
                {formData.country && countriesMap[formData.country].map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 ${!formData.country ? 'text-gray-300' : 'text-indigo-500'}`}>
                <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
              </div>
            </div>
            {errors.city && <span className="text-rose-500 text-xs mt-1.5 ml-1 font-medium">{errors.city}</span>}
          </div>

          {/* 9. Date of Birth */}
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Date of Birth</label>
            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange}
              className={`w-full px-4 py-[11px] rounded-xl border outline-none transition-all duration-200 text-gray-800 cursor-pointer ${errors.dateOfBirth ? 'border-rose-400 focus:ring-rose-200 bg-rose-50' : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-gray-50/50 focus:bg-white'}`} style={{ colorScheme: "light" }} />
            {errors.dateOfBirth && <span className="text-rose-500 text-xs mt-1.5 ml-1 font-medium">{errors.dateOfBirth}</span>}
          </div>

          {/* 10. Appointment Time */}
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Appointment Time</label>
            <input type="time" name="appointmentTime" value={formData.appointmentTime} onChange={handleChange} className="w-full px-4 py-[11px] rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white outline-none transition-all duration-200 bg-gray-50/50 text-gray-800" />
          </div>

          {/* 11. Profile Image */}
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Profile Image</label>
            <input type="file" accept="image/*" onChange={(e) => setProfileImageFiles(e.target.files)} className="w-full px-4 py-[9px] rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white outline-none transition-all duration-200 bg-gray-50/50 text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
          </div>

          {/* 12. Documents */}
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Documents (Multiple)</label>
            <input type="file" multiple onChange={(e) => setDocumentFiles(e.target.files)} className="w-full px-4 py-[9px] rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white outline-none transition-all duration-200 bg-gray-50/50 text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
          </div>

          {/* 13. Favorite Color */}
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Favorite Color</label>
            <div className="flex items-center gap-3 w-full px-4 py-[9px] rounded-xl border border-gray-200 bg-gray-50/50">
              <input type="color" name="favoriteColor" value={formData.favoriteColor} onChange={handleChange} className="w-8 h-8 rounded cursor-pointer border-0 p-0 shadow-sm" />
              <span className="text-gray-500 text-sm">{formData.favoriteColor}</span>
            </div>
          </div>

          {/* 14. Experience */}
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Experience: <span className="text-indigo-600">{formData.experience} Years</span></label>
            <input type="range" name="experience" min="0" max="20" value={formData.experience} onChange={handleChange} className="w-full mt-3 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>

          {/* 15. Is Active */}
          <div className="flex flex-col md:col-span-2 mt-2">
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              <span className="ml-3 text-sm font-semibold text-gray-700">Account Active (Toggle)</span>
            </label>
          </div>

          {/* 16. Address */}
          <div className="flex flex-col md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Address</label>
            <textarea name="address" rows="3" value={formData.address} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white outline-none transition-all duration-200 bg-gray-50/50 text-gray-800 resize-y"></textarea>
          </div>

          {/* 17. Description */}
          <div className="flex flex-col md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Description</label>
            <textarea name="description" rows="5" value={formData.description} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white outline-none transition-all duration-200 bg-gray-50/50 text-gray-800 resize-y"></textarea>
          </div>

          {/* 18. Skills Array */}
          <div className="flex flex-col md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Professional Skills</label>
            <div className="flex flex-col gap-3">
              {skills.map((skill, index) => (
                <div key={index} className="flex gap-3">
                  <input type="text" placeholder={`Skill ${index + 1}`} value={skill} onChange={(e) => handleSkillChange(index, e.target.value)}
                    className={`flex-grow px-4 py-3 rounded-xl border outline-none transition-all duration-200 bg-gray-50/50 text-gray-800 ${errors.skills ? 'border-rose-400 focus:ring-rose-200' : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white'}`} />
                  {skills.length > 1 && (
                    <button type="button" onClick={() => removeSkill(index)} className="px-4 py-3 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 rounded-xl font-bold transition-colors border border-rose-100 shadow-sm">X</button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addSkill} className="mt-3 self-start px-5 py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-sm font-semibold transition-colors border border-indigo-100 shadow-sm">+ Add Skill</button>
            {errors.skills && <span className="text-rose-500 text-xs mt-1.5 ml-1 font-medium">{errors.skills}</span>}
          </div>

          {/* 19. Salary */}
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Salary ($)</label>
            <input type="number" name="salary" value={formData.salary} onChange={handleChange} min="1" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white outline-none transition-all duration-200 bg-gray-50/50 text-gray-800" />
          </div>

          {/* 20. Tax Percentage */}
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Tax Percentage (%)</label>
            <input type="number" name="taxPercentage" value={formData.taxPercentage} onChange={handleChange} min="0" max="100" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white outline-none transition-all duration-200 bg-gray-50/50 text-gray-800" />
          </div>

          {/* 21. Net Salary (Readonly) */}
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Net Salary</label>
            <input type="text" readOnly value={netSalary} placeholder="Auto-calculated" className="w-full px-4 py-3 rounded-xl border border-transparent bg-indigo-50 text-indigo-900 font-semibold italic cursor-not-allowed outline-none shadow-inner" />
          </div>

          {/* 22. Search Input */}
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Search Context</label>
            <input type="text" name="search" value={formData.search} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white outline-none transition-all duration-200 bg-gray-50/50 text-gray-800" />
          </div>

          {/* 23. Filter Country */}
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Filter by Country</label>
            <div className="relative">
              <select name="filterCountry" value={formData.filterCountry} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white outline-none transition-all duration-200 bg-gray-50/50 text-gray-800 appearance-none cursor-pointer">
                <option value="">Any</option>
                {Object.keys(countriesMap).map(c => <option key={`filt-${c}`} value={c}>{c}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-indigo-500">
                <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
              </div>
            </div>
          </div>

          {/* 24. Filter Skills */}
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Filter by Tech Stack</label>
            <select name="filterSkills" multiple value={formData.filterSkills} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white outline-none transition-all duration-200 bg-gray-50/50 text-gray-800 h-[104px]">
              <option value="React" className="py-1 px-2 rounded-md hover:bg-indigo-50">React</option>
              <option value="Node.js" className="py-1 px-2 rounded-md hover:bg-indigo-50">Node.js</option>
              <option value="MongoDB" className="py-1 px-2 rounded-md hover:bg-indigo-50">MongoDB</option>
              <option value="Express" className="py-1 px-2 rounded-md hover:bg-indigo-50">Express</option>
            </select>
            <span className="text-xs text-gray-400 mt-2 ml-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple.</span>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 mt-6">
            <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-300 transform outline-none focus:ring-4 focus:ring-indigo-300">
              Submit Mega Form
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default MegaForm;
