const apiBaseUrl = "https://sanhue903.pythonanywhere.com";
const callInit = {
    method: 'GET',
    credentials: 'include',
};

export const fetchRegister = async (_email, _password, _confirm_password) => {

    const response = await fetch(`${apiBaseUrl}/auth/signup/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: _email, password: _password, confirm_password: _confirm_password})
    })

    return response
}

export const fetchLogin = async (_email, _password) => {

    const response = await fetch(`${apiBaseUrl}/auth/login/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: _email, password: _password})
    })

    return response;
}

export const fetchLogout = async () => {
    const response = await fetch(`${apiBaseUrl}/auth/logout/`, {
        method: 'GET',
        credentials: 'include'
    }) 

    return response;
}

const fetchData = async (url) => {

    console.log(`start fetching data from: ${url}`);
    const response = await fetch(url, callInit);
    console.log(`finished fetching data from: ${url}`, 'status code: '+response.status);

    return response;
}

export const fetchProfile = async () => {
    const response = await fetchData(`${apiBaseUrl}/auth/profile/`);
    return response
}

export const fetchAppMobileData = async () => {
    const response = await fetchData(`${apiBaseUrl}/apps/BOTIQI/`);
    return response;
};
 
export const fetchAllStudentsData = async () => {
     const response = await fetchData(`${apiBaseUrl}/apps/BOTIQI/students/`);
    return response;
};

export const fetchStudentData = async (studentId) => {
     const response = await fetchData(`${apiBaseUrl}/apps/BOTIQI/students/${studentId}/`, callInit);
    return await response;
};

export const fetchAllSessionsData = async () => {
    const response = await fetchData(`${apiBaseUrl}/apps/BOTIQI/students/scores/`, callInit);
    return await response;
};

export const fetchStudentSessionsData = async (studentId) => {
    const response = await fetchData(`${apiBaseUrl}/apps/BOTIQI/students/${studentId}/scores/`, callInit);
    return await response;
};