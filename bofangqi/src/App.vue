<template>
  <div id="App">
    <MyHeader/>
    <MyContent/>
    <MyFooter />
  </div>
</template>

<script>

  import Header from './components/Header'
  import MyContent from './components/MyContent'
  import MyFooter from './components/MyFooter'

export default {
  name: 'App',
  components: {
    "MyHeader":Header,
    "MyContent":MyContent,
    "MyFooter":MyFooter
  }
}
</script>

<style>
  @import "../static/css/html5-doctor-reset-stylesheet.min.css";
  html,body{
    height: 100%;
    font-family: Arial, sans-serif;
    background: rgba(10, 40, 20, 0.5);
    color: rgba(255, 255, 255, .5);
  }

</style>
