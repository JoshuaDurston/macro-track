import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FoodSearchModal from "../FoodSearchModal/FoodSearchModal.js"; // Import modal component
import "./DiaryPage.css";

const DiaryPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [diaryData, setDiaryData] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // Controls modal visibility
  const [activeSection, setActiveSection] = useState(""); // Tracks which section user is adding food to
  const navigate = useNavigate();

  const formatDate = (date) => date.toISOString().split("T")[0];

  useEffect(() => {
    async function fetchDiaryData() {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in");
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/diary/${formatDate(currentDate)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          if (response.status === 401) {
            alert("Session expired. Please log in again.");
            navigate("/login");
          } else {
            throw new Error("Failed to fetch diary data");
          }
        }

        const data = await response.json();
        setDiaryData({
          breakfast: data.breakfast || [],
          lunch: data.lunch || [],
          dinner: data.dinner || [],
          snacks: data.snacks || [],
        });
      } catch (error) {
        console.error("Error fetching diary data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDiaryData();
  }, [currentDate, navigate]);

  const handleDateChange = (days) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    });
  };

  const handleTrackFood = (section) => {
    setActiveSection(section); // Store which section is being edited
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const calculateTotalKj = (section) =>
    section.reduce((total, item) => total + item.kj, 0);

  const calculateDailyTotal = () => {
    return (
      calculateTotalKj(diaryData.breakfast) +
      calculateTotalKj(diaryData.lunch) +
      calculateTotalKj(diaryData.dinner) +
      calculateTotalKj(diaryData.snacks)
    );
  };

  return (
    <div className="diary-container">
      <h1 className="diary-header">Diary</h1>
      <div className="date-navigation">
        <button
          onClick={() => handleDateChange(-1)}
          disabled={loading}
          className="date-button"
        >
          ⬅️ Previous Day
        </button>
        <span className="date-display">{formatDate(currentDate)}</span>
        <button
          onClick={() => handleDateChange(1)}
          disabled={loading}
          className="date-button"
        >
          Next Day ➡️
        </button>
      </div>
      <h2 className="total-kj">
        Total Kilojoules: {calculateDailyTotal()} kj
      </h2>
      {["breakfast", "lunch", "dinner", "snacks"].map((section) => (
        <div key={section} className="diary-section">
          <h3 className="section-header">
            {section.charAt(0).toUpperCase() + section.slice(1)} (
            {calculateTotalKj(diaryData[section])} kj)
          </h3>
          <button
            onClick={() => handleTrackFood(section)}
            className="track-food-button"
          >
            Track Food
          </button>
          <ul className="food-list">
            {diaryData[section].map((item, index) => (
              <li key={index} className="food-item">
                {item.name} - {item.kj} kj
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Food Search Modal */}
      {modalOpen && (
        <FoodSearchModal
          section={activeSection}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default DiaryPage;
