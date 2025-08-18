import fs from 'fs';
import path from 'path';
import { Window } from 'happy-dom';

import { it, vi, expect } from 'vitest';
import { createErrorMessage, removeBookHandler } from './app.js';

const docPath = path.join(process.cwd(), 'index.html'); // path.join() är en metod som returnerar en fullständig sökväg till en fil, i detta fall index.html
const docContent = fs.readFileSync(docPath).toString(); // fs.readFileSync() är en metod som läser innehållet i en fil, i detta fall index.html

const window = new Window(); // 
const document = window.document;

document.write(docContent);

vi.stubGlobal('document', document);

it('should remove an element from the DOM', () => {
    // Skapa ett test-element
    const li = document.createElement('li');
    li.textContent = 'Test book';
    document.body.appendChild(li);

    // Säkerställ att elementet finns i DOM
    expect(document.body.contains(li)).toBe(true);

    // Anropa funktionen för att ta bort elementet
    removeBookHandler(li);

    // Kontrollera att elementet inte längre finns
    expect(document.body.contains(li)).toBe(false);
});


it('should add a div element with the classname ".message-section"', () => {
    createErrorMessage('Please add a book');
    const messageSection = document.querySelector('.message-section');
    expect(messageSection).not.toBeNull();
});

