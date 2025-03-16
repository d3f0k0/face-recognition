import * as SQLite from "expo-sqlite";
import {RecognitionResult} from './types'

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
            studentID INTEGER,
            timestamp INTEGER NOT NULL,
            face TEXT,
            similarity REAL,
            FOREIGN KEY (classID) REFERENCES classes (id)
                ON UPDATE CASCADE
                ON DELETE CASCADE,
            FOREIGN KEY (studentID) REFERENCES student (id)
                ON UPDATE CASCADE
                ON DELETE SET NULL
        );          
    `)
}


export async function dropDatabasePLEASEUSECAREFULLY(database) {
    await database.execAsync(`
        DROP TABLE IF EXISTS recognition_result;
        DROP TABLE IF EXISTS student;
        DROP TABLE IF EXISTS classes;
    `)
    
    // Reinitialize the database structure
    await initializeDatabase();
}

export async function clearAllData(database) {
    await database.execAsync(`
        DELETE FROM recognition_result;
        DELETE FROM student;
        DELETE FROM classes;
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


export async function addRecognitionResultBatch(
    database: SQLite.SQLiteDatabase,
    classID: number,
    results: RecognitionResult[]
) {
    try {
        const timestamp = Date.now();
        
        await database.withTransactionAsync(async () => {
            for (const result of results) {
                await database.runAsync(
                    `INSERT INTO recognition_result 
                    (classID, studentID, timestamp, face, similarity) 
                    VALUES (?, ?, ?, ?, ?)`,
                    [
                        classID,
                        result.best_match ? parseInt(result.best_match.name) : null,
                        timestamp,
                        result.face,
                        result.best_match?.similarity ?? null
                    ]
                );
            }
        });

        return timestamp;
    } catch (e) {
        console.error('Error adding recognition batch:', e);
        throw e;
    }
}

export async function getLatestRecognitionResult(
    database: SQLite.SQLiteDatabase,
    classID: number
) {
    try {
        const results = await database.getAllAsync(
            `SELECT r.*, s.studentName, s.imageURL 
             FROM recognition_result r 
             LEFT JOIN student s ON r.studentID = s.id
             WHERE r.classID = ? 
             AND r.timestamp = (
                 SELECT MAX(timestamp) 
                 FROM recognition_result 
                 WHERE classID = ?
             )`,
            [classID, classID]
        );
        return results;
    } catch (e) {
        console.error('Error getting latest recognition:', e);
        throw e;
    }
}
