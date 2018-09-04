<template>
  <header>
    <h1 class="song-title">{{title}}</h1>
    <div class="singer">{{singer}}</div>
  </header>
</template>

<script>
    import Public from '../util/publicVue'
    export default {
      name: "Header",
      data(){
        return {
          title:'',
          singer:''
        }
      },
      mounted(){
        Public.$on('songmsg',(msg)=>{
          this.title = msg.title
          this.singer = msg.artist
        })
      }

    }
</script>
<style scoped>
  header{
    box-sizing: border-box;
    height: 14%;
    padding: 0.625rem 0 0;
    /*min-height: 78px;*/
    min-height: 2.4375rem;
    text-align: center;
  }
  header .song-title{
    width: 100%;
    font-size: 0.625rem;
    color: #fff;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  header .singer{
    padding-top: 5px;
    width: 100%;
    font-size: 0.5rem;
    margin-top: 0.25rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
