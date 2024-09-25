
const BASE_URL = 'https://api.noroff.dev/api/v1';
const REGISTER_URL = `${BASE_URL}/auction/auth/register`;

document.querySelector('#registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.querySelector('#email').value;
    const name = document.querySelector('#name').value;
    const password = document.querySelector('#password').value;
    const confirmPassword = document.querySelector('#confirmPassword').value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const user = {
        email,
        name,
        password
    };

    try {
        const response = await fetch(REGISTER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        const data = await response.json();

        if (response.ok) {
            alert("Registration successful!");
            window.location.href = "../login/index.html";
        } else {
            alert(data.message || "Registration failed");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});
