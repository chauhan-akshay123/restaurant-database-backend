let express = require("express");
let cors = require("cors");
let sqlite3 = require("sqlite3");
let { open } = require("sqlite");

let app = express();
let PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

let db;

// Initialize SQLite database connection
(async () => {
  db = await open({
    filename: "./Backend/database.sqlite",
    driver: sqlite3.Database,
  });
  console.log("Database connected.");
})();

// function to get all restaurants
async function fetchAllRestaurants(){
  let query = "SELECT * FROM restaurants";
  let response = await db.all(query, []);
  return { restaurants: response };
}

// Route to get all restaurants
app.get("/restaurants", async (req, res)=>{
 try{
  const results = await fetchAllRestaurants();
  
  if(results.restaurants.length === 0){
    res.status(404).json({ message: "No Restaurant Found" });
  }

  return res.status(200).json(results);
 } catch(error){
   res.status(500).json({ error: error.message });
 }
});

// function to fetch restaurants by id
async function fetchRestaurantById(id){
  let query = "SELECT * FROM restaurants  WHERE id = ?";
  let response = await db.all(query, [id]);
  return { restaurants: response };
}

// Route to get restaurants by Id
app.get("/restaurants/details/:id", async (req, res)=>{
 let id = parseInt(req.params.id);
 try{
  const results = await fetchRestaurantById(id);
  
  if(results.restaurants.length === 0){
    res.status(404).json({ message: "No Restaurants Found For the ID: " + id });
  }

  return res.status(200).json(results);
 } catch(error){
   res.status(500).json({ error: error.message });
 }
});

// function to fetch restaurants by cuisine
async function fetchRestaurantsByCuisine(cuisine){
  let query = "SELECT * FROM restaurants WHERE cuisine = ?";
  let response = await db.all(query, [cuisine]);
  return { restaurants: response };
}

// Route to fetch restaurants by cuisine
app.get("/restaurants/cuisine/:cuisine", async (req, res)=>{
 let cuisine = req.params.cuisine;
 try{
   const results = await fetchRestaurantsByCuisine(cuisine);
   
   if(results.restaurants.length === 0){
     res.status(404).json({ message: "No Restaurants found for this Cuisine: " + cuisine });
   }

  return res.status(200).json(results);
 } catch(error){
   res.status(500).json({ error: error.message });
 }
});

// function to get restaurants by filter
async function fetchRestaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury){
  let query = "SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?";
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
}

// Get Restaurants by Filter
app.get("/restaurants/filter", async (req, res)=>{
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;
  try{ 
    const results = await fetchRestaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury);
     
    if(results.restaurants.length === 0){
      res.status(404).json({ message: "No Restaurants found for this information" });
    }

  return res.status(200).json(results);
  } catch(error){
   res.status(500).json({ error: error.message });
  }
});

// function to Get Restaurants Sorted by Rating
async function sortByRating(){
  let query = "SELECT * FROM restaurants ORDER BY rating DESC";
  let response = await db.all(query, []);
  return { restaurants: response };
}

// Get Restaurants Sorted by Rating
app.get("/restaurants/sort-by-rating", async (req, res)=>{
 try{
   const results = await sortByRating();
   
   if(results.restaurants.length === 0){
     res.status(404).json({ message: "No restaurants found" });
   }

   return res.status(200).json(results);
 } catch(error){
   res.status(500).json({ error: error.message });
 }
});

// functio to fetch all dishes
async function fetchAllDishes(){
  let query = "SELECT * FROM dishes";
  let response = await db.all(query, []);
  return { dishes: response };
}

// Route to fetch all dishes
app.get("/dishes", async (req, res)=>{
 try{
  const results = await fetchAllDishes();
  
  if(results.dishes.length === 0){
    res.status(404).json({ message: "No dishes found" });
  }

  return res.status(200).json(results);
 } catch(error){
   res.status(500).json({ error: error.message });
 }
});

// function to get dish by id
async function getDishById(id){
  let query = "SELECT * FROM dishes WHERE id = ?";
  let response = await db.all(query, [id]);
  return { dishes: response };
}

// Route to get Dish by ID
app.get("/dishes/details/:id", async (req, res)=>{
 let id = parseInt(req.params.id);
 try{
   const results = await  getDishById(id);
   
   if(results.dishes.length === 0){
     res.status(404).json({ message: "No dishes found for the Id: " + id });
   }

   return res.status(200).json(results);
 } catch(error){
   res.status(500).json({ error: error.message });
 }
});

// function to get dishes by filter
async function fetchDishesByFilter(isVeg){
 let query = "SELECT * FROM dishes WHERE isVeg = ?";
 let response = await db.all(query, [isVeg]);
 return { dishes: response };
}

// Route to get Dishes by Filter
app.get("/dishes/filter", async (req, res)=>{
 let isVeg = req.query.isVeg;
 try{
   const results = await  fetchDishesByFilter(isVeg);
   
   if(results.dishes.length === 0){
     res.status(404).json({ message: "No dishes found fo this filter" });
   }

   return res.status(200).json(results);
 } catch(error){
   res.status(500).json({ error: error.message });
 }
});

// function to get dishes sorted by price
async function sortDishesByPrice(){
  let query = "SELECT * FROM dishes ORDER BY price ASC";
  let response = await db.all(query, []);
  return { dishes: response };
}

// Route to get Dishes Sorted by Price
app.get("/dishes/sort-by-price", async (req, res)=>{
 try{
    const results = await sortDishesByPrice();
   
    if(results.dishes.length === 0){
      res.status(404).json({ message: "no dishes found" });
    }

    return res.status(200).json(results);
 } catch(error){
   res.status(500).json({ error: error.message });
 }
});

// Start server
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));