import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";

function PropertyPhotoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const fetchPropertyImage = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "properties", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPhotoUrl(docSnap.data().imageUrl || docSnap.data().image);
        } else {
          setPhotoUrl("https://via.placeholder.com/1200x800?text=No+Image");
        }
      } catch (err) {
        console.error("Error fetching property image:", err);
        setPhotoUrl("https://via.placeholder.com/1200x800?text=No+Image");
      }
      setLoading(false);
    };

    fetchPropertyImage();
  }, [id]);

  if (loading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading photo...</p>;

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: "#000",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: zoom > 1 ? "grab" : "default",
      }}
      onWheel={(e) => setZoom((prev) => Math.min(Math.max(prev + e.deltaY * -0.001, 1), 3))}
    >
      {/* Fullscreen Image */}
      <img
        src={photoUrl}
        alt={`Property ${id}`}
        style={{
          transform: `scale(${zoom})`,
          transition: "transform 0.2s ease-out",
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
        }}
      />

      {/* Watermark */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "20px",
          color: "rgba(255,255,255,0.6)",
          fontSize: "1.5rem",
          fontWeight: "bold",
          pointerEvents: "none",
        }}
      >
        Rentflow360 ©
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          background: "rgba(0,0,0,0.5)",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "1rem",
        }}
      >
        ← Back
      </button>
    </div>
  );
}

export default PropertyPhotoPage;
