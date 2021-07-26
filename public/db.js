let db;
// create a new db request for a "BudgetDB" database.
const request = indexedDB.open("BudgetDB", 1);
request.onupgradeneeded = function (event) {
  // create object store called "BudgetStore" and set autoIncrement to true
  const db = event.target.result;

  const BudgetStore = db.createObjectStore("BudgetDB",{autoIncrement: true})

  
};

request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function (event) {

  console.log(event.target.errorCode)
  
};

function saveRecord(record) {
  const db = request.result;
  // create a transaction on the pending db with readwrite access
  const transaction = db.transaction(["BudgetDB"], "readwrite")
  // access your pending object store
  const BudgetStore = transaction.objectStore("BudgetDB");
  // add record to your store with add method.
  BudgetStore.add({record})
}

function checkDatabase() {
  // open a transaction on your pending db
  request.onsuccess=()=>{
    const db = request.result;
    const transaction = db.transaction(["BudgetDB"], "readwrite");
    // access your pending object store
    const BudgetStore= transaction.objectStore("BudgetDB")
    // get all records from store and set to a variable
    const getAll = BudgetStore.getAll()
    getAll.onsuccess=()=>{
      console.log(getAll.result)
      
        if (getAll.result.length > 0) {
          fetch('/api/transaction/bulk', {
            method: 'POST',
            body: JSON.stringify(getAll.result),
            headers: {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'application/json',
            },
          })
            .then((response) => response.json())
            .then(() => {
              // if successful, open a transaction on your pending db
              request.onsuccess=()=>{
                const db = request.result;
                const transaction = db.transaction(["BudgetDB"], "readwrite")
               // access your pending object store
                const BudgetStore = transaction.objectStore("BudgetDB")
    
                const BudgetStoreRequest = objectStore.clear()
    
                BudgetStoreRequest.onsuccess =()=>{
                  console.log(results.result)
                }
              }
              
              // clear all items in your store
            });
        }
      };
    }
    
    }
  


  
// listen for app coming back online
window.addEventListener('online', checkDatabase);
