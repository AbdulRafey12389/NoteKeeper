/**
 * @copyright AbdulRafey 2025
 */

'use strict';


const $overlay = document.createElement('div')
$overlay.classList.add('overlay', 'model-overlay')


const DeleteConfirmModel = function (title) {
    const $model = document.createElement('div');
    $model.classList.add('model')

    $model.innerHTML = `
                <h3 class="model-title text-title-medium">
                Are you sure do you want to delete? <strong>"${title}"</strong>
            </h3>

            <div class="model-footer">

                <button class="btn text" data-action-btn='false'>
                    <span class="text-label-large">Cancel</span>

                    <div class="state-layer"></div>
                </button>

                <button class="btn fill" data-action-btn='true'>
                    <span class="text-label-large">Delete</span>

                    <div class="state-layer"></div>
                </button>
            </div>
    `

    const open = function() {
        document.body.appendChild($model);
        document.body.appendChild($overlay);
    } 

    // CLOSE THE DELETE CONFIRMATION MODEL BY REMOVING IT FROM THE DOCUMENT BODY...
    const close = function() {
        document.body.removeChild($model);
        document.body.removeChild($overlay);
    };

    const $actionBtns = $model.querySelectorAll('[data-action-btn');


    const onSubmit = function (callback) {
        $actionBtns.forEach($btn => $btn.addEventListener("click", function() {

            const isConfirm = this.dataset.actionBtn === 'true' ? true : false;

            callback(isConfirm);

        }));
    };

    return { open, close, onSubmit }
    
};


const NoteModel = function (title = 'Untitled', text = 'Add your note...', time = '') {

    const $model = document.createElement('div')
    $model.classList.add('model');

    $model.innerHTML = `
                <button class="icon-btn large" aria-label="Close model" data-close-btn>
                <span class="material-symbols-rounded" aria-hidden="true">close</span>

                <div class="state-layer"></div>
            </button>

            <input type="text" name="" placeholder="Untitled" value="${title}" class="model-title text-title-medium" data-note-field>

            <textarea placeholder="Take a note..." class="model-text text-body-large custom-scrollbar" data-note-field>${text}</textarea>

            <div class="model-footer">
                <span class="time text-label-large">${time}</span>

                <button class="btn text" data-submit-btn>
                    <span class="text-label-large">Save</span>

                    <div class="state-layer"></div>
                </button>
            </div>
    
    `

    const $submitBtn = $model.querySelector('[data-submit-btn]');
    $submitBtn.disabled = true

    const [$titleField, $textField] = $model.querySelectorAll('[data-note-field')

    const enableSubmit = function () {
        $submitBtn.disabled = !$titleField.value && !$titleField.value
    };

    $textField.addEventListener('keyup', enableSubmit)
    $titleField.addEventListener('keyup', enableSubmit)


    const open = function() {
        document.body.appendChild($model);
        document.body.appendChild($overlay);
        $titleField.focus();
        
    }

    const close = function() {
        document.body.removeChild($model);
        document.body.removeChild($overlay);
        
    }

    const $closeBtn = $model.querySelector('[data-close-btn]')
    

    $closeBtn.addEventListener('click', close);

    const onSubmit = function (callback) {
        $submitBtn.addEventListener('click', function () {
            const noteData = {
                title: $titleField.value,
                text: $textField.value
            }

            callback(noteData);
        });
    };


    return { open, close, onSubmit }

} 


export { DeleteConfirmModel, NoteModel }