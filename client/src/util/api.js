export const getPlacesInfo = async (type, lat, lng) => {
  const url = `https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary?tr_longitude=${
    lng + 0.011
  }&tr_latitude=${lat + 0.009}&bl_longitude=${lng - 0.011}&bl_latitude=${
    lat - 0.009
  }&currency=USD&lunit=km&lang=en_US`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.REACT_RAPID_API_KEY,
      "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
    },
  };

  try {
    console.log("Checking cache for location...");
    const check = await fetch(
      `http://localhost:3001/api/placesCache/${lat}/${lng}/${type}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    console.log(`Cache check status: ${check.status}`);

    if (check.status === 204) {
      console.log("Location not cached, fetching from external API...");
      const response = await fetch(url, options);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(`External API error: ${result.message}`);
      }

      console.log("Fetched data from external API:", result);

      await fetch("http://localhost:3001/api/placesCache", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          places: result.data,
          type: type,
          lat: lat,
          lng: lng,
        }),
      });

      return result.data;
    } else if (check.status === 200) {
      const data = await check.json();
      console.log("Retrieved data from cache:", data);
      return data;
    } else {
      throw new Error(`Unexpected cache check status: ${check.status}`);
    }
  } catch (error) {
    console.error("Error fetching places info:", error);
    throw new Error("Unable to fetch places information");
  }
};

export const getPlanInfo = async (planCode) => {
  try {
    const response = await fetch(`http://localhost:3001/api/plan/${planCode}`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch plan info");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching plan:", error);
  }
};
