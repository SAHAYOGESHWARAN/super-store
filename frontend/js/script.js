document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.status === 200) {
        localStorage.setItem('token', data.token);
        window.location.href = 'admin.html'; // Or user page based on role
    } else {
        document.getElementById('loginError').innerText = data.message;
    }
});
