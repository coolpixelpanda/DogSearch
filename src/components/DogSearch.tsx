import React, { useState, useEffect } from "react";
import axios from "axios";
import Logout from "./Logout";

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

const DogSearch = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("breed:asc");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [breedFilter, setBreedFilter] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);

  const fetchDogs = async () => {
    try {
      setLoading(true);
      const searchResponse = await axios.get(
        "https://frontend-take-home-service.fetch.com/dogs/search",
        {
          params: {
            size: 28,
            sort,
            breeds: breedFilter ? [breedFilter] : [],
            from: (page - 1) * 28,
          },
          withCredentials: true,
        }
      );

      const { resultIds } = searchResponse.data;

      if (!resultIds || resultIds.length === 0) {
        setDogs([]);
        setLoading(false);
        return;
      }

      // Fetch full dog objects
      const dogResponse = await axios.post(
        "https://frontend-take-home-service.fetch.com/dogs",
        resultIds,
        { withCredentials: true }
      );

      setDogs(dogResponse.data);
      console.log(dogResponse.data);
    } catch (error) {
      console.error("Error fetching dogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDogs();
  }, [page, sort, breedFilter]);

  const toggleFavorite = (id: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(id)
        ? prevFavorites.filter((favId) => favId !== id)
        : [...prevFavorites, id]
    );
  };

  const findMatch = async () => {
    if (favorites.length === 0) {
      alert("Please add at least one dog to favorites before matching!");
      return;
    }

    try {
      const matchResponse = await axios.post(
        "https://frontend-take-home-service.fetch.com/dogs/match",
        favorites, // Send the favorite dog IDs
        { withCredentials: true }
      );

      const matchedDogId = matchResponse.data.match; // API returns the matched dog's ID

      // Fetch the matched dog's full details
      const dogResponse = await axios.post(
        "https://frontend-take-home-service.fetch.com/dogs",
        [matchedDogId], // Fetch details of matched dog
        { withCredentials: true }
      );

      setMatchedDog(dogResponse.data[0]); // Store matched dog details
    } catch (error) {
      console.error("Error fetching match:", error);
    }
  };

  return (
    <div className="container mx-auto p-10 min-w-screen">
      <div className="flex justify-between items-center mb-4 p-5">
        <button
          onClick={() => setSort(sort === "breed:asc" ? "breed:desc" : "breed:asc")}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Sort by Breed ({sort === "breed:asc" ? "Ascending" : "Descending"})
        </button>
        <p className="text-white text-7xl font-bold font-serif">Shelters</p>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Filter by breed"
            value={breedFilter}
            onChange={(e) => setBreedFilter(e.target.value)}
            className="p-2 border rounded"
          />

          <Logout />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading dogs...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 p-10">
          {dogs.map((dog) => (
            <div key={dog.id} className="bg-white p-4 rounded shadow text-black">
              <img
                src={dog.img}
                alt={dog.name}
                className="w-full h-80 object-cover rounded mb-4"
              />
              <h3 className="text-lg font-semibold">{dog.name}</h3>
              <p>Breed: {dog.breed}</p>
              <p>Age: {dog.age}</p>
              <p>Zip Code: {dog.zip_code}</p>
              <button
                onClick={() => toggleFavorite(dog.id)}
                className={`p-2 mt-4 ${
                  favorites.includes(dog.id) ? "bg-red-500" : "bg-gray-500"
                } text-white rounded`}
              >
                {favorites.includes(dog.id) ? "Remove from Favorites" : "Add to Favorites"}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="p-2 bg-gray-500 text-white rounded"
        >
          Previous
        </button>
        <button onClick={() => setPage(page + 1)} className="p-2 bg-gray-500 text-white rounded">
          Next
        </button>
      </div>

      {/* Match Button */}
      <div className="mt-6 text-center">
        <button onClick={findMatch} className="p-3 bg-green-500 text-white rounded">
          Find Your Best Match 🐶
        </button>
      </div>

      {/* Show Matched Dog */}
      {matchedDog && (
        <div className="mt-8 p-6 rounded shadow-md text-center h-80">
          <h2 className="text-2xl font-bold text-white-900">Your Best Match!</h2>
          <div className="flex justify-center items-center">
            <img
              src={matchedDog.img}
              alt={matchedDog.name}
              className="w-150 h-120 object-cover rounded my-4"
            />          
          </div>
          <h3 className="text-lg font-semibold">{matchedDog.name}</h3>
          <p>Breed: {matchedDog.breed}</p>
          <p>Age: {matchedDog.age}</p>
          <p>Zip Code: {matchedDog.zip_code}</p>
        </div>
      )}
    </div>
  );
};

export default DogSearch;
