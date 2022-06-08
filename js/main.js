const elProductTemplate = document.querySelector(".product-template");
const elCardWrapper = document.querySelector(".card-list-wrap");
const elMonufacturer = document.querySelector('#manufacturer');
const elFiltrForm = document.querySelector('#filter');
const elAddMobileForm = document.querySelector('.add-mobile-form');
const elEditModal = new bootstrap.Modal("#edit-product-modal");
const elEditForm = document.querySelector(".edit-mobile-form");
const elEditName = elEditForm.querySelector("#edit-productTitle");
const elEditPrice = elEditForm.querySelector("#edit-price");
const elEditManuFacturer = elEditForm.querySelector("#edit-productManufacturer");
const elEditBenefits = elEditForm.querySelector("#edit-benefits");

const addnull = num => { return num < 10 ? "0" + num : num } ;

manufacturers.forEach( brand => {
    const elPhone = document.createElement("option")
    elPhone.textContent = brand.name;
    elMonufacturer.append(elPhone);
})


const createProductRow = (card) => {
    const elCardRow = elProductTemplate.cloneNode(true).content;
    
    const elCardTitle = elCardRow.querySelector(".card-title");
    elCardTitle.textContent = card.title;
    
    const elCardId = elCardRow.querySelector(".idd");
    elCardId.textContent = `ID:${card.id}`;
    
    const elCardMark = elCardRow.querySelector(".card-mark");
    elCardMark.textContent = `${card.price}$`;
    
    const elLastMark = elCardRow.querySelector(".last-mark");
    elLastMark.textContent = card.lastprice;
    
    const elCardBadge = elCardRow.querySelector(".badge");
    elCardBadge.textContent = card.model;
    
    const elCardDate = elCardRow.querySelector(".card-date");
    const time = new Date();
    elCardDate.textContent = `${addnull(time.getDate())}.${addnull(time.getMonth()+1)}.${time.getFullYear()}`;
    
    const elCardRam = elCardRow.querySelector(".ram");
    elCardRam.textContent = card.benefits[0];
    
    const elCardStore = elCardRow.querySelector(".store");
    elCardStore.textContent = card.benefits[1];
    
    const elCardColor = elCardRow.querySelector(".color");
    elCardColor.textContent = card.benefits[2];
    
    const elCardInfo = elCardRow.querySelector(".info");
    elCardInfo.textContent = card.info;
    
    const elDeleteBtn = elCardRow.querySelector('.btn-danger');
    elDeleteBtn.dataset.id = card.id;
    
    const elEditBtn = elCardRow.querySelector(".btn-secondary");
    elEditBtn.dataset.id = card.id;
    
    return elCardRow;
}

const renderMobile = (mobileArray = products) => {
    elCardWrapper.innerHTML = ``;
    mobileArray.forEach((card) => {
        const elCardRow = createProductRow(card);
        elCardWrapper.appendChild(elCardRow);
    })
};
renderMobile();

elAddMobileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const elFormElement = e.target.elements;
    const elInputPhone = elFormElement.productTitle.value.trim();
    const elInputPrice = +elFormElement.price.value.trim();
    const elBenefits = elFormElement.benefits.value.trim();
    
    if (elInputPhone && elBenefits  && elInputPrice > 0 ) {
        const imag = document.querySelector('.card-img-top')
        const logo = document.querySelector('#productManufacturer')
        const addingMobile = {
            title: elInputPhone,
            img: imag,
            price: `${elInputPrice}`,
            lastprice: "000",
            addedDate: new Date().toISOString(),
            model: logo.value,
            benefits: ["Barcha turlari mavjud"],
            info: elBenefits,
            id: Math.floor(Math.random()*1000)
        }
        products.unshift(addingMobile);
        const newPhone = createProductRow(addingMobile);
        elCardWrapper.prepend(newPhone);
        elAddMobileForm.reset();
        
    }
});

elCardWrapper.addEventListener("click", (e) => {
    if (e.target.matches('.btn-danger')){
        const clickedBtnId = +e.target.dataset.id;
        const clickedBtnIndex = products.findIndex (mobile => {
            return mobile.id === clickedBtnId;
        })
        products.splice(clickedBtnIndex,1)
        
        renderMobile();
    }
    
    if (e.target.matches(".btn-secondary")) {
        const clickedBtnId = +e.target.dataset.id;
        const clickedBtnObj = products.find((mobile) => mobile.id === clickedBtnId);
        
        if(clickedBtnObj){
            elEditName.value = clickedBtnObj.title;
            elEditPrice.value = +clickedBtnObj.price;
            elEditManuFacturer.value = clickedBtnObj.model;
            elEditBenefits.value = clickedBtnObj.info;
            elEditForm.dataset.id = clickedBtnId;  
        }
    }
});

elEditForm.addEventListener("submit",(evt) => {
    evt.preventDefault();
    
    const submittingItemId = +evt.target.dataset.id;
    
    const titleValue = elEditName.value.trim();
    const priceValue = +elEditPrice.value;
    const manufacturerValue = elEditManuFacturer.value;
    const benefitValue = elEditBenefits.value;
    
    if (priceValue > 0 && titleValue && manufacturerValue && benefitValue) {
        const submittingItemIndex = products.findIndex( mobile => mobile.id === submittingItemId) ;
        const image = document.querySelector('.card-img-top');
        const submittingItemObj = {
            title: titleValue,
            price: `${priceValue}`,
            lastprice:"000",
            addedDate: new Date().toISOString(),
            model: manufacturerValue,
            benefits: ["Barcha turlari mavjud"],
            info: benefitValue,
            id: submittingItemId
        }
        products.splice(submittingItemIndex , 1 , submittingItemObj)
        
        renderMobile();
        elEditModal.hide();
    }
})

elFiltrForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const filterElements = e.target.elements;
    const searchValue = filterElements.search.value;
    const fromValue = filterElements.from.value;
    const toValue = filterElements.to.value;
    
    const compareFunction = function(element) {
        const inNameMatches = element.title.toLowerCase().includes(searchValue.toLowerCase())
        return inNameMatches ;
        
    }
    const filteredMobiles = products.filter( compareFunction ).filter( product => {
        const lastPrice = product.price
        return lastPrice >= fromValue;
    }).filter (product => {
        const toPrice = product.price;
        return !toValue ? true : toPrice <= toValue ;
    }).filter ( product => {
        const elModel = product.model;
        return elModel === elMonufacturer.value;
    })
    renderMobile(filteredMobiles)
})