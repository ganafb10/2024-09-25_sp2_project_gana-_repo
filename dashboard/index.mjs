const BASE_URL = 'https://api.noroff.dev/api/v1';
const Listings_URL = `${BASE_URL}/auction/listings?_seller=`;
const Single_Profile_URL = `${BASE_URL}/auction/profiles/`;
const Delete_Listing_URL = `${BASE_URL}/auction/listings/`;

// Fetch the token and username from localStorage after login
const token = localStorage.getItem('accessToken');  // Updated to 'accessToken' as per the corrected login version
const username = localStorage.getItem('username');  // Username saved from login

// DOM Elements
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userCredits = document.getElementById('userCredits');
const userAvatar = document.getElementById('userAvatar');
const listingsContainer = document.getElementById('listingsContainer');
const messageContainer = document.getElementById('messageContainer');

// Fetch user profile data
async function fetchUserProfile() {
    try {
        const response = await fetch(`${Single_Profile_URL}${username}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error('Failed to fetch profile data');

        const userProfile = await response.json();
console.log("user")
        // Populate user info on the page
        userName.textContent = userProfile.name;
        userEmail.textContent = userProfile.email;
        userCredits.textContent = `Credits: ${userProfile.credits}`;
        userAvatar.src = userProfile.avatar || 'https://via.placeholder.com/150';

        // Fetch user listings after profile data is loaded
        fetchUserListings();
    } catch (error) {
        messageContainer.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
        console.error("Error fetching profile:", error);
    }
}

// Fetch user listings (items created by the logged-in user)
async function fetchUserListings() {
    try {
        const response = await fetch(`${Listings_URL}${username}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error('Failed to fetch user listings');

        const listings = await response.json();

        if (listings.length === 0) {
            listingsContainer.innerHTML = `<div class="alert alert-warning">You have no active listings.</div>`;
            return;
        }

        // Clear existing listings
        listingsContainer.innerHTML = "";

        // Display each listing in a card format
        listings.forEach(listing => {
            const listingCard = document.createElement('div');
            listingCard.classList.add('col-md-4', 'mb-4');

            // Listing card HTML
            listingCard.innerHTML = `
                <div class="card h-100">
                    <img src="${listing.media[0] || 'https://via.placeholder.com/300x200'}" class="card-img-top" alt="${listing.title}">
                    <div class="card-body">
                        <h5 class="card-title">${listing.title}</h5>
                        <p class="card-text">${listing.description.substring(0, 100)}...</p>
                        <p class="card-text">Current Bid: ${listing.bids.length > 0 ? listing.bids[listing.bids.length - 1].amount : 'No Bids'}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <a href="listingDetail.html?id=${listing.id}" class="btn btn-primary btn-sm">View</a>
                        <button class="btn btn-danger btn-sm" onclick="deleteListing('${listing.id}')">Delete</button>
                    </div>
                </div>
            `;

            listingsContainer.appendChild(listingCard);
        });
    } catch (error) {
        listingsContainer.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
        console.error("Error fetching listings:", error);
    }
}

// Delete a listing
async function deleteListing(listingId) {
    try {
        const response = await fetch(`${Delete_Listing_URL}${listingId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error('Failed to delete listing');

        // Fetch listings again after a successful delete
        fetchUserListings();
    } catch (error) {
        messageContainer.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
        console.error("Error deleting listing:", error);
    }
}

// Fetch user profile and listings on page load
if (token && username) {
    fetchUserProfile();  // Fetch user profile and listings if authenticated
} else {
    messageContainer.innerHTML = `<div class="alert alert-danger">You must be logged in to view this page.</div>`;
    window.location.href = '../login/index.html';  // Redirect to login if not authenticated
}
