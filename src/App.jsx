import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [developers, setDevelopers] = useState([]);
  const [filteredDevelopers, setFilteredDevelopers] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [major, setMajor] = useState("");
  const [gender, setGender] = useState(""); 

  const fetchDevelopers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://json-api.uz/api/project/11-dars/developers?skip=${skip}&limit=${limit}`
      );
      if (response.data.data.length > 0) {
        setDevelopers((prev) => [...prev, ...response.data.data]);
        setFilteredDevelopers((prev) => [...prev, ...response.data.data]);
        setSkip(skip + limit);
      } else {
        setShowMore(false);
      }
    } catch (error) {
      console.error("Error fetching developers:", error);
    } finally {
      setLoading(false);
    }
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
    <div className="container mx-auto p-4 bg-slate-300">
      <h1 className="text-3xl font-bold text-center mb-6 text-black font-bold">Developers List</h1>

      <div className="flex justify-center gap-4 mb-6">
        <select
          onChange={(e) => setMajor(e.target.value)}
          className="select select-bordered w-full max-w-xs"
        >
          <option value="">Select Major</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Information Technology">Information Technology</option>
        </select>

        <select
          onChange={(e) => setGender(e.target.value)}
          className="select select-bordered w-full max-w-xs"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevelopers.map((developer, index) => (
          <div key={index} className="card w-full bg-base-100 shadow-xl p-4">
            <h2 className="card-title">{developer.fullName}</h2>
            <p>Age: {developer.age}</p>
            <p>Major: {developer.major}</p>
            <p>Gender: {developer.gender}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center mt-4">
          <button className="btn loading">Loading...</button>
        </div>
      ) : showMore ? (
        <div className="flex justify-center mt-4">
          <button onClick={fetchDevelopers} className="btn btn-primary">
            Show more 10
          </button>
        </div>
      ) : (
        <div className="flex justify-center mt-4">
          <button onClick={handleShowLess} className="btn btn-secondary rounded-md bg-slate-500"> 
            Show less
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
