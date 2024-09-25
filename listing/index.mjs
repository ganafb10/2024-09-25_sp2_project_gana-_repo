const BASE_URL = "https://api.noroff.dev/api/v1";
const Listings_URL = `${BASE_URL}/auction/listings`;

// DOM Elements
const listingsGrid = document.getElementById("listingsGrid");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

// Fetch all listings and display them
async function fetchListings(query = "") {
  try {
    // Show loading while fetching
    listingsGrid.innerHTML = `<div class="text-center"><p>Loading listings...</p></div>`;

    // Fetch data with optional search query
    const response = await fetch(`${Listings_URL}?_active=true&_tag=${query}`);
    if (!response.ok) throw new Error("Failed to fetch listings");

    const listings = await response.json();
    console.log(listings, listings.length);

    if (listings.length === 0) {
      listingsGrid.innerHTML = `<div class="text-center"><p>No listings found.</p></div>`;
      return;
    }

    // Render listings to the page
    renderListings(listings);
  } catch (error) {
    listingsGrid.innerHTML = `<div class="alert alert-danger text-center">${error.message}</div>`;
  }
}

// Render fetched listings into HTML
function renderListings(listings) {
  listingsGrid.innerHTML = ""; // Clear previous content
  listings.forEach((listing) => {
    const listingCard = document.createElement("div");
    listingCard.classList.add("col-md-4", "mb-4");

    // Create listing card HTML
    listingCard.innerHTML = `
            <div class="card h-100">
                <img src="${
                  listing.media[0] || "https://via.placeholder.com/300x200"
                }" class="card-img-top" alt="${listing.title}">
                <div class="card-body">
                    <h5 class="card-title">${listing.title}</h5>
                    <p class="card-text">${listing.description}</p>
                </div>
                <div class="card-footer d-flex justify-content-between align-items-center">
                    <span>Current Bid: ${
                      listing?.bids?.length > 0
                        ? listing.bids[listing.bids.length - 1].amount
                        : "No Bids Yet"
                    }</span>
                    <a href="listingDetail.html?id=${
                      listing.id
                    }" class="btn btn-primary btn-sm">View Listing</a>
                </div>
            </div>
        `;

    listingsGrid.appendChild(listingCard);
  });
}

// Search listings based on user input
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  fetchListings(query);
});

// Initial load of all active listings
fetchListings();
