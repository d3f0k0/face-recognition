import { create } from "zustand";
import * as SQLite from "expo-sqlite";

import { Class, Student } from './types'

interface ClassState {
    selectedClass: Class | null
    setById: (id: number, database: SQLite.SQLiteDatabase) => void
}

interface StudentState {
    currentStudentList: Student[]
    setById: (id: number, database: SQLite.SQLiteDatabase) => void
}

interface LoadingState {
    isLoading: boolean,
    startLoading: () => void,
    stopLoading: () => void
}

export const useClassStore = create<ClassState>()((set) => ({
    selectedClass: null,
    setById: async (id, database) => {
        const value: Class = await database.getFirstAsync(
            'SELECT * FROM classes WHERE id = ?',
            id
        )
        if (value) {
            set(() => ({ selectedClass: value }))
        }
    }
}))

export const useStudentStore = create<StudentState>()((set) => ({
    currentStudentList: [],
    setById: async (id, database) => {
        const studentList: Student[] = await database.getAllAsync(
            'SELECT * FROM student WHERE classID = ?',
            Number(id)
        )
        if (studentList) {
            set(() => ({ currentStudentList: studentList }));
        } else {
            set(() => ({ currentStudentList: [] }));
        }
    }
}))

export const useLoadingStore = create<LoadingState>()((set) => ({
    isLoading: false,
    startLoading: () => set(() => ({isLoading: true})),
    stopLoading: () => set(() => ({isLoading: false}))
}))