// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { createTrip } from "../api/trips";
// import "./CreateItinerary.css";
// import imageCompression from "browser-image-compression";

// const CreateItinerary = () => {
//   const [form, setForm] = useState({
//     Title: "",
//     SubTitle: "",
//     MaxElevation: "",
//     Duration: "",
//     Distance: "",
//     Difficulty: "",
//     StartPoint: "",
//     EndPoint: "",
//     Travel_description: "",
//     Destinations: "",
//     Highlights: "",
//     images: [""],
//     what_to_expect: [{ expect_title: "", expect_description: "" }],
//     days: [
//       { day: 1, description: "", distance: "", duration: "", highlights: "" },
//     ],
//   });

//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//     if (errors[name]) {
//       setErrors({ ...errors, [name]: "" });
//     }
//   };

//   const handleExpectChange = (index, field, value) => {
//     const updated = [...form.what_to_expect];
//     updated[index][field] = value;
//     setForm({ ...form, what_to_expect: updated });
//   };

//   const addExpect = () => {
//     setForm({
//       ...form,
//       what_to_expect: [
//         ...form.what_to_expect,
//         { expect_title: "", expect_description: "" },
//       ],
//     });
//   };

//   const handleDayChange = (index, field, value) => {
//     const updated = [...form.days];
//     updated[index][field] = value;
//     setForm({ ...form, days: updated });
//   };

//   const addDay = () => {
//     setForm({
//       ...form,
//       days: [
//         ...form.days,
//         {
//           day: form.days.length + 1,
//           description: "",
//           distance: "",
//           duration: "",
//           highlights: "",
//         },
//       ],
//     });
//   };

//   const removeImage = (index) => {
//     const updated = [...form.images];
//     updated.splice(index, 1);
//     setForm({ ...form, images: updated });
//   };

//   const MAX_IMAGE_MB = 2;
//   const MAX_TOTAL_KB = 6000;

//   const handleBase64ImageUpload = async (e) => {
//   const files = Array.from(e.target.files);

//   let totalKB = form.images.reduce((sum, img) => {
//     return sum + Math.ceil((img.length * 3) / 4 / 1024);
//   }, 0);

//   for (let file of files) {
//     if (!file.type.startsWith("image/")) {
//       alert("Only image files are allowed.");
//       continue;
//     }

//     let fileToProcess = file;

//     // Compress only if file size > 1MB
//     if (file.size > 1 * 1024 * 1024) {
//       alert("Image is larger than 1MB. Compressing...");

//       try {
//         fileToProcess = await imageCompression(file, {
//           maxSizeMB: 0.35,
//           maxWidthOrHeight: 1280,
//           useWebWorker: true,
//         });
//       } catch (err) {
//         console.error("Compression failed:", err);
//         continue;
//       }
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const base64 = reader.result;
//       const kbSize = Math.ceil((base64.length * 3) / 4 / 1024);

//       if (totalKB + kbSize > MAX_TOTAL_KB) {
//         alert("Cannot upload — total image size will exceed 6MB.");
//         return;
//       }

//       totalKB += kbSize;

//       setForm((prevForm) => ({
//         ...prevForm,
//         images: [...prevForm.images, base64],
//       }));
//     };

//     reader.readAsDataURL(fileToProcess);
//   }
// };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!form.title.trim()) newErrors.title = "Title is required";
//     if (!form.duration.trim()) newErrors.duration = "Duration is required";
//     if (!form.travel_description.trim())
//       newErrors.travel_description = "Travel description is required";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       await createTrip({
//         ...form,
//         destinations: form.destinations
//           .split(",")
//           .map((d) => d.trim())
//           .filter((d) => d),
//         highlights: form.highlights
//           .split(",")
//           .map((h) => h.trim())
//           .filter((h) => h),
//         images: form.images.filter(Boolean),
//         days: form.days.map((d) => ({
//           ...d,
//           highlights: d.highlights
//             .split(",")
//             .map((h) => h.trim())
//             .filter((h) => h),
//         })),
//       });
//       navigate("/itineraries");
//     } catch (error) {
//       console.error("Error creating itinerary:", error);
//       setErrors({ submit: "Failed to create itinerary. Please try again." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="create-itinerary">
//       <div className="create-header">
//         <h1 className="create-title">Create New Itinerary</h1>
//         <button
//           onClick={() => navigate("/itineraries")}
//           className="btn btn-secondary"
//         >
//           Cancel
//         </button>
//       </div>

//       <div className="card">
//         <form onSubmit={handleSubmit} className="create-form">
//           {errors.submit && (
//             <div className="alert alert-error">{errors.submit}</div>
//           )}

