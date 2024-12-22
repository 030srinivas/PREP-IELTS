import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,    
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const userId = localStorage.getItem("userId");

const Dashboard = () => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      setError("User ID not found.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user-progress/${userId}`);
        const contentType = response.headers.get("Content-Type");

        if (!response.ok || !contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid response format. Expected JSON.");
        }

        const data = await response.json();
        setProgressData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // Prepare data for the bar chart (Overall scores)
  const dates = progressData.map((item) => item.date);
  const overallScores = progressData.map((item) => item.overall);

  const barChartData = {
    labels: dates,
    datasets: [
      {
        label: "Overall Performance",
        data: overallScores,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100, // Set max value to 100 for percentage
        ticks: {
          stepSize: 10, // Adjust step size to fit the range (0-100)
          callback: function (value) {
            return value + "%"; // Append '%' symbol to the tick labels
          },
        },
      },
    },
  };

  // Prepare data for the line chart (Section-wise scores)
  const lineChartData = {
    labels: dates,
    datasets: [
      {
        label: "Speaking",
        data: progressData.map((item) => item.speaking_score),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.4,
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
      },
      {
        label: "Reading",
        data: progressData.map((item) => item.reading_score),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
      },
      {
        label: "Listening",
        data: progressData.map((item) => item.listening_score),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
      },
      {
        label: "Writing",
        data: progressData.map((item) => item.writing_score),
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        tension: 0.4,
        pointBackgroundColor: "rgba(153, 102, 255, 1)",
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100, // Set max value to 100 for percentage
        ticks: {
          stepSize: 10, // Adjust step size to fit the range (0-100)
          callback: function (value) {
            return value + "%"; // Append '%' symbol to the tick labels
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="min-w-full p-6 bg-gray-100">
      <h2 className="text-3xl font-bold mb-4 text-center">Performance Dashboard</h2>

      {/* Bar Chart */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h3 className="text-xl font-semibold mb-2">Bar Chart: Daily Overall Performance</h3>
        <div style={{ width: "100%", height: "400px" }}>
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-2">Line Chart: Section-Wise Performance</h3>
        <div style={{ width: "100%", height: "400px" }}>
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;














