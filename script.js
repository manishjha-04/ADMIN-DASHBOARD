

let data = []; 
let filteredData = []; 
let currentPage = 1; 
let rowsPerPage = 10; 
let totalPages = 0; 

async function fetchData() {
    let response = await fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json");
    let json = await response.json();
    data = json;
    filteredData = data; 
    totalPages = Math.ceil(data.length / rowsPerPage); 
    displayData(); 
    displayPagination(); 
}

function displayData() {
    let tableBody = document.getElementById("table-body"); 
    tableBody.innerHTML = ""; 
    let start = (currentPage - 1) * rowsPerPage; 
    let end = Math.min(start + rowsPerPage, filteredData.length); 
    for (let i = start; i < end; i++) { 
        let row = document.createElement("tr"); 
        row.setAttribute("data-id", filteredData[i].id); 

        let selectCell = document.createElement("td"); 

        let selectInput = document.createElement("input"); 

        selectInput.type = "checkbox"; 
        selectInput.addEventListener("change", handleSelect); 

        selectCell.appendChild(selectInput); 
        row.appendChild(selectCell); 

        let nameCell = document.createElement("td"); 

        nameCell.textContent = filteredData[i].name; 
        row.appendChild(nameCell); 
        let emailCell = document.createElement("td"); 
        emailCell.textContent = filteredData[i].email; 

        row.appendChild(emailCell); 
        let roleCell = document.createElement("td"); 

        roleCell.textContent = filteredData[i].role; 
        row.appendChild(roleCell); 

        let actionCell = document.createElement("td"); 
        let editButton = document.createElement("button"); 


        editButton.textContent = "Edit"; 
        editButton.className = "action-button edit"; 
        editButton.addEventListener("click", handleEdit); 


        actionCell.appendChild(editButton); 
        let deleteButton = document.createElement("button"); 
        deleteButton.textContent = "Delete"; 


        deleteButton.className = "action-button delete"; 
        deleteButton.addEventListener("click", handleDelete); 
        actionCell.appendChild(deleteButton); 
        row.appendChild(actionCell); 
        tableBody.appendChild(row); 
    }
}

function displayPagination() {
    let pagination = document.getElementById("pagination"); 
    pagination.innerHTML = ""; 
    let firstPageButton = document.createElement("button"); 
    firstPageButton.textContent = "<<"; 
    firstPageButton.className = "page-button first-page"; 
    firstPageButton.addEventListener("click", handleFirstPage); 
    if (currentPage == 1) { 

        firstPageButton.classList.add("disabled"); 
    }
    pagination.appendChild(firstPageButton); 
    let previousPageButton = document.createElement("button"); 
    previousPageButton.textContent = "<"; 
    previousPageButton.className = "page-button previous-page"; 
    previousPageButton.addEventListener("click", handlePreviousPage); 

    if (currentPage == 1) { 
        previousPageButton.classList.add("disabled"); 
    }
    pagination.appendChild(previousPageButton); 

for (let i = 1; i <= totalPages; i++) {
let pageButton = document.createElement("button"); 
pageButton.textContent = i; 

pageButton.className = "page-button"; 
if (i === currentPage) { 
pageButton.classList.add("active"); 
}
pageButton.addEventListener("click", () => handlePage(i)); 

pagination.appendChild(pageButton); 
}

let nextPageButton = document.createElement("button"); 
nextPageButton.textContent = ">"; 
nextPageButton.className = "page-button next-page"; 
nextPageButton.addEventListener("click", handleNextPage); 

if (currentPage === totalPages) { 
nextPageButton.classList.add("disabled"); 
}
pagination.appendChild(nextPageButton); 

let lastPageButton = document.createElement("button"); 
lastPageButton.textContent = ">>"; 
lastPageButton.className = "page-button last-page"; 
lastPageButton.addEventListener("click", handleLastPage); 

if (currentPage === totalPages) { 
lastPageButton.classList.add("disabled"); 
}
pagination.appendChild(lastPageButton); 
}

