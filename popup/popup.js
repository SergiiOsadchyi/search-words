let textsSearchList = document.querySelectorAll('.input-content-search-words');
let checkboxElems = document.querySelectorAll('.checkbox-content-search-words');
let visibleText = document.querySelector('#content-search-words');
let runBtn = document.querySelector('#run-search-words');
let openBtn = document.querySelector('#open-search-words');

chrome.storage.local.get (['addDisplay'], function (res) {
    if (res.addDisplay) {
        visibleText.style.display = res.addDisplay;
    }
});

chrome.storage.local.get (['fillTextFields'], function (res) {
    if (res.fillTextFields) {
        let textArray = res.fillTextFields;
        for (let pos = 0; pos < 3; pos++){
            textsSearchList[pos].value = textArray[pos];
        }
    }
});

chrome.storage.local.get (['checkboxStatus'], function (res) {
    if (res.checkboxStatus) {
        let checkboxArray = res.checkboxStatus;
        for (let pos = 0; pos < 3; pos++){
            checkboxElems[pos].checked = checkboxArray[pos];

            if (checkboxArray[pos] === false){
                textsSearchList[pos].style.backgroundColor = 'lightgrey';
            }

        }
    }
});

for (let i = 0; i < 3; i++){
    checkboxElems[i].addEventListener('click', function (){
        if (checkboxElems[i].checked === false){
            textsSearchList[i].style.backgroundColor = 'lightgrey';
        }
        if (checkboxElems[i].checked === true){
            textsSearchList[i].style.backgroundColor = 'white';
        }
    });
}

openBtn.addEventListener('click', function (){
    if (getComputedStyle(visibleText, null).display === 'block'){
        visibleText.style.display = 'none';
        chrome.storage.local.set({addDisplay: 'none'});
    } else if (getComputedStyle(visibleText, null).display === 'none'){
        visibleText.style.display = 'block';
        chrome.storage.local.set({addDisplay: 'block'});
    }
});

runBtn.addEventListener('click', function (){
    let textArr = [];  //from input text in the form for save in local storage and search in pages
    let origText = [];  //from input text in the form for save in local storage and display in a popup page
    let checkboxList = []; // list of checkboxes status

    for (let pos = 0; pos < 3; pos++) {
        let textInput = textsSearchList[pos].value;
        let checkSpace = textInput.replace(/\s/g, ''); // check if text field isn't empty
        origText.push(textInput); // save all texts for fill popup.html

        if (checkboxElems[pos] === false){
            textsSearchList[pos].style.backgroundColor = 'lightgrey';
            //textArr.push('');
        }
        if (checkSpace.length > 0 && checkboxElems[pos].checked === true){
            //textInput = encodeURI(textInput);
            textArr.push(textInput);
        }
        if (checkboxElems[pos].checked === true && checkSpace.length === 0){
            textsSearchList[pos].style.backgroundColor = 'lightgrey';
            checkboxElems[pos].checked = false;
            //textArr.push('');
        }

        checkboxList.push(checkboxElems[pos].checked); // fill array status of checkboxes
    }

    console.log(textArr);
    sroreValue(origText, textArr, checkboxList);
    window.close();
    return chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"});
    });
});

function sroreValue(origText, textArr, checkboxList){
    chrome.storage.local.set({searchText: textArr});
    chrome.storage.local.set({fillTextFields: origText});
    chrome.storage.local.set({checkboxStatus: checkboxList});
}

