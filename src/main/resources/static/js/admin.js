const usersUrl ="http://localhost:8080/api/users";
const rolesUrl ="http://localhost:8080/api/roles";
const authUrl = "http://localhost:8080/api/users/authentication";

const authData = document.getElementById('authData');
const homeTab= document.getElementById("home-tab");

const tableBody = document.querySelector("#AdminTable tbody");

//For edit user
const editUserId = document.getElementById('editUserId');
const editUserFirstName = document.getElementById('editUserFirstName');
const editUserLastName = document.getElementById('editUserLastName');
const editUserAge = document.getElementById('editUserAge');
const editUserEmail = document.getElementById('editUserEmail');
const editUserPassword = document.getElementById('editUserPassword');
const editUserRole = document.getElementById('editUserRole');

//For delete user
const deleteUserId = document.getElementById('deleteUserId');
const deleteUserFirstName = document.getElementById('deleteUserFirstName');
const deleteUserLastName = document.getElementById('deleteUserLastName');
const deleteUserAge = document.getElementById('deleteUserAge');
const deleteUserEmail = document.getElementById('deleteUserEmail');
const deleteUserRole = document.getElementById('deleteUserRole');

//For new user
const newUserName = document.getElementById('newUserName');
const newUserLastName = document.getElementById('newUserLastName');
const newUserAge = document.getElementById('newUserAge');
const newUserEmail = document.getElementById('newUserEmail');
const newUserPassword = document.getElementById('newUserPassword');

let temporary = "";
const temporaryRoles = document.getElementById('newUserRole')



document.addEventListener('DOMContentLoaded', function () {
    fillUserData();
    fillUsersTable();
    $('#deleteModal').on("hidden.bs.modal", function() {
        $(this).find('form').trigger('reset');
        deleteUserRole.innerHTML="";
    });

    $('#editModal').on("hidden.bs.modal", function() {
        $(this).find('form').trigger('reset');
        editUserRole.innerHTML="";
    });
});

fetch (rolesUrl)
    .then(res =>res.json())
    .then(data => fillSelect(data));

const fillSelect = (elements) => {
    elements.forEach(element => {
        let shortName = element.name.replace("ROLE_","");
        temporary += `
        <option value = "${element.name}">${shortName}</option>
        `;
    })
    temporaryRoles.innerHTML = temporary;
}

function rolesToString(el) {
    let arr = []
    el.roles.forEach(role => {
        arr.push(role.name.replace("ROLE_", ""));
    })
    return arr.join(" ");
}

async function fillUsersTable() {
    let tableRows = "";
    await fetch(usersUrl)
        .then(res => res.json())
        .then(obj => obj.forEach(user => {
        tableRows += `
            <tr data-id=${user.id}>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.lastName}</td>
            <td>${user.age}</td>
            <td>${user.email}</td>
            <td>${rolesToString(user)}</td>
            <td><button type="button" id = "buttonEdit" class="btn btn-info btn-sm" data-toggle="modal" 
            data-target="#editModal" onclick="fillModalEdit()">Edit</button></td>
            <td><button type="button" id = "buttonDelete" class="btn btn-danger btn-sm" data-toggle="modal"
            data-target="#deleteModal" onclick="fillModalDelete()">Delete</button></td>
            </tr>
            `;
    }));
    tableBody.innerHTML = tableRows;
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
// Fill edit modal window
function fillModalEdit() {
    const row = event.target.parentNode.parentNode;
    editUserId.value = row.children[0].innerHTML;
    editUserFirstName.value = row.children[1].innerHTML;
    editUserLastName.value = row.children[2].innerHTML;
    editUserAge.value = row.children[3].innerHTML;
    editUserEmail.value = row.children[4].innerHTML;
    editUserRole.innerHTML = temporary;
    document.getElementById("edit-button").addEventListener('click', editUserFunc, {once:true})
}
// Edit method
let editUserFunc = async function editUser() {
    let editUser = {
        id:editUserId.value,
        name:editUserFirstName.value,
        lastName:editUserLastName.value,
        age:editUserAge.value,
        email:editUserEmail.value,
        password:editUserPassword.value,
        roles:[]
    }

    for (let option of editUserRole.options) {
        if (option.selected) {
            await fetch(rolesUrl + '/' + option.value)
                .then(res => res.json())
                .then(role => editUser.roles.push(role));
        }
    }

    await fetch(usersUrl + '/' + editUserId.value, {
       method: 'PUT',
       headers: {
           'Content-Type': 'application/json'
       },
       body: JSON.stringify(editUser)
    });
    fillUsersTable();
    fillUserData();
    $('#editModal').modal('toggle');
}
// Add user method
async function addNewUser() {
    let newUser = {
        name:newUserName.value,
        lastName:newUserLastName.value,
        age:newUserAge.value,
        email:newUserEmail.value,
        password:newUserPassword.value,
        roles:[]
    }

    for (let option of temporaryRoles.options) {
        if (option.selected) {
            await fetch(rolesUrl + '/' + option.value)
                .then(res => res.json())
                .then(role => newUser.roles.push(role));
        }
    }

    await fetch(usersUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    });
    fillUsersTable();
    $('.add-user-form').trigger('reset');
    homeTab.click();
}

// Fill delete modal window
function fillModalDelete() {
    const row = event.target.parentNode.parentNode;
    deleteUserId.value = row.children[0].innerHTML;
    deleteUserFirstName.value = row.children[1].innerHTML;
    deleteUserLastName.value = row.children[2].innerHTML;
    deleteUserAge.value = row.children[3].innerHTML;
    deleteUserEmail.value = row.children[4].innerHTML;
    deleteUserRole.innerHTML = fillDeleteRoles(row.children[5].innerHTML);
    document.getElementById("delete-button").addEventListener('click', deleteUserFunc, {once:true})
}

function fillDeleteRoles (string) {
    let deleteRows = '';
    let splitString = string.split(" ");
    splitString.forEach(el => {
        deleteRows += `
        <option>${el}</option>
        `;
    })
    return deleteRows;
}
// Delete user method
let deleteUserFunc = async function deleteUser() {
    await fetch(usersUrl + '/' + deleteUserId.value, {
        method: 'DELETE',
        cache: 'reload',
        headers : {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(deleteUserId.value)
    })
    fillUsersTable();
    $('#deleteModal').modal('toggle');
}















