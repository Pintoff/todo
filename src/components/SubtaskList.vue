<template>
    <ol>
        <li v-for="subtask in subtasks">
        <label class="form-control">
            <input
            type="checkbox"
            v-model="subtask.completed"
            @click.stop
            @change="handleChange($event)"
            />
            {{ subtask.text }}
        </label>
        </li>
    </ol>
  </template>
  
  <script setup>
  const props = defineProps({
    subtasks: Array
  });
  const handleChange = ((event) => {
    event.stopPropagation();
  })
  </script>
  