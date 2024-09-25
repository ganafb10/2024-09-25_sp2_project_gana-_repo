const BASE_URL = 'https://api.noroff.dev/api/v1';
const LOGIN_URL = `${BASE_URL}/auction/auth/login`;

document.querySelector('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.querySelector('#loginEmail').value;
    const password = document.querySelector('#loginPassword').value;

    const loginData = {
        email,
        password
    };

    try {
        const response = await fetch(LOGIN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });

        const data = await response.json();
        console.log('Parsed API response:', data);  

        if (response.ok) {
            if (data.accessToken) {
                
                localStorage.setItem('token', data.accessToken);  
                localStorage.setItem('username', data.name);  
                
                alert("Login successful!");
                window.location.href = "../dashboard/index.html";  
            } else {
                console.error("Access token not found in the response:", data);
                alert("Login successful, but no access token received.");
            }
        } else {
            console.error("Login failed:", data.message || "Unknown error");
            alert(data.message || "Login failed");
        }
    } catch (error) {
        console.error("Network or server error:", error);
        alert("An error occurred while logging in. Please try again later.");
    }
});
