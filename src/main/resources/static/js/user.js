const authUrl = "http://localhost:8080/api/users/authentication";

const authData = document.getElementById('authData');
const tableBody = document.querySelector("#UserTable tbody");

document.addEventListener('DOMContentLoaded', function () {
    fillUserData();
    fillUserTable();
});

function rolesToString(el) {
    let arr = []
    el.roles.forEach(role => {
        arr.push(role.name.replace("ROLE_", ""));
    })
    return arr.join(" ");
}

async function fillUserTable() {
    let tableRow = "";
    await fetch(authUrl).then(res => res.json()).then(user => {
        tableRow += `
            <tr data-id=${user.id}>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.lastName}</td>
            <td>${user.age}</td>
            <td>${user.email}</td>
            <td>${rolesToString(user)}</td>
            </tr>
            `;
    });
    tableBody.innerHTML = tableRow;
}

async function fillUserData() {
    let userData = '';
    await fetch(authUrl).then(res => res.json()).then(user => {
        userData = `
            <li class="list-inline-item"><b>${user.email}</b></li>
            <li class="list-inline-item">with roles:</li>
            <li class="list-inline-item">${rolesToString(user)}</li>
            `;
    });
    authData.innerHTML = userData;
}


