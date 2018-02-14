//ASSIGN FETCH HEADER
const restdb = "https://restfullsite-ad69.restdb.io/rest/portfolios";
const fetchHeader = {
    'Content-Type': 'application/json; chartset=utf-8',
    'x-apikey': '5a8477c416d5526228b42459',
    "cache-control": "no-cache"
};
let tryingToDelete_id = '';

//GET FETCH FUNCTION
function fetchData(url, method, callbackfunction){
    fetch(url,{method: method, headers: fetchHeader}).then(res=>res.json()).then(callbackfunction).catch(function(error){console.log(error);});
}
function sendData(url, method, data, callbackfunction){
    fetch(url,{method: method, headers: fetchHeader, body: JSON.stringify(data)}).then(res=>res.json()).then(callbackfunction).catch(function(error){console.log(error);});
}

//DATA RETRIVE FETCH FUNCTIONS
function getPortfolios(url, callbackfunction){fetchData(url,"get",callbackfunction);}
function getPortfolio(id, url, callbackfunction){fetchData((url+"/"+id),"get",callbackfunction);}
function getPortfolioToEdit(id, url, callbackfunction){fetchData((url+"/"+id),"get",callbackfunction);}
function putPortfolio(url, data, callbackfunction){sendData((url+"/"+data._id),"put",data,callbackfunction);}
function createPortfolio(url, data, callbackfunction){sendData(url,"post",data,callbackfunction);}
function deletePortfolio(id, url, callbackfunction){
    tryingToDelete_id = id;
    document.querySelector('#portfolioListView .itemContent[data-id="id_'+id+'"]').classList.add("hidden");
    fetchData((url+"/"+id),"delete",callbackfunction);
}

