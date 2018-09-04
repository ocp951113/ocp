<template>
  <div class="content" >
    <div class="record-wrapper" ref="record_wrapper" style="display: block;" v-show="!isshow">
      <div  class="record-bg mid">
        <div v-bind:class="{'record-pic':true ,'mid':true,'rotate':active}">
          <img :src="songPic" alt="唱片图片">
        </div>
      </div>
    </div>
    <div class="lyrics-wrapper" v-show="isshow">
      <ul class="lyrics" ref="lyrics">
        <li v-for="(item,myindex) in mylyric" v-bind:class="[(index===myindex) ? 'active' : '']">{{item[1]}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
  import storageUtils from '../util/storageUtils'
  import Public from '../util/publicVue'

  export default {
    name: "mycontent",
    data(){
      return{
        active:false,
        songPic:'../../static/img/pic.jpg',
        isshow:false,
        mylyric:'',
        index:-1
      }
    },
    mounted(){
      Public.$on('className',(msg)=>{
        this.active=msg
      })
      Public.$on('songPic',(msg)=>{
        this.songPic = msg
      })
      Public.$on('showlyric',(msg)=>{
        this.isshow = msg
      })
      Public.$on('lyric',(msg)=>{
        this.mylyric = msg
      })
      Public.$on('posi',(msg)=>{
        this.$refs.lyrics.style.top = msg;
      })
      Public.$on('active',(msg)=>{
        this.index = msg
      })
    }
  }
</script>

<style scoped>
  .content{
    box-sizing: border-box;
    width: 100%;
    height: 80%;
    /*min-height: 350px;*/
    min-height: 8.125rem;
    overflow: hidden;
  }
  .content .record-wrapper{
    position: relative;

    width: 100%;
    height: 100%;
  }
  .content .mid{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  .content .record-bg{
    /*width: 250px;*/
    margin-top: 0px;
    width: 7.8125rem;
    height: 7.8125rem;
    border: 0.1875rem solid rgba(245, 245, 245, 0.2);
    border-radius: 50%;
    background-image: url('../../static/img/bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
  }
  .content .record-pic{
    /*width: 180px;*/
    margin-top: 35px;
    width: 5.625rem;
    height: 5.625rem;
    border-radius: 50%;
    overflow: hidden;
  }
  .content .record-pic img{
    width: 100%;
    height: 100%;
    display: block;
  }

  .content .lyrics-wrapper{
    /*margin-top: 100px;*/
    position: relative;
    width: 100%;
    height: 400.19px;
    overflow: hidden;
  }
  .lyrics-wrapper .lyrics{
    margin-top: 200px;
    position: relative;
    width: 100%;
    transition: top 0.5s;
    text-align: center;
  }
  .lyrics-wrapper .lyrics li{
    /*padding: 8px 8px;*/
    padding: 0.25rem 0.25rem;
    /*font-size: 14px;*/
    font-size: 0.4375rem;
    /*margin-top: 100px;*/
    /*z-index: 10000;*/
  }
  .lyrics-wrapper .lyrics li.active{
    color: #fff;
  }

  .rotate{
    animation: recordRotate 30s linear 1s infinite;
  }

  @keyframes recordRotate {
    to {
      transform: rotate(360deg);
    }
  }
</style>
