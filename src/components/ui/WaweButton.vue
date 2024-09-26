<template>
    <button class="wave-button">
      <slot></slot>
    </button>
</template>
  
<style scoped>
  button {
    padding: 15px 30px;
    font-size: 18px;
    color: #fff;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    outline: none;
    position: relative;
    overflow: hidden;
    z-index: 1;
    margin: 2vh;
  }
  
  .wave-button {
    background: linear-gradient(45deg, #59cc9e, #04a732);
    transition: color 0.4s;
  }
  
  .wave-button::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    transform: skewX(-45deg);
    transition: 0.5s;
    z-index: -1;
  }
  
  .wave-button:hover::before {
    left: 100%;
  }
  
  .wave-button:focus {
    outline: 2px solid #04a732;
    outline-offset: 2px;
  }
  
  .wave-button:focus::before {
    left: 100%;
  }
</style>
  