function handleSelect(event) {
let row = event.target.closest("tr"); 
if (event.target.checked) {
row.classList.add("selected"); 
} else {
row.classList.remove("selected"); 
}
}

document.getElementById("select-all").addEventListener("change", function () {
let checkboxes = document.querySelectorAll("#table-body input[type='checkbox']");
checkboxes.forEach(checkbox => {
checkbox.checked = this.checked;
handleSelect({ target: checkbox });
});
});

function handleEdit(event) {
let row = event.target.closest("tr"); 
let id = row.getAttribute("data-id"); 
let dataItem = data.find(item => item.id === id); 
let nameCell = row.querySelector("td:nth-child(2)"); 
nameCell.innerHTML = `<input type="text" value="${dataItem.name}" class="edit-input">`; 

let emailCell = row.querySelector("td:nth-child(3)"); 
emailCell.innerHTML = `<input type="text" value="${dataItem.email}" class="edit-input">`; 

let roleCell = row.querySelector("td:nth-child(4)"); 
roleCell.innerHTML = `<input type="text" value="${dataItem.role}" class="edit-input">`; 

let actionCell = row.querySelector("td:nth-child(5)"); 
let saveButton = document.createElement("button"); 
saveButton.textContent = "Save"; 
saveButton.className = "action-button save"; 
saveButton.addEventListener("click", () => handleSave(id, row)); 
actionCell.innerHTML = ""; 
actionCell.appendChild(saveButton); 
}

function handleSave(id, row) {
let nameInput = row.querySelector("td:nth-child(2) input"); 
let emailInput = row.querySelector("td:nth-child(3) input"); 
let roleInput = row.querySelector("td:nth-child(4) input"); 
let updatedData = {
id: id,
name: nameInput.value,
email: emailInput.value,
role: roleInput.value
};
let dataIndex = data.findIndex(item => item.id === id); 
data[dataIndex] = updatedData; 
filteredData = data; 
displayData(); 
displayPagination(); 
}

function handleDelete(event) {
let row = event.target.closest("tr"); 
let id = row.getAttribute("data-id"); 
let dataIndex = data.findIndex(item => item.id === id); 
data.splice(dataIndex, 1); 
filteredData = data; 
displayData(); 
displayPagination(); 
}

function handlePage(pageNumber) {
currentPage = pageNumber; 
displayData(); 
displayPagination(); 
}

function handleFirstPage() {
if (currentPage !== 1) {
currentPage = 1; 
displayData(); 
displayPagination(); 
}
}

function handlePreviousPage() {
if (currentPage > 1) {
currentPage--; 
displayData(); 
displayPagination(); 
}
}

function handleNextPage() {
if (currentPage < totalPages) {
currentPage++; 
displayData(); 
displayPagination(); 
}
}

function handleLastPage() {
if (currentPage !== totalPages) {
currentPage = totalPages; 
displayData(); 
displayPagination(); 
}
}

document.getElementById("search-icon").addEventListener("click", handleSearch);

document.getElementById("search-input").addEventListener("keyup", function (event) {
if (event.key === "Enter") {
handleSearch();
}
});

function handleSearch() {
let searchInput = document.getElementById("search-input"); 
let searchTerm = searchInput.value.toLowerCase(); 
filteredData = data.filter(item => 
item.name.toLowerCase().includes(searchTerm) ||
item.email.toLowerCase().includes(searchTerm) ||
item.role.toLowerCase().includes(searchTerm)
);
currentPage = 1; 
totalPages = Math.ceil(filteredData.length / rowsPerPage); 
displayData(); 
displayPagination(); 
}

document.getElementById("delete-selected").addEventListener("click", handleBulkDelete);

function handleBulkDelete() {
let selectedRows = document.querySelectorAll("#table-body tr.selected"); 
selectedRows.forEach(row => {
let id = row.getAttribute("data-id"); 
let dataIndex = data.findIndex(item => item.id === id); 
data.splice(dataIndex, 1); 
});
filteredData = data; 
displayData(); 
displayPagination(); 
}

document.getElementById("bulk-delete").addEventListener("click", handleBulkDelete);

fetchData();
