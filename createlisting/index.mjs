
const BASE_URL = 'https://api.noroff.dev/api/v1';
const Create_Listing_URL = `${BASE_URL}/auction/listings`;


const createListingForm = document.getElementById('createListingForm');
const formAlert = document.getElementById('formAlert');


async function createListing(listingData) {
    try {
        const response = await fetch(Create_Listing_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                
                 'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(listingData),
        });

        if (!response.ok) throw new Error('Failed to create listing');

        const data = await response.json();
        formAlert.innerHTML = `<div class="alert alert-success">Listing created successfully!</div>`;
        createListingForm.reset(); 
    } catch (error) {
        formAlert.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }
}


createListingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const media = document.getElementById('media').value.trim();
    const endDate = document.getElementById('endDate').value;

    if (!title || !description || !endDate) {
        formAlert.innerHTML = `<div class="alert alert-danger">Please fill in all required fields.</div>`;
        return;
    }

    
    const listingData = {
        title,
        description,
        media: media ? [media] : [], 
        endsAt: new Date(endDate).toISOString()  
    };

    
    createListing(listingData);
});
