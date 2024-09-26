import { defineStore } from "pinia";
import { ref, watch } from "vue";

interface Subtask {
  id: number;
  text: string;
  completed: boolean;
}

export interface Todo {
  id: number;
  text: string;
  subtasks: Subtask[];
  color: string;
}

export const useTodoStore = defineStore("todoStore", () => {
  const todos = ref<Todo[]>([]);

  const loadTodos = () => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      todos.value = JSON.parse(storedTodos);
    }
  };

  const saveTodos = () => {
    localStorage.setItem("todos", JSON.stringify(todos.value));
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const addTodo = (text: string, color: string = getRandomColor()) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      subtasks: [],
      color,
    };
    todos.value.push(newTodo);
  };

  const editTodo = (id: number, newText: string) => {
    const todo = todos.value.find((todo) => todo.id === id);
    if (todo) {
      todo.text = newText;
    }
  };

  const toggleSubtask = (todoId: number, subtaskId: number) => {
    const todo = todos.value.find((todo) => todo.id === todoId);
    if (todo) {
      const subtask = todo.subtasks.find((subtask) => subtask.id === subtaskId);
      if (subtask) {
        subtask.completed = !subtask.completed;
      }
    }
  };

  const deleteTodo = (id: number) => {
    todos.value = todos.value.filter((todo) => todo.id !== id);
  };

  const addSubtask = (todoId: number, text: string) => {
    const todo = todos.value.find((todo) => todo.id === todoId);
    if (todo) {
      const newSubtask: Subtask = {
        id: Date.now(),
        text: text,
        completed: false,
      };
      todo.subtasks.push(newSubtask);
    }
  };

  const editSubtask = (todoId: number, subtaskId: number, newText: string) => {
    const todo = todos.value.find((todo) => todo.id === todoId);
    if (todo) {
      const subtask = todo.subtasks.find((subtask) => subtask.id === subtaskId);
      if (subtask) {
        subtask.text = newText;
      }
    }
  };

  const removeSubtask = (todoId: number, subtaskId: number) => {
    const todo = todos.value.find((todo) => todo.id === todoId);
    if (todo) {
      todo.subtasks = todo.subtasks.filter(
        (subtask) => subtask.id !== subtaskId,
      );
    }
  };

  watch(todos, saveTodos, { deep: true });

  return {
    todos,
    loadTodos,
    addTodo,
    editTodo,
    toggleSubtask,
    deleteTodo,
    addSubtask,
    removeSubtask,
    editSubtask,
  };
});
