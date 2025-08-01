/* eslint-disable no-unused-vars */
import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import './styles/PhotoGallary.css';
import { createPhotoGallery } from "../api/photos";
const PhotoGallary = () => {
    const [title, setTitle] = useState('');
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);

    const [loading, setLoading] = useState(false);

    const handleFileChange = async (e) => {
        const selectedFiles = Array.from(e.target.files);

        for (let file of selectedFiles) {
            if (!file.type.startsWith("image/")) {
                alert("Only image files are allowed.");
                continue;
            }

            try {
                const compressedFile = await imageCompression(file, {
                    maxSizeMB: 0.5,
                    maxWidthOrHeight: 1024,
                    useWebWorker: true,
                });

                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = reader.result;

                    // Update state
                    setImages((prev) => [...prev, base64]);
                    setPreviews((prev) => [...prev, base64]);
                };
                reader.readAsDataURL(compressedFile);
            } catch (err) {
                console.error("Compression error:", err);
            }
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (images.length === 0) {
            alert("Please upload at least one image.");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                title,
                images,
            };

            const res = await createPhotoGallery(payload);
            alert("Uploaded!");
            console.log(res.data);

            // Reset form
            setTitle('');
            setImages([]);
            setPreviews([]);
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-container">
            <form onSubmit={handleUpload} className="upload-form">
                <input
                    type="text"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-input"
                />

                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="file-input"
                />

                <div className="image-preview-list">
                    {previews.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`preview-${idx}`}
                            className="image-preview"
                        />
                    ))}
                </div>

                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? "Uploading..." : "Upload Compressed Images"}
                </button>
            </form>
        </div>
    );
};

export default PhotoGallary;
