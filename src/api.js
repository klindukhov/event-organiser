export default async function apiFetch(path, method = 'GET', body, contentType) {
    const requestOptions = {
        method: method,
        redirect: 'follow',
        credentials: 'include'
    };

    if (method !== 'GET') {
        requestOptions.body = body;
        let myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        if (contentType) {
        } else {
            myHeaders.append("Content-Type", "application/json");
        }
        requestOptions.headers = myHeaders;

    }

    const response = await fetch(`http://localhost:8080/api/${path}`, requestOptions)

    if (!response.ok || response.status === 500) {
        throw new Error(`${response.status + response.statusText}`);
    } else if (method === "POST" || method === "DELETE") {
        return response;
    }else {
        return response.json();        
    }
}