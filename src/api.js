export default async function apiFetch(path, method = 'GET', body) {
    const requestOptions = {
        method: method,
        redirect: 'follow',
        credentials: 'include'
    };

    if(method !== 'GET'){
        requestOptions.body = body;
        let myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        requestOptions.headers = myHeaders;

    }

    const response = await fetch(`http://localhost:8080/api/${path}`, requestOptions)

    if(!response.ok){
        throw new Error(`${response.status + response.statusText}`);
    }else if(method === "POST"){
        return response;
    }else{
        return response.json();
    }
}