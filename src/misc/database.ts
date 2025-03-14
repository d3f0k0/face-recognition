import * as SQLite from "expo-sqlite";

export async function initializeDatabase() {
    const database = await SQLite.openDatabaseAsync('attendance.db')

    await database.execAsync(`
        PRAGMA journal_mode = WAL;
        PRAGMA foreign_keys = ON;
        CREATE TABLE IF NOT EXISTS classes (
            id INTEGER PRIMARY KEY NOT NULL,
            className TEXT NOT NULL,
            description TEXT
        );
        CREATE TABLE IF NOT EXISTS student (
            id INTEGER PRIMARY KEY NOT NULL,
            studentName TEXT NOT NULL,
            classID INTEGER NOT NULL,
            embedding TEXT,
            imageURL TEXT,
            embeddingURL TEXT,
            embeddingModel TEXT,
            FOREIGN KEY (classID) 
                REFERENCES classes (id)
                ON UPDATE CASCADE
                ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS recognition_result (
            id INTEGER PRIMARY KEY NOT NULL,
            classID INTEGER NOT NULL,
            result TEXT NOT NULL,
            timestamp INTEGER NOT NULL,
            FOREIGN KEY (classID) 
                REFERENCES classes (id)
                ON UPDATE CASCADE
                ON DELETE CASCADE
        );          
    `)
}


export async function dropDatabasePLEASEUSECAREFULLY() {
    const database = await SQLite.openDatabaseAsync('attendance.db')

    await database.execAsync(`
        DROP TABLE student
        DROP TABLE classes
        DROP TABLE recognition_result
        
        CREATE TABLE IF NOT EXISTS classes (
            id INTEGER PRIMARY KEY NOT NULL,
            className TEXT NOT NULL,
            description TEXT
        );
        CREATE TABLE IF NOT EXISTS student (
            id INTEGER PRIMARY KEY NOT NULL,
            studentName TEXT NOT NULL,
            classID INTEGER NOT NULL,
            embedding TEXT,
            imageURL TEXT,
            embeddingURL TEXT,
            embeddingModel TEXT,
            FOREIGN KEY (classID) 
                REFERENCES classes (id)
                ON UPDATE CASCADE
                ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS recognition_result (
            id INTEGER PRIMARY KEY NOT NULL,
            classID INTEGER NOT NULL,
            result TEXT NOT NULL,
            timestamp INTEGER NOT NULL,
            FOREIGN KEY (classID) 
                REFERENCES classes (id)
                ON UPDATE CASCADE
                ON DELETE CASCADE
        );             
    `)
}

// Class Database Function

export async function addClass(database: SQLite.SQLiteDatabase, className: string, description?: string) {
    try {
        if (className != null) {
            await database.runAsync(
                'INSERT INTO classes (className, description) VALUES (?, ?);' ,
                className, description
            )
        }
    } catch (e) {
        console.error(e)
    }
}

export async function removeClass(database: SQLite.SQLiteDatabase, id: number) {
    try {
        if (id != null) {
            await database.runAsync(
                'DELETE FROM classes WHERE id = ?;',
                 id);
        }
    } catch (e) {
        console.error(e)
    }
}

// Student Database function

export async function addStudent(
    database: SQLite.SQLiteDatabase,
    name: string,
    classID: number,
    image: string,
    embedding?: any,
    embeddingFace?: any) {
    try {
        if (name != null && classID != null) {
            let storeEmbedding
            if (embedding != null) {
                storeEmbedding = JSON.stringify({
                    embedding: embedding
                })
            } else {
                storeEmbedding = JSON.stringify({
                    embedding: null
                })  
            }
            await database.runAsync(
                'INSERT INTO student (studentName, classID, imageURL, embedding, embeddingURL) VALUES (?, ?, ?, ?, ?);',
                name,
                classID,
                image,
                storeEmbedding,
                embeddingFace
            )
        }
    } catch (e) {
        console.log(e)
    }
}

export async function removeStudentByID(
    database: SQLite.SQLiteDatabase,
    id: number) {
   try {
    if (id) {
        await database.runAsync(
            "DELETE FROM student WHERE id = ?",
            id
        )
    }
   } catch (e) {
    console.log(e)
   } 
}

export async function updateEmbeddings(
    database: SQLite.SQLiteDatabase,
    embedding: any,
    embeddingFace: any,
    id: number) {
   try {
    if (id) {
        let storeEmbedding
        if (embedding != null) {
            storeEmbedding = JSON.stringify({
                embedding: embedding
            })
        } else {
            storeEmbedding = JSON.stringify({
                embedding: null
            })  
        }
        await database.runAsync(
            "UPDATE student SET embedding = ?, embeddingFace = ? WHERE id = ?",
            storeEmbedding,
            embeddingFace,
            id
        )
    }
   } catch (e) {
    console.log(e)
   } 
}

export async function addRecognitionResult(
    database: SQLite.SQLiteDatabase,
    classID: number,
    result: string,
    timestamp: number
) {
    try {
        await database.runAsync(
            'INSERT INTO recognition_result (classID, result, timestamp) VALUES (?, ?, ?, ?);',
            classID,
            result,
            timestamp
        )
    } catch (e) {
        console.error(e)
    }
}