async function apiGet(path) {
    const requestOptions = {
        method: 'GET',
        redirect: 'follow',
        credentials: 'include'
    };

    const response = await fetch(`http://localhost:8080/${path}`, requestOptions)

    return response.json();
}