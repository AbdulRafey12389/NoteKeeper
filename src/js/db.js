/**
 * @copyright AbdulRafey 2025...
 */

'use strict';

// DATABASE INILIAZE...
// const supabaseUrl = 'https://ymhomlzwjnccgthbssbc.supabase.co'
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltaG9tbHp3am5jY2d0aGJzc2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxNDIwNzYsImV4cCI6MjA1MTcxODA3Nn0.UDRCeEJPfz45h5Fw3xgaOWamj-7ZTcEXkBZkbR5a75U'
// const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey)

// console.log(supabaseClient);

// async function addTodo(noteKeeperDb) {


    

// const { data, error } = await supabaseClient
//   .from('notekeeperDB')
//   .insert(noteKeeperDb);

        

// }



// async function loadTodos(){
//     const { data, error } = await supabaseClient
//   .from('notekeeperDB')
//   .select('*')

//   console.log(JSON.parse(data))

// }

// loadTodos()





/**
 *  MODULES IMPORT...
 */

import { generateID, findNotebook, findNotebookIndex, findNote, findNoteIndex } from "./utils.js";



// DB OBJECT...
let noteKeeperDb = {};

const initDB = function () {
    const db = localStorage.getItem('noteKeeperDB')

    if (db) {
        noteKeeperDb = JSON.parse(db);  
    }else {
        noteKeeperDb.notebooks = [];
        localStorage.setItem('noteKeeperDB', JSON.stringify(noteKeeperDb));
    }
};

initDB();

/**
 * READS AND LOADS THE LOCALSTORAGE DATA IN TO THE GLOBEL VARIABLE `NOTEKEEPER`...
 */

const readDB = function () {
    noteKeeperDb = JSON.parse(localStorage.getItem('noteKeeperDB'));
};


/**
 * WRITES THE CURRENT STATE OF THE GLOBEL VARIABLE `NOTEKEEPERdb` TO LOCAL STORAGE...
 */

const writeDB = function () {
    localStorage.setItem('noteKeeperDB', JSON.stringify(noteKeeperDb));
};

export const db = {
    post: {    
        nootbook(name) {
            readDB()

            const notebookData = {
                id: generateID(),
                name,
                notes: []
            }

            noteKeeperDb.notebooks.push(notebookData)
            
        
            writeDB()

            return notebookData;
        },

        note(notebookId, object) {
            readDB();

            const notebook = findNotebook(noteKeeperDb, notebookId);

            const noteData = {
                id: generateID(),
                notebookId,
                ...object,
                postedOn: new Date().getTime()
            }

            notebook.notes.unshift(noteData);

            writeDB()
            

            return noteData
        }
        

    },

    get: {
        notebook() {
            readDB();

            return noteKeeperDb.notebooks;},

        note(notebookId) {
            readDB();

            const notebook = findNotebook(noteKeeperDb, notebookId);

            writeDB();

            return notebook.notes;
        }  
    },

    update: {
        nootbook(notebookId, name) {
            readDB();

            const notebook = findNotebook(noteKeeperDb, notebookId);
            notebook.name = name;

            writeDB();

            return notebook;
        },

        note(noteId, object) {
            readDB();

            const oldNote = findNote(noteKeeperDb, noteId);
            const newNote = Object.assign(oldNote, object);

            writeDB();

            return newNote;
        }
    },

    delete: {
        notebook(notebookId) {
            readDB();

            const notebookIndex = findNotebookIndex(noteKeeperDb, notebookId);

            noteKeeperDb.notebooks.splice(notebookIndex, 1);

            writeDB();
        },

        note(notebookId, noteId) {
            readDB();

            const notebook = findNotebook(noteKeeperDb, notebookId);
            const noteIndex = findNoteIndex(notebook, noteId)

            notebook.notes.splice(noteIndex, 1);

            writeDB();

            return notebook.notes;
        }
    }
}