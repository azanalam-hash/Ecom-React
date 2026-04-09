import { useState, useEffect } from "react";
import "./MegaForm.css";

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


  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <div className="mega-form-page">
      <h1>Mega Form Masterclass</h1>
      {status && <p style={{textAlign: "center", color: status.startsWith("Error") ? "red" : "green"}}>{status}</p>}

      <form className="mega-form" onSubmit={handleSubmit} encType="multipart/form-data">
        
        {/* 1. Full Name */}
        <div className="form-group">
          <label>Full Name *</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
        </div>

        {/* 2. Email */}
        <div className="form-group">
          <label>Email *</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        {/* 3. Password */}
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </div>

        {/* 4. Phone Number */}
        <div className="form-group">
          <label>Phone Number</label>
          <input type="number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
        </div>

        {/* 5. Gender */}
        <div className="form-group">
          <label>Gender</label>
          <div className="radio-group">
            <label><input type="radio" name="gender" value="Male" checked={formData.gender === "Male"} onChange={handleChange}/> Male</label>
            <label><input type="radio" name="gender" value="Female" checked={formData.gender === "Female"} onChange={handleChange}/> Female</label>
            <label><input type="radio" name="gender" value="Other" checked={formData.gender === "Other"} onChange={handleChange}/> Other</label>
          </div>
        </div>

        {/* 6. Hobbies */}
        <div className="form-group">
          <label>Hobbies</label>
          <div className="checkbox-group">
            {["Reading", "Gaming", "Coding"].map(hobby => (
              <label key={hobby}>
                <input type="checkbox" name="hobbies" value={hobby} checked={formData.hobbies.includes(hobby)} onChange={handleChange}/> {hobby}
              </label>
            ))}
          </div>
        </div>

        {/* 7. Country */}
        <div className="form-group">
          <label>Country</label>
          <select name="country" value={formData.country} onChange={handleChange}>
            <option value="">Select country...</option>
            {Object.keys(countriesMap).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* 8. City (Dependent) */}
        <div className="form-group">
          <label>City</label>
          <select name="city" value={formData.city} onChange={handleChange} disabled={!formData.country}>
            <option value="">Select city...</option>
            {formData.country && countriesMap[formData.country].map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* 9. Date of Birth */}
        <div className="form-group">
          <label>Date of Birth</label>
          <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
        </div>

        {/* 10. Appointment Time */}
        <div className="form-group">
          <label>Appointment Time</label>
          <input type="time" name="appointmentTime" value={formData.appointmentTime} onChange={handleChange} />
        </div>

        {/* 11. Profile Image */}
        <div className="form-group">
          <label>Profile Image</label>
          <input type="file" accept="image/*" onChange={(e) => setProfileImageFiles(e.target.files)} />
        </div>

        {/* 12. Documents */}
        <div className="form-group">
          <label>Documents (Multiple)</label>
          <input type="file" multiple onChange={(e) => setDocumentFiles(e.target.files)} />
        </div>

        {/* 13. Favorite Color */}
        <div className="form-group">
          <label>Favorite Color</label>
          <input type="color" name="favoriteColor" value={formData.favoriteColor} onChange={handleChange} />
        </div>

        {/* 14. Experience */}
        <div className="form-group">
          <label>Experience (Years): {formData.experience}</label>
          <input type="range" name="experience" min="0" max="20" value={formData.experience} onChange={handleChange} />
        </div>

        {/* 15. Is Active */}
        <div className="form-group full-width">
          <div className="toggle-switch">
            <label>
              <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
              Is Active (Toggle)
            </label>
          </div>
        </div>

        {/* 16. Address */}
        <div className="form-group full-width">
          <label>Address</label>
          <textarea name="address" rows="3" value={formData.address} onChange={handleChange}></textarea>
        </div>

        {/* 17. Description */}
        <div className="form-group full-width">
          <label>Description</label>
          <textarea name="description" rows="5" value={formData.description} onChange={handleChange}></textarea>
        </div>

        {/* 18. Skills Array */}
        <div className="form-group full-width">
          <label>Skills</label>
          <div className="dynamic-array-list">
            {skills.map((skill, index) => (
              <div key={index} className="dynamic-array-item">
                <input 
                  type="text" 
                  placeholder={`Skill ${index + 1}`} 
                  value={skill} 
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                />
                {skills.length > 1 && (
                  <button type="button" className="btn-remove" onClick={() => removeSkill(index)}>X</button>
                )}
              </div>
            ))}
          </div>
          <button type="button" className="btn-add" onClick={addSkill}>+ Add Skill</button>
        </div>

        {/* 19. Salary */}
        <div className="form-group">
          <label>Salary</label>
          <input type="number" name="salary" value={formData.salary} onChange={handleChange} />
        </div>

        {/* 20. Tax Percentage */}
        <div className="form-group">
          <label>Tax Percentage (%)</label>
          <input type="number" name="taxPercentage" value={formData.taxPercentage} onChange={handleChange} />
        </div>

        {/* 21. Net Salary (Readonly) */}
        <div className="form-group">
          <label>Net Salary (Calculated)</label>
          <input type="text" readOnly value={netSalary} placeholder="Auto-calculated" />
        </div>

        {/* 22. Search Input */}
        <div className="form-group">
          <label>Search Query Context</label>
          <input type="text" name="search" value={formData.search} onChange={handleChange} />
        </div>

        {/* 23. Filter Country */}
        <div className="form-group">
          <label>Filter Country</label>
          <select name="filterCountry" value={formData.filterCountry} onChange={handleChange}>
             <option value="">Any</option>
             {Object.keys(countriesMap).map(c => <option key={`filt-${c}`} value={c}>{c}</option>)}
          </select>
        </div>

        {/* 24. Filter Skills */}
        <div className="form-group">
          <label>Filter Skills (Multi-select)</label>
          <select name="filterSkills" multiple value={formData.filterSkills} onChange={handleChange} style={{height: "100px"}}>
             <option value="React">React</option>
             <option value="Node.js">Node.js</option>
             <option value="MongoDB">MongoDB</option>
             <option value="Express">Express</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">Submit Mega Form</button>

      </form>
    </div>
  );
}

export default MegaForm;