//           {Object.keys(form)
//             .filter((k) => !["what_to_expect", "days", "images"].includes(k))
//             .map((key) => (
//               <div key={key} className="form-group">
//                 <label htmlFor={key} className="form-label">
//                   {key.replace(/_/g, " ")}
//                   {["title", "duration", "travel_description"].includes(key)
//                     ? " *"
//                     : ""}
//                 </label>
//                 {key === "travel_description" || key === "highlights" ? (
//                   <textarea
//                     id={key}
//                     name={key}
//                     rows={3}
//                     value={form[key]}
//                     onChange={handleChange}
//                     className={`form-input ${errors[key] ? "error" : ""}`}
//                   />
//                 ) : (
//                   <input
//                     type="text"
//                     id={key}
//                     name={key}
//                     value={form[key]}
//                     onChange={handleChange}
//                     className={`form-input ${errors[key] ? "error" : ""}`}
//                   />
//                 )}
//                 {errors[key] && <p className="form-error">{errors[key]}</p>}
//               </div>
//             ))}

//           {/* Image  */}

//           <input
//             type="file"
//             accept="image/*"
//             multiple
//             className="form-input"
//             onChange={handleBase64ImageUpload}
//           />
//           {form.images.length > 0 && (
//             <div style={{ marginTop: 16 }}>
//               {form.images.map((img, index) => {
//                 if (!img || img.length < 100) return null; // Skip broken images

//                 const sizeKB = Math.ceil((img.length * 3) / 4 / 1024);

//                 return (
//                   <div
//                     key={index}
//                     style={{
//                       marginBottom: 10,
//                       padding: 8,
//                       border: "1px solid #e5e7eb",
//                       borderRadius: 4,
//                       maxWidth: 300,
//                     }}
//                   >
//                     <img
//                       src={img}
//                       alt={`img-${index}`}
//                       style={{
//                         width: "100%",
//                         maxHeight: "180px",
//                         objectFit: "cover",
//                         borderRadius: 6,
//                         marginBottom: 8,
//                       }}
//                     />
//                     <p style={{ margin: 0, fontSize: 14 }}>
//                       <strong>Image {index + 1}</strong> — {sizeKB} KB
//                     </p>
//                     <button
//                       type="button"
//                       onClick={() => removeImage(index)}
//                       className="btn btn-danger"
//                       style={{ marginTop: 6 }}
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 );
//               })}
//             </div>
//           )}

//           {/* What to Expect */}
//           <div className="form-group">
//             <label className="form-label">What to Expect</label>
//             {form.what_to_expect.map((item, index) => (
//               <div
//                 key={index}
//                 className="form-group"
//                 style={{
//                   border: "1px solid #e5e7eb",
//                   padding: "12px",
//                   marginBottom: "12px",
//                   borderRadius: "6px",
//                 }}
//               >
//                 <input
//                   type="text"
//                   placeholder="Title"
//                   className="form-input"
//                   value={item.expect_title}
//                   onChange={(e) =>
//                     handleExpectChange(index, "expect_title", e.target.value)
//                   }
//                 />
//                 <textarea
//                   rows={2}
//                   placeholder="Description"
//                   className="form-input"
//                   value={item.expect_description}
//                   onChange={(e) =>
//                     handleExpectChange(
//                       index,
//                       "expect_description",
//                       e.target.value
//                     )
//                   }
//                 />
//               </div>
//             ))}
//             <button
//               type="button"
//               className="btn btn-secondary"
//               onClick={addExpect}
//             >
//               + Add More
//             </button>
//           </div>

//           {/* Days */}
//           <div className="form-group">
//             <label className="form-label">Day-wise Plan</label>
//             {form.days.map((item, index) => (
//               <div
//                 key={index}
//                 className="form-group"
//                 style={{
//                   border: "1px solid #e5e7eb",
//                   padding: "12px",
//                   marginBottom: "12px",
//                   borderRadius: "6px",
//                 }}
//               >
//                 <input
//                   type="number"
//                   placeholder="Day Number"
//                   className="form-input"
//                   value={item.day}
//                   onChange={(e) =>
//                     handleDayChange(index, "day", parseInt(e.target.value))
//                   }
//                 />
//                 <input
//                   type="text"
//                   placeholder="Description"
//                   className="form-input"
//                   value={item.description}
//                   onChange={(e) =>
//                     handleDayChange(index, "description", e.target.value)
//                   }
//                 />
//                 <input
//                   type="text"
//                   placeholder="Distance"
//                   className="form-input"
//                   value={item.distance}
//                   onChange={(e) =>
//                     handleDayChange(index, "distance", e.target.value)
//                   }
//                 />
//                 <input
//                   type="text"
//                   placeholder="Duration"
//                   className="form-input"
//                   value={item.duration}
//                   onChange={(e) =>
//                     handleDayChange(index, "duration", e.target.value)
//                   }
//                 />
//                 <input
//                   type="text"
//                   placeholder="Highlights (comma-separated)"
//                   className="form-input"
//                   value={item.highlights}
//                   onChange={(e) =>
//                     handleDayChange(index, "highlights", e.target.value)
//                   }
//                 />
//               </div>
//             ))}
//             <button
//               type="button"
//               className="btn btn-secondary"
//               onClick={addDay}
//             >
//               + Add Day
//             </button>
//           </div>