//DATA SHOW FUNCTIONS
function showModal(modalClass){
    let modal = document.querySelector(modalClass);
    if(modalClass != ".itemCreateModal") modal.querySelector(".itemContent").innerHTML = "";
    modal.classList.add("showModal");
}
function hideModal(modalClass){
    let modal = document.querySelector(modalClass);
    modal.classList.remove("showModal");
}
function showPortfolios(data){
    console.log("showPortfolios() => ");
    console.log(data);
    let holder = document.querySelector("#portfolioListView");
    let template = document.querySelector("#portfolioListViewTemplate").content;
    let clone, tmpDescriptions;

    data.forEach(eachItem=>{
        clone = template.cloneNode(true);

        tmpDescriptions = eachItem.description.split("\n");

        clone.querySelector(".itemContent").setAttribute("data-id", "id_" + eachItem._id);
        clone.querySelector(".title").textContent = eachItem.title;
        clone.querySelector(".image").setAttribute("src", eachItem.image);
        clone.querySelector(".description").innerHTML = "<p>" + tmpDescriptions[0] + "</p>";
        clone.querySelector(".createdat").textContent = new Date(eachItem.createdat).toDateString();
        clone.querySelector(".modifiedat").textContent = new Date(eachItem.modifiedat).toDateString();


        clone.querySelector(".showItem").addEventListener("click",event=>{
            showModal(".itemShowModal");
            getPortfolio(eachItem._id,restdb,showPortfolio);
        });
        clone.querySelector(".editItem").addEventListener("click",event=>{
            showModal(".itemEditModal");
            getPortfolioToEdit(eachItem._id,restdb,showPortfolioToEdit);
        });
        clone.querySelector(".deleteItem").addEventListener("click",event=>{
            deletePortfolio(eachItem._id,restdb,updatePortfoliosByDeletingItem);
        });

        holder.appendChild(clone);
    });
}
function showPortfolio(itemData){
    console.log("showPortfolio() => ");
    console.log(itemData);
    let holder = document.querySelector(".itemShowModal .modalContent .itemContent");
    let template = document.querySelector("#modalViewItemTemplate").content;
    let clone, tmpDescriptions;

    clone = template.cloneNode(true);

    tmpDescriptions = itemData.description.split("\n");

    clone.querySelector(".modalShowItemContent").setAttribute("data-id", "id_" + itemData._id);
    clone.querySelector(".title").textContent = itemData.title;
    clone.querySelector(".image").setAttribute("src", itemData.image);
    clone.querySelector(".description").innerHTML = "<p>" + tmpDescriptions.join("</p><p>") + "</p>";
    clone.querySelector(".createdat").textContent = new Date(itemData.createdat).toDateString();
    clone.querySelector(".modifiedat").textContent = new Date(itemData.modifiedat).toDateString();

    holder.innerHTML = "";
    holder.appendChild(clone);
}
function showPortfolioToEdit(itemData){
    console.log("showPortfolioToEdit() => ");
    console.log(itemData);
    let holder = document.querySelector(".itemEditModal .modalContent .itemContent");
    let template = document.querySelector("#modalEditItemTemplate").content;
    let clone, tmpDescriptions;

    clone = template.cloneNode(true);

    clone.querySelector(".formTitle").textContent = itemData.title;
    clone.querySelector("input._id").value = itemData._id;
    clone.querySelector("input.title").value = itemData.title;
    clone.querySelector("input.image").value = itemData.image;
    clone.querySelector("textarea.description").value = itemData.description;
    clone.querySelector("input.createdat").value = getDate(itemData.createdat);
    clone.querySelector("input.modifiedat").value = getDate("");

    holder.innerHTML = "";

    clone.querySelector('button[type="submit"]').addEventListener("click",function(event){
        event.preventDefault();
        let bodyData = {
            _id         :event.target.parentElement.querySelector("input._id").value,
            title       :event.target.parentElement.querySelector("input.title").value,
            image       :event.target.parentElement.querySelector("input.image").value,
            description :event.target.parentElement.querySelector("textarea.description").value,
            createdat   :event.target.parentElement.querySelector("input.createdat").value,
            modifiedat  :event.target.parentElement.querySelector("input.modifiedat").value
        }

        putPortfolio(restdb,bodyData,updatePortfolios);
    });

    holder.appendChild(clone);
}
function updatePortfolios(updatedItem){
    console.log("updatePortfolios() => ");
    console.log(updatedItem);
    hideModal(".itemEditModal");
    let holder = document.querySelector("#portfolioListView");
    let item = holder.querySelector('.itemContent[data-id="id_'+updatedItem._id+'"]');
    //update

    tmpDescriptions = updatedItem.description.split("\n");
    item.querySelector(".title").textContent = updatedItem.title;
    item.querySelector(".image").setAttribute("src", updatedItem.image);
    item.querySelector(".description").innerHTML = "<p>" + tmpDescriptions[0] + "</p>";
    item.querySelector(".createdat").textContent = new Date(updatedItem.createdat).toDateString();
    item.querySelector(".modifiedat").textContent = new Date(updatedItem.modifiedat).toDateString();
}
function updatePortfoliosByAddingNew(updatedItem){
    console.log("updatePortfolios() => ");
    console.log(updatedItem);
    hideModal(".itemCreateModal");
    let holder = document.querySelector("#portfolioListView");
    let template = document.querySelector("#portfolioListViewTemplate").content;
    let clone, tmpDescriptions;
    clone = template.cloneNode(true);

    tmpDescriptions = updatedItem.description.split("\n");

    clone.querySelector(".itemContent").setAttribute("data-id", "id_" + updatedItem._id);
    clone.querySelector(".title").textContent = updatedItem.title;
    clone.querySelector(".image").setAttribute("src", updatedItem.image);
    clone.querySelector(".description").innerHTML = "<p>" + tmpDescriptions[0] + "</p>";
    clone.querySelector(".createdat").textContent = new Date(updatedItem.createdat).toDateString();
    clone.querySelector(".modifiedat").textContent = new Date(updatedItem.modifiedat).toDateString();


    clone.querySelector(".showItem").addEventListener("click",event=>{
        showModal(".itemShowModal");
        getPortfolio(updatedItem._id,restdb,showPortfolio);
    });
    clone.querySelector(".editItem").addEventListener("click",event=>{
        showModal(".itemEditModal");
        getPortfolioToEdit(updatedItem._id,restdb,showPortfolioToEdit);
    });
    clone.querySelector(".deleteItem").addEventListener("click",event=>{
        deletePortfolio(updatedItem._id,restdb,updatePortfoliosByDeletingItem);
    });

    holder.appendChild(clone);
}
function updatePortfoliosByDeletingItem(deletedItem){
    if(typeof(deletedItem.result) != "undefined" && Array.isArray(deletedItem.result) == true){
        deletedItem.result.forEach(function(each){
            let targetedElement = document.querySelector('#portfolioListView .itemContent[data-id="id_'+tryingToDelete_id+'"]');
            if(tryingToDelete_id == each){
                if(targetedElement != null){
                    targetedElement.remove();
                }
            }else{
                if(targetedElement != null){
                    targetedElement.classList.remove(".hidden");
                }
            }
        });
    }
}

//START THE SCRIPT
window.addEventListener("load", () => {
    document.querySelectorAll(".closeModal").forEach(function(each){
        console.log(each);
        each.addEventListener("click",function(event){
            console.log(each.parentElement.parentElement.parentElement);
            each.parentElement.parentElement.parentElement.classList.remove("showModal");
        });
    });
    document.querySelector(".addPortfolio").addEventListener("click",function(event){
        showModal(".itemCreateModal");
        let form = document.querySelector(".itemCreateModal");

        form.querySelector("input.title").value = "";
        form.querySelector("input.image").value = "";
        form.querySelector("textarea.description").value = "";
        form.querySelector("input.createdat").value = getDate("");
        form.querySelector("input.modifiedat").value = getDate("");
    });
    document.querySelector('.itemCreateModal button[type="submit"]').addEventListener("click",function(event){
        event.preventDefault();
        let bodyData = {
            title       :event.target.parentElement.querySelector("input.title").value,
            image       :event.target.parentElement.querySelector("input.image").value,
            description :event.target.parentElement.querySelector("textarea.description").value,
            createdat   :event.target.parentElement.querySelector("input.createdat").value,
            modifiedat  :event.target.parentElement.querySelector("input.modifiedat").value
        }
        createPortfolio(restdb,bodyData,updatePortfoliosByAddingNew);
    });
    getPortfolios(restdb,showPortfolios);
});
