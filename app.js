//Storage Controller
const StorageCtrl = (function(){
  //Public Methods
  return {
    storeItem : function(item){
      let items = [];

      //Check if any items in ls
      if(localStorage.getItem('items') === null){
        items = [];

        //Push new item to array
        items.push(item);

        //Set item in local storage
        localStorage.setItem('items' , JSON.stringify(items));
      }else{
        items = JSON.parse(localStorage.getItem('items'));
        
        //Push new item
        items.push(item);

        //Reset LS
        localStorage.setItem('items' , JSON.stringify(items));
      }
    },
    getItemsFromLS : function(){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
      }else{
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage : function(updatedItem){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach((item , index) => { 
        if(updatedItem.id === item.id){
          items.splice(index , 1 , updatedItem);
        }
      });

      localStorage.setItem('items' , JSON.stringify(items));
    },
    deleteItemFromStorage : function(itemToDelete){

      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach((item , index) => {
        if(item.id === itemToDelete.id){
          items.splice(index , 1);
        }
      });

      localStorage.setItem('items' , JSON.stringify(items));
    },
    clearAllItemsFromStorage : function(){
      localStorage.removeItem('items');
    }
  }
})();

//Item Controller
const itemCtrl = (function() {
  //Item Constructor
  const item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  //Data Structure / State
  const data = {
    // item: [
    //   // { id: 0, name: "Steak Dinner", calories: 1200 },
    //   // { id: 1, name: "Cookie", calories: 400 },
    //   // { id: 2, name: "Eggs", calories: 300 }
    // ],
    item: StorageCtrl.getItemsFromLS(),
    currentItem: null,
    totalCalories: 0
  };

  //Public Methods
  return {
    getItems: function() {
      return data.item;
    },
    addItem : function(name , calories){
        let ID;
        //Create ID
        if(data.item.length > 0){
          ID = data.item[data.item.length - 1].id + 1;
        }else{
          ID = 0;
        }

        //Calories to number
        calories = parseInt(calories);

        //Create new item
        const newItem = new item(ID , name , calories);

        //Add the newItem to items array
        data.item.push(newItem);

        return newItem;
    },
    getItemById : function(id){
      let found = null;
      //Loop through items
      data.item.forEach((item) =>{
        if(item.id == id){
          found = item;
        }
      });
      return found;
    },
    updateItem : function(name , calories){
      //Calories to number
      calories = parseInt(calories);

      let found = null;

      data.item.forEach((item) => {
        if(item.id === data.currentItem.id){
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem : function(id){
      //Get IDs
      const ids = data.item.map(function(item){
        return item.id;
      });

      //Get Index
      const Index = ids.indexOf(id);

      //Remove Item
      data.item.splice(Index , 1);
    },
    clearAllItems: function(){
      data.item = [];
    },
    setCurrentItem : function(item){
      data.currentItem = item;
    },
    getCurrentItem : function(){
      return data.currentItem;
    },
    getTotalCalories : function(){
      let total = 0;

      data.item.forEach(function(item){
        total += item.calories;
      });

      //Set total cal in data structure
      data.totalCalories = total;

      return data.totalCalories;
    },
    logData: function() {
      return data;
    }
  };
})();
//UI Controller
const UICtrl = (function() {

  const UISelectors = {
    itemList : '#item-list',
    listItems : '#item-list li',
    addBtn : '.add-btn',
    updateBtn : '.update-btn',
    deleteBtn : '.delete-btn',
    backBtn : '.back-btn',
    clearBtn : '.clear-btn',
    name : '#item-name',
    calories : '#item-calories',
    totalCalories : '.total-calories'
  }
  //Public Methods
  return {
    populateItemsList: function(items) {
      let html = "";

      items.forEach(item => {
        html += `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                </li>
         `;
      });

      //Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput : function(){
      return {
        name : document.querySelector(UISelectors.name).value,
        calories : document.querySelector(UISelectors.calories).value
      }
    },
    addListItem : function(newItem){
      //Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      //Create li element
      const li = document.createElement('li');
      //Add class
      li.className = 'collection-item';
      //Add ID
      li.id = `item-${newItem.id}`;
      //Add html
      li.innerHTML = `<strong>${newItem.name}: </strong> <em>${newItem.calories} Calories</em>
      <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
      </a>`;
      //Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);
    },
    updateListItem : function(item){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //NodeList to array
      listItems = Array.from(listItems);

      listItems.forEach((listItem) => {
        const itemId = listItem.getAttribute('id');

        if(itemId === `item-${item.id}`){
          document.querySelector(`#${itemId}`).innerHTML = `
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
          </a>
          `;
        }
      });
    },
    deleteListItem : function(id){
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    addItemToForm : function(){
      document.querySelector(UISelectors.name).value = itemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.calories).value = itemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    removeItems : function(){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //Node list to array
      listItems = Array.from(listItems);

      listItems.forEach((li) =>  {
        li.remove();
      });
    },
    clearFields : function(){
      document.querySelector(UISelectors.name).value = '';
      document.querySelector(UISelectors.calories).value = '';
    },
    hideList : function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories : function(totalCalories){
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState : function(){
      UICtrl.clearFields();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState : function(){
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    getSelectors : function(){
      return UISelectors;
    }
  };
})();
//App Controller
const App = (function(itemCtrl,StorageCtrl, UICtrl) {

  //Load all event listeners
  const loadEventListeners = function(){
    //Get UI selectors
    const UISelectors = UICtrl.getSelectors();
    
    //Add item event
    document.querySelector(UISelectors.addBtn).addEventListener
    ('click',itemAddSubmit);

    //Disable submit on enter
    document.addEventListener('keypress' , function(e){
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    });

    //Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener
    ('click' , itemEditClick);

    //Update Item Event
    document.querySelector(UISelectors.updateBtn).addEventListener
    ('click' , itemUpdateSubmit);

    //Delete Item Event
    document.querySelector(UISelectors.deleteBtn).addEventListener
    ('click' , itemDeleteSubmit);

    //Back btn event
    document.querySelector(UISelectors.backBtn).addEventListener
    ('click' , UICtrl.clearEditState);

    //CLear Item event
    document.querySelector(UISelectors.clearBtn).addEventListener
    ('click' , clearAllItems)
  }
  //Add item submit
  const  itemAddSubmit = function(e){
    //Get form input from UICtrl
    const formInput = UICtrl.getItemInput();

    //Check if name and calories input are not empty
    if(formInput.name !== '' && formInput.calories !== ''){
      //Add item
      const newItem = itemCtrl.addItem(formInput.name , formInput.calories);
      
      //Add newItem to UI list
      UICtrl.addListItem(newItem);

      //Get total calories
      const totalCalories = itemCtrl.getTotalCalories();

      //Add totalCalories to UI
      UICtrl.showTotalCalories(totalCalories);

      //Add Item to LS
      StorageCtrl.storeItem(newItem);

      //Clear Input Fields
      UICtrl.clearFields();
    }

    e.preventDefault();
  }

  //Edit Item click
  const itemEditClick = function(e){
     if(e.target.classList.contains('edit-item')){
      //Get list item id (item-0 , item-1)
      const listId = e.target.parentNode.parentNode.id;

      //Break into an array
      const listIdArr = listId.split('-');

      //Get the actual id
      const id = parseInt(listIdArr[1]);

      //Get Item
      const itemToEdit = itemCtrl.getItemById(id);

      //Set current item
      itemCtrl.setCurrentItem(itemToEdit);

      //Add item to form
      UICtrl.addItemToForm();
     }

    e.preventDefault();
  }

  //Update Item Submit
  const itemUpdateSubmit = function(e){
    //Get item input
    const input = UICtrl.getItemInput();

    //Update Item
    const updatedItem = itemCtrl.updateItem(input.name , input.calories);

    //Update UI
    UICtrl.updateListItem(updatedItem);

    //Get total calories
    const totalCalories = itemCtrl.getTotalCalories();

    //Add totalCalories to UI
    UICtrl.showTotalCalories(totalCalories);

    //Update local storage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  //Delete Button event
  const itemDeleteSubmit = function(e){
    //Get Current item
    const currentItem = itemCtrl.getCurrentItem();
    
    //Delete from data structure
    itemCtrl.deleteItem(currentItem.id);

    //Delete List Item from UI
    UICtrl.deleteListItem(currentItem.id);

    //Get total calories
    const totalCalories = itemCtrl.getTotalCalories();

    //Add totalCalories to UI
    UICtrl.showTotalCalories(totalCalories);

    StorageCtrl.deleteItemFromStorage(currentItem);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  //Clear items event
  const clearAllItems = function(){
    //Delete all items from data structure
    itemCtrl.clearAllItems();

    //Get total calories
    const totalCalories = itemCtrl.getTotalCalories();

    //Add totalCalories to UI
    UICtrl.showTotalCalories(totalCalories);

    //Delete all items from ui
    UICtrl.removeItems();

    //Clear all items from storage
    StorageCtrl.clearAllItemsFromStorage();

    //Hide UL
    UICtrl.hideList();
  }

  //Public methods
  return {
    init: function() {
      console.log("Initializing App...");
      //Clear edit state / set initial state
      UICtrl.clearEditState();

      //Fetch Items from data structure
      const items = itemCtrl.getItems();

      //Check if any items
      if(items.length === 0){
        UICtrl.hideList();
      }else{
        //Populate list with items
        UICtrl.populateItemsList(items);
      }

       //Get total calories
       const totalCalories = itemCtrl.getTotalCalories();
       //Add totalCalories to UI
       UICtrl.showTotalCalories(totalCalories);

      //load event listeners
      loadEventListeners();
    }
  };
})(itemCtrl,StorageCtrl, UICtrl);

App.init();
