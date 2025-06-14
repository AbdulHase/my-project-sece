import React, { useState, useEffect } from "react";
import axios from "axios";

const TabletList = () => {
  const [tablets, setTablets] = useState([]);
  const [newTablet, setNewTablet] = useState({
    Name: "",
    Dosage: "",
    time: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTablets = async () => {
      try {
        const response = await axios.get("http://localhost:5000/tablets");
        setTablets(response.data);
      } catch (error) {
        console.error("Error fetching tablets:", error);
      }
    };

    fetchTablets();
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      checkTabletsTime();
      console.log('set')
    }, 1000);

    return () => clearInterval(interval);
  }, [tablets])
  const addTablet = async () => {
    try {
      if (newTablet.Name.trim() !== "" && newTablet.Dosage.trim() !== "" && newTablet.time.trim() !== "") {
        const response = await axios.post("http://localhost:5000/add-expense", newTablet);
        setTablets([...tablets, response.data]);
        setNewTablet({
          Name: "",
          Dosage: "",
          time: "",
        });
      } else {
        alert("Please enter the details");
      }
    } catch (error) {
      console.error("Error adding tablet:", error);
    }
  };

  const deleteTablet = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete-expense/${id}`);
      setTablets(tablets.filter((tablet) => tablet._id !== id));
    } catch (error) {
      console.error("Error deleting tablet:", error);
    }
  };

  const updateTablet = async (id, updatedTablet) => {
    try {
      const response = await axios.put(`http://localhost:5000/update-expense/${id}`, updatedTablet);
      setTablets(tablets.map((tablet) => (tablet._id === id ? response.data.updatedExpense : tablet)));
    } catch (error) {
      console.error("Error updating tablet:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const sortByTime = () => {
    const sortedTablets = [...tablets].sort((a, b) => a.time.localeCompare(b.time));
    setTablets(sortedTablets);
  };
  const checkTabletsTime = () => {
    const currentTime = new Date();
    console.log('inside', tablets)
    tablets.forEach((tablet) => {
      const tabletTime = new Date(currentTime.toDateString() + ' ' + tablet.time);
      const timeDiff = tabletTime - currentTime;
      console.log(timeDiff)
      if (timeDiff > 0 && timeDiff < 1000) { 
          alert(`Time's up`);
      }
    });
  };

  return (
    <div className="tablet-list">
      <div>
        <h2>Tablet List</h2>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={newTablet.Name}
            onChange={(e) => setNewTablet({ ...newTablet, Name: e.target.value })}
          />
        </div>
        <div>
          <label>Dosage:</label>
          <input
            type="text"
            value={newTablet.Dosage}
            onChange={(e) => setNewTablet({ ...newTablet, Dosage: e.target.value })}
          />
        </div>
        <div>
          <label>Time:</label>
          <input
            type="time"
            value={newTablet.time}
            onChange={(e) => setNewTablet({ ...newTablet, time: e.target.value })}
          />
        </div>
        <button onClick={addTablet}>Add Tablet</button>
        <button onClick={sortByTime}>Sort by Time</button>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearch}
        />
        <ul>
          {tablets
            .filter((tablet) => tablet.Name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((tablet) => (
              <li key={tablet._id}>
                {tablet.Name} - Dosage: {tablet.Dosage} - Time: {tablet.time}
                <button onClick={() => deleteTablet(tablet._id)}>Delete</button>
                <button onClick={() => updateTablet(tablet._id, newTablet)}>Update</button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default TabletList;
