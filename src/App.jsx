import React, { useState, useEffect } from "react";
import https from '.././axios';

const App = () => {
  const [developers, setDevelopers] = useState([]);
  const [filteredDevelopers, setFilteredDevelopers] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [major, setMajor] = useState("");
  const [gender, setGender] = useState(""); 

  const fetchDevelopers = () => {
    setLoading(true);
    https.get(
      `/api/project/11-dars/developers?skip=${skip}&limit=${limit}`
    ).then(response => {
      if (response.data.data.length > 0) {
        setDevelopers((prev) => [...prev, ...response.data.data]);
        setFilteredDevelopers((prev) => [...prev, ...response.data.data]);
        setSkip(skip + limit);
      } else {
        setShowMore(false);
      }
    }).catch(error => {
      console.error("Error fetching developers:", error);
    }).finally(() => {
      setLoading(false);
    });
  };

  const handleShowLess = () => {
    setFilteredDevelopers(developers.slice(0, 10));
    setSkip(10);
    setShowMore(true);
  };

  useEffect(() => {
    fetchDevelopers();
  }, []);

  useEffect(() => {
    let filtered = developers;
    if (major) {
      filtered = filtered.filter((dev) => dev.major === major);
    }
    if (gender) {
      filtered = filtered.filter((dev) => dev.gender === gender);
    }
    setFilteredDevelopers(filtered);
  }, [major, gender, developers]);

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Developers List</h1>

      {/* Filter section */}
      <div className="flex justify-center gap-4 mb-6">
        <select
          onChange={(e) => setMajor(e.target.value)}
          className="select select-bordered w-full max-w-xs bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
        >
          <option value="">Select Major</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Information Technology">Information Technology</option>
        </select>

        <select
          onChange={(e) => setGender(e.target.value)}
          className="select select-bordered w-full max-w-xs bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevelopers.map((developer, index) => (
          <div key={index} className="card w-full bg-white shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105">
            <h2 className="card-title text-xl font-semibold text-gray-800">{developer.fullName}</h2>
            <p className="text-gray-600">Age: {developer.age}</p>
            <p className="text-gray-600">Major: {developer.major}</p>
            <p className="text-gray-600">Gender: {developer.gender}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center mt-4">
          <button className="btn loading">Loading...</button>
        </div>
      ) : showMore ? (
        <div className="flex justify-center mt-4">
          <button onClick={fetchDevelopers} className="btn btn-primary bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Show more 10
          </button>
        </div>
      ) : (
        <div className="flex justify-center mt-4">
          <button onClick={handleShowLess} className="btn btn-secondary bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"> 
            Show less
          </button>
        </div>
      )}
    </div>
  );
};

export default App;