
//  select item 
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitButton = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list  = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

/// edit option  

let editElement ;
let editFlag = false;
let editId="";

///   event listenrs  

//  submit form
form.addEventListener('submit', addItem );

//  clear items 
clearBtn.addEventListener('click',clearItems);

//  load items 
window.addEventListener('DOMContentLoaded', setupItems);

///   functions
function addItem(e){
    e.preventDefault();
    const value = grocery.value;
    if(!value){
        console.log(` value is truthy `);
    }
    const id = new Date().getTime().toString();
    // console.log(id);
    if(value && !editFlag){
        createListItems(id,value);

        //display alert
        displayAlert('item added to the list' , 'success');
        
        // show container
        container.classList.add('show-container');

        // add to localstorae 
        addToLocalstorage(id,value);

        // set back to default
        setBackToDefault();

    }else if(value&& editFlag  ){
        // console.log(` editing `);
        editElement.innerHTML = value;
        displayAlert('value changed ' , 'success')
        // edit localstorage
        editLocalStorage(editId , value);

        setBackToDefault();

    }else{
        displayAlert('please enter value ', 'danger')
    }
}

//  display  alert
function displayAlert(text,action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    //  remove alert 
    setTimeout(function(){
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    },1000);
}

//  clear items 

function clearItems(){
    const items = document.querySelectorAll('.grocery-item');
    if(items.length > 0){
        items.forEach(function(item){
            list.removeChild(item);
        });
    }
    container.classList.remove('show-container');
    displayAlert("empty list" , "danger");
    setBackToDefault();
    localStorage.removeItem('list');
}
//  edit function 
function editItem(e){
    // console.log('item  ideted');
    const element = e.currentTarget.parentElement.parentElement;
    // SET edit item 
    editElement   = e.currentTarget.parentElement.previousElementSibling;

    console.log(editElement);
    // set form value 
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editId = element.dataset.id;

    submitButton.textContent = "edit";

}

//  delete function 
function deleteItem(e){
    //console.log('item deleted');
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if(list.children === 0){
        container.classList.remove('show-container');
    }
    displayAlert("item removed" , 'danger');
    setBackToDefault();
    // remove from localstorage 
    removeFromLocalStorage(id);
}
//  set  back to  defaut  

function setBackToDefault (){
    // console.log(` set back to default `);
    grocery.value = "";
    editFlag= false;
    editId = "";
    submitButton.textContent = "submit";
}
///   localstorage

function addToLocalstorage(id,value){
    const grocery = {id , value };
    //console.log(grocery);
    let items =  getLocalStorage();
    // console.log(items);
    localStorage.setItem('list', JSON.stringify(items));

}
function removeFromLocalStorage (id){
    let items = getLocalStorage();

    items.filter(function(item){
        if(item.id !== id) {
            return item;
            
        }
    });
    localStorage.setItem("list" , JSON.stringify(items));
}

function editLocalStorage( id ,value ){
    let items = getLocalStorage();
    items = items.map(function(item){
        if(item.value === id){
            item.value = value;
        }
        return item;
    });
    localStorage.setItem("list " , JSON.stringify(items));
}
function getLocalStorage(){
    return localStorage.getItem("list") ? 
    JSON.parse(localStorage.getItem('list')): [];
    
}
// localstorage Api 

// set item 

// get item 

// remove item 

// // save as  strings
// localStorage.setItem("orange",JSON.stringify(['item','item2']));

// const oranges = JSON.parse(localStorage.getItem("orange"));
// console.log(oranges);

// localStorage.removeItem('orange');

///   setupitems 
function setupItems(){
    let items = getLocalStorage();
    if(items.length > 0){
        items.forEach(function(item){
            createListItems(item.id , item.value);
        })
        container.classList.add('show-container');
    }
}

function createListItems(id,value){
    const element = document.createElement('article');
        // add class
        element.classList.add('grocery-item');
        // add id 
        const attr =  document.createAttribute("data-id");
        attr.value = id;

        element.setAttributeNode(attr);
        
        element.innerHTML = `  <p class="title"> ${value} </p>
        <div class="btn-container">
            <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
            </button>

            <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
            </button>
        </div>`;

        const deleteBtn = element.querySelector('.delete-btn');
        const editBtn = element.querySelector('.edit-btn');
        
        deleteBtn.addEventListener('click',deleteItem);
        editBtn.addEventListener('click',editItem);

        //  append child 
        list.appendChild(element);
    
}