//           <div className="form-actions">
//             <button
//               type="button"
//               onClick={() => navigate("/itineraries")}
//               className="btn btn-secondary"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="btn btn-success"
//             >
//               {loading ? "Creating..." : "Create Itinerary"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateItinerary;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTrip } from "../api/trips";
import "./styles/CreateItinerary.css";
import imageCompression from "browser-image-compression";

const CreateItinerary = () => {
  const [form, setForm] = useState({
    title: "",
    subTitle: "",
    maxElevation: "",
    duration: "",
    distance: "",
    difficulty: "",
    startPoint: "",
    endPoint: "",
    travel_description: "",
    destinations: "",
    highlights: "",
    images: [""],
    category: "Adventure & Trekking",
    what_to_expect: [{ expect_title: "", expect_description: "" }],

    days: [
      { day: 1, description: "", distance: "", duration: "", highlights: "" },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleExpectChange = (index, field, value) => {
    const updated = [...form.what_to_expect];
    updated[index][field] = value;
    setForm({ ...form, what_to_expect: updated });
  };

  const addExpect = () => {
    setForm({
      ...form,
      what_to_expect: [
        ...form.what_to_expect,
        { expect_title: "", expect_description: "" },
      ],
    });
  };

  const handleDayChange = (index, field, value) => {
    const updated = [...form.days];
    updated[index][field] = value;
    setForm({ ...form, days: updated });
  };

  const addDay = () => {
    setForm({
      ...form,
      days: [
        ...form.days,
        {
          day: form.days.length + 1,
          description: "",
          distance: "",
          duration: "",
          highlights: "",
        },
      ],
    });
  };

  const removeImage = (index) => {
    const updated = [...form.images];
    updated.splice(index, 1);
    setForm({ ...form, images: updated });
  };

  const MAX_IMAGE_MB = 2;
  const MAX_TOTAL_KB = 6000;

  const handleBase64ImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    let totalKB = form.images.reduce((sum, img) => {
      return sum + Math.ceil((img.length * 3) / 4 / 1024);
    }, 0);

    for (let file of files) {
      if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed.");
        continue;
      }

      let fileToProcess = file;

      if (file.size > 1 * 1024 * 1024) {
        alert("Image is larger than 1MB. Compressing...");
        try {
          fileToProcess = await imageCompression(file, {
            maxSizeMB: 0.35,
            maxWidthOrHeight: 1280,
            useWebWorker: true,
          });
        } catch (err) {
          console.error("Compression failed:", err);
          continue;
        }
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        const kbSize = Math.ceil((base64.length * 3) / 4 / 1024);

        if (totalKB + kbSize > MAX_TOTAL_KB) {
          alert("Cannot upload — total image size will exceed 6MB.");
          return;
        }

        totalKB += kbSize;

        setForm((prevForm) => ({
          ...prevForm,
          images: [...prevForm.images, base64],
        }));
      };

      reader.readAsDataURL(fileToProcess);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.Title = "Title is required";
    if (!form.duration.trim()) newErrors.Duration = "Duration is required";
    if (!form.travel_description.trim())
      newErrors.Travel_description = "Travel description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await createTrip({
        ...form,
        what_to_expect: form.what_to_expect,
        destinations: form.destinations?.split(",").map((d) => d.trim()),
        highlights: form.highlights?.split(",").map((h) => h.trim()),
        images: form.images.filter(Boolean),
        days: form.days.map((d) => ({
          ...d,
          highlights: d.highlights
            .split(",")
            .map((h) => h.trim())
            .filter((h) => h),
        })),
      });
      navigate("/itineraries");
    } catch (error) {
      console.error("Error creating itinerary:", error);
      setErrors({ submit: "Failed to create itinerary. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-itinerary">
      <div className="create-header">
        <h1 className="create-title">Create New Itinerary</h1>
        <button
          onClick={() => navigate("/itineraries")}
          className="btn btn-secondary"
        >
          Cancel
        </button>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="create-form">
          {errors.submit && (
            <div className="alert alert-error">{errors.submit}</div>
          )}

          {/* Category Dropdown */}
          <div className="form-group">
            <label className="form-label" htmlFor="category">
              Category
            </label>
            <select
              name="category"
              id="category"
              value={form.category}
              onChange={handleSelectChange}
              className="form-input"
            >
              <option value="Adventure & Trekking">Adventure & Trekking</option>
              <option value="Cultural & Heritage Tours">
                Cultural & Heritage Tours
              </option>
              <option value="Leisure & Offbeat Escapes">
                Leisure & Offbeat Escapes
              </option>
              <option value="Spiritual & Wellness Retreats">
                Spiritual & Wellness Retreats
              </option>
            </select>
          </div>

          {/* Text Inputs */}
          {Object.keys(form)
            .filter(
              (k) =>
                !["what_to_expect", "days", "images", "category"].includes(k)
            )
            .map((key) => (
              <div key={key} className="form-group">
                <label htmlFor={key} className="form-label">
                  {key.replace(/_/g, " ")}{" "}
                  {["Title", "Duration", "Travel_description"].includes(key)
                    ? "*"
                    : ""}
                </label>
                {key === "Travel_description" || key === "Highlights" ? (
                  <textarea
                    id={key}
                    name={key}
                    rows={3}
                    value={form[key]}
                    onChange={handleChange}
                    className={`form-input ${errors[key] ? "error" : ""}`}
                  />
                ) : (
                  <input
                    type="text"
                    id={key}
                    name={key}
                    value={form[key]}
                    onChange={handleChange}
                    className={`form-input ${errors[key] ? "error" : ""}`}
                  />
                )}
                {errors[key] && <p className="form-error">{errors[key]}</p>}
              </div>
            ))}

          {/* Image Upload */}
          <input
            type="file"
            accept="image/*"
            multiple
            className="form-input"
            onChange={handleBase64ImageUpload}
          />
          {form.images.length > 0 && (
            <div style={{ marginTop: 16 }}>
              {form.images.map((img, index) => {
                if (!img || img.length < 100) return null;
                const sizeKB = Math.ceil((img.length * 3) / 4 / 1024);
                return (
                  <div key={index} style={{ marginBottom: 10 }}>
                    <img
                      src={img}
                      alt={`img-${index}`}
                      style={{
                        width: "100%",
                        maxHeight: "180px",
                        objectFit: "cover",
                      }}
                    />
                    <p>
                      <strong>Image {index + 1}</strong> — {sizeKB} KB
                    </p>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="btn btn-danger"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* What to Expect */}
          <div className="form-group">
            <label className="form-label">What to Expect</label>
            {form.what_to_expect.map((item, index) => (
              <div key={index} className="form-group">
                <input
                  type="text"
                  placeholder="Title"
                  className="form-input"
                  value={item.expect_title}
                  onChange={(e) =>
                    handleExpectChange(index, "expect_title", e.target.value)
                  }
                />
                <textarea
                  rows={2}
                  placeholder="Description"
                  className="form-input"
                  value={item.expect_description}
                  onChange={(e) =>
                    handleExpectChange(
                      index,
                      "expect_description",
                      e.target.value
                    )
                  }
                />
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addExpect}
            >
              + Add More
            </button>
          </div>

          {/* Day-wise Plan */}
          <div className="form-group">
            <label className="form-label">Day-wise Plan</label>
            {form.days.map((item, index) => (
              <div key={index} className="form-group">
                <input
                  type="number"
                  placeholder="Day Number"
                  className="form-input"
                  value={item.day}
                  onChange={(e) =>
                    handleDayChange(index, "day", parseInt(e.target.value))
                  }
                />
                <input
                  type="text"
                  placeholder="Description"
                  className="form-input"
                  value={item.description}
                  onChange={(e) =>
                    handleDayChange(index, "description", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Distance"
                  className="form-input"
                  value={item.distance}
                  onChange={(e) =>
                    handleDayChange(index, "distance", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Duration"
                  className="form-input"
                  value={item.duration}
                  onChange={(e) =>
                    handleDayChange(index, "duration", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Highlights (comma-separated)"
                  className="form-input"
                  value={item.highlights}
                  onChange={(e) =>
                    handleDayChange(index, "highlights", e.target.value)
                  }
                />
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addDay}
            >
              + Add Day
            </button>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate("/itineraries")}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-success"
            >
              {loading ? "Creating..." : "Create Itinerary"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateItinerary;
