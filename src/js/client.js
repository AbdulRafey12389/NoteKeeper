/**
 * @copyright AbdulRafey 2025
 */

'use strict';


/**
 *  MODULES IMPORT...
 */

import { NavItem } from "./components/NavItem.js";
import { activeNotebook } from "./utils.js";
import { Card } from "./components/Card.js";


const $sidebarlist = document.querySelector('[data-sidebar-list]');
const $notePanelTitle = document.querySelector('[data-note-panel-title]');
const $notePanal = document.querySelector('[data-note-panel]');
const $noteCreateBtns = document.querySelectorAll('[data-note-create-btn');
const EmptyNotesTemplate = `
<div class="empty-notes">

    <span class="material-symbols-rounded" aria-hidden="true">note_stack</span>

    <div class="text-headline-small">No notes</div>

</div>
`

const disabledNoteCreateBtns = function(isThereAnyNotebook) {
    $noteCreateBtns.forEach($item => {
        $item[isThereAnyNotebook ? 'removeAttribute' : 'setAttribute']("disabled", '');
    })
};


export const client = {

    notebook: {
        create(notebookData) {
            const $navItem = NavItem(notebookData.id, notebookData.name);
            $sidebarlist.appendChild($navItem)
            activeNotebook.call($navItem);
            $notePanelTitle.textContent = notebookData.name;
            $notePanal.innerHTML = EmptyNotesTemplate;
            disabledNoteCreateBtns(true);
        },

        read(notebookList) {
            disabledNoteCreateBtns(notebookList.length)

            notebookList.forEach((notebookData, index) => {
                const $navItem = NavItem(notebookData.id, notebookData.name)

                if (index === 0) {
                    activeNotebook.call($navItem);
                    $notePanelTitle.textContent = notebookData.name;
                }

                $sidebarlist.appendChild($navItem);
            });
        },

        update(notebookId, notebookData) {
            const $oldNotebook = document.querySelector(`[data-notebook="${notebookId}"]`);
            
            const $newNotebook = NavItem(notebookData.id, notebookData.name);

            $notePanelTitle.textContent = notebookData.name;
            $sidebarlist.replaceChild($oldNotebook, $newNotebook);
            activeNotebook.call($newNotebook)
        },

        delete(notebookId) {
            const $deletedNotebook = document.querySelector(`[data-notebook='${notebookId}']`);
            
            console.log($deletedNotebook);
            

            const $activeNavItem = $deletedNotebook?.nextElementSibling ?? $deletedNotebook?.previousElementSibling;

            if ($activeNavItem) {
                $activeNavItem.click();
            }else {
                $notePanelTitle.innerHTML = '';
                $notePanal.innerHTML = '';
                disabledNoteCreateBtns(false);
            }

            $deletedNotebook.remove();

        }
    },

    note: {
        create(noteData) {

            // CLEAR 'EMPTYNOTESTEMPLATE' FROM 'NOTEPANEL' IF THERE IS NO NOTES EXIST...
            if (!$notePanal.querySelector('[data-note]')) $notePanal.innerHTML = ''

            const $card = Card(noteData);
            $notePanal.prepend($card)
        },

        read(noteList) {
            
            if (noteList.length) {
                $notePanal.innerHTML = '';
                noteList.forEach(noteData => {
                    const $card = Card(noteData);
                    $notePanal.appendChild($card);
                });
            }else {
                $notePanal.innerHTML = EmptyNotesTemplate;

            }

        },

        update(noteId, noteData) {
            const $oldCard = document.querySelector(`[data-note="${noteId}"]`)
            const $newCard = Card(noteData);

            $notePanal.replaceChild($newCard, $oldCard);


        },

        delete(noteId, isNoteExists) {
            document.querySelector(`[data-note="${noteId}"]`).remove();

            if (!isNoteExists) $notePanal.innerHTML = EmptyNotesTemplate;
        }
    
    }

};