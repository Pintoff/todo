import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export interface Todo {
  id: number;
  text: string;
  description: string; 
}

export const useTodoStore = defineStore('todoStore', () => {
  const todos = ref<Todo[]>([]);

  const loadTodos = () => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      todos.value = JSON.parse(storedTodos);
    }
  };

  const saveTodos = () => {
    localStorage.setItem('todos', JSON.stringify(todos.value));
  };

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      description: '' 
    };
    todos.value.push(newTodo);
  };

  const deleteTodo = (id: number) => {
    todos.value = todos.value.filter(todo => todo.id !== id);
  };

  const editTodo = (id: number, newText: string) => {
    const todo = todos.value.find(todo => todo.id === id);
    if (todo) {
      todo.text = newText;
    }
  };

  const editDescription = (id: number, newDescription: string) => {
    const todo = todos.value.find(todo => todo.id === id);
    if (todo) {
      todo.description = newDescription;
    }
  };

  watch(todos, () => {
    saveTodos();
  }, { deep: true });

  return {
    todos,
    loadTodos,
    addTodo,
    deleteTodo,
    editTodo,
    editDescription 
  };
});
