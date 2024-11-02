const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const app = express();
const upload = multer(); // middleware для обробки форм
const notesDir = './cache';

// Перевіряємо, чи існує директорія для кешу, інакше створюємо
if (!fs.existsSync(notesDir)) {
    fs.mkdirSync(notesDir);
}

// Middleware для обробки URL-кодованих даних
app.use(express.urlencoded({ extended: true }));

// GET /UploadForm.html
app.get('/UploadForm.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'UploadForm.html'));
});

// GET /notes/:name
app.get('/notes/:name', (req, res) => {
    const notePath = path.join(notesDir, req.params.name + '.txt');
    if (fs.existsSync(notePath)) {
        const noteContent = fs.readFileSync(notePath, 'utf-8');
        res.status(200).send(noteContent);
    } else {
        res.status(404).send('Note not found');
    }
});

// PUT /notes/:name
app.put('/notes/:name', express.text(), (req, res) => {
    const notePath = path.join(notesDir, req.params.name + '.txt');
    if (fs.existsSync(notePath)) {
        fs.writeFileSync(notePath, req.body, 'utf-8');
        res.status(200).send('Note updated');
    } else {
        res.status(404).send('Note not found');
    }
});

// DELETE /notes/:name
app.delete('/notes/:name', (req, res) => {
    const notePath = path.join(notesDir, req.params.name + '.txt');
    if (fs.existsSync(notePath)) {
        fs.unlinkSync(notePath);
        res.status(200).send('Note deleted');
    } else {
        res.status(404).send('Note not found');
    }
});

// GET /notes
app.get('/notes', (req, res) => {
    const notes = fs.readdirSync(notesDir).map(file => {
        const noteContent = fs.readFileSync(path.join(notesDir, file), 'utf-8');
        return {
            name: path.basename(file, '.txt'),
            text: noteContent
        };
    });
    res.status(200).json(notes);
});

// POST /write
app.post('/write', upload.none(), (req, res) => {
    console.log(req.body); // Перевірка отриманих даних
    const noteName = req.body.note_name;
    const noteText = req.body.note;

    if (!noteName || !noteText) {
        return res.status(400).send('Note name and text are required');
    }

    const notePath = path.join(notesDir, `${noteName}.txt`);

    if (fs.existsSync(notePath)) {
        return res.status(400).send('Note with this name already exists');
    }

    fs.writeFileSync(notePath, noteText, 'utf-8');
    res.status(201).send('Note created');
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
    console.log(`Server is running at http://${HOST}:${PORT}`);
});
