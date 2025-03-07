import { createSlice } from "@reduxjs/toolkit";

interface Todo {
    id: number;
    title: string;
    description: string;
    date: Date;
}

interface TodoState {
    todos: Todo[];
}

const initialState: TodoState = {
    todos: [],
};

const todoSlice = createSlice({
    name: "todo",
    initialState,
    reducers:{
        addTodo:(state,action)=>{
            state.todos.push(action.payload);
        },
        removeTodo:(state,action) => {
            state.todos = state.todos.filter((todo) => todo.id !== action.payload)
        },
        updateTodo: (state, action) => {
            state.todos = state.todos.map((todo) => todo.id === action.payload.id ? { ...todo, ...action.payload } : todo);
          },          
    }
})

export const { addTodo, removeTodo, updateTodo } = todoSlice.actions;
export default todoSlice.reducer;