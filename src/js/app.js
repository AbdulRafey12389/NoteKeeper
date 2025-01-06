/**
 * @copyright AbdulRafey 2025
 */

'use strict';


/**
 *  MODULES IMPORT...
 */

import { addEventOnElements, getGreatingMsg, activeNotebook, makeElemEditable } from "./utils.js";
import { Tooltip } from "./components/Tooltip.js";
import { db } from "./db.js";
import { client } from "./client.js";
import { NoteModel } from "./components/Modal.js";


/**
 * TOGGLE SIDEBAR IN SMALL SCREEN...
 */

const $sidebar = document.querySelector('[data-sidebar]');
const $sidebarTogglers = document.querySelectorAll('[data-sidebar-toggler]');
const $overlay = document.querySelector('[data-sidebar-overlay]');

addEventOnElements($sidebarTogglers, "click", function () {
    $sidebar.classList.toggle("active")
    $overlay.classList.toggle("active")
});


/**
 * INITIALIZE TOOLTIP BEHAVIOUR FOR ALL DOM ELEMENTS WITH A 'DATA-TOOLTIP' ATTRIBUTE...
 */

const $tooltipElems = document.querySelectorAll('[data-tooltip]');
$tooltipElems.forEach($elem => Tooltip($elem));



/**
 * SHOW GREETING MESSAGE ON HOMEPAGE...
 */

const $greetingElem = document.querySelector('[data-greeting]');
const currentHour = new Date().getHours();
$greetingElem.textContent = getGreatingMsg(currentHour);



/**
 * SHOW CURRENT DATE ON HOMEPAGE...
 */

const $currentDateElem = document.querySelector('[data-current-date');
$currentDateElem.textContent = new Date().toDateString().replace(" ", ', ');


/**
 * NOTE BOOK CREATE FIELD...
 */

const $sidebarlist = document.querySelector('[data-sidebar-list]');
const $addNotebookBtn = document.querySelector("[data-add-notebook")

const showNotebookField = function () {
    const $navItem = document.createElement('div');
    $navItem.classList.add('nav-item');

    $navItem.innerHTML = `
        <span class='text text-label-large' data-notebook-field></span>

        <div class="state-layer"></div>
    `

    $sidebarlist.appendChild($navItem);

    const $navItemField = $navItem.querySelector('[data-notebook-field]');
    

    // AVTIVE NEW CREATED NOTEBOOK AND DEACTIVE THE LAST ONE...
    activeNotebook.call($navItem)

    // MAKE NOTEBOOK FIELD CONTENT EDITABLE AND FOCUS...
    makeElemEditable($navItemField);

    // WHEN USER PRESS 'ENTER' THEN CREATE NOTEBOOK...
    $navItemField.addEventListener('keydown', createNotebook);
}; 

$addNotebookBtn.addEventListener('click', showNotebookField)

const createNotebook = function (event) {

    if (event.key === 'Enter') {
        // STORE NEW CREATED NOTEBOOK 
        const notebookData = db.post.nootbook(this.textContent || 'Untitled')
        this.parentElement.remove();
        
        // RENDER NAVITEM
        client.notebook.create(notebookData);
    }

}; 


/**
 * RENDER THE EXISTING NOTEBOOK LIST BY RETRIEVING DATA FROM THE DATABASE AND PASSING IT TO THE CLIENT...
 */

const renderExistedNotebook = function () {
    const notebookList = db.get.notebook();
    
    client.notebook.read(notebookList);
};

renderExistedNotebook()


/**
 * CREATE A NEW NOTE...
 */

const $noteCreateBtns = document.querySelectorAll('[data-note-create-btn]');

addEventOnElements($noteCreateBtns, 'click', function() {
    // CREATE AND OPEN A NEW MODEL...
    const model = NoteModel();

    model.open();

    // HANDLE THE SUBMIT OF NEW NOTE TO THE DATABASE AND CLIENT...
    model.onSubmit(noteObj => {
        const activeNotebookId = document.querySelector('[data-notebook].active').dataset.notebook;

        const noteData = db.post.note(activeNotebookId, noteObj);

        client.note.create(noteData);

        model.close();
        
    })
});


/**
 * RENDERS EXISTING NOTES IN THE ACTIVE NOTEBOOK. RETRIEVES NOTE DATA FROM THE DATABASE  BASED ON THE ACTIVE NOTEBOOK'S ID AND USES THE CLIENT TO DISPLAY NOTES... 
 */

const renderExistedNote = function () {
    const activeNotebookId = document.querySelector('[data-notebook].active')?.dataset.notebook;

    if (activeNotebookId) {
        const noteList = db.get.note(activeNotebookId);
        
        // DISPLAY EXISTING NOTES...
        client.note.read(noteList);
        
    }
};

renderExistedNote()