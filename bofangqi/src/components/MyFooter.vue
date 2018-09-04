<template>
  <footer>
    <div class="channel" v-show="!isshow">{{channel.name}}</div>
    <div class="channel" v-show="isshow">&nbsp;</div>
    <div class="progress-bar" ref="progress_bar">
      <div class="progress" ref="myprogress"></div>
      <div class="progress-btn" ref="progressBtn"></div>
    </div>
    <div class="btns">
      <div class="show-lyrics icon-sides" @click="showlyric"></div>
      <div class="change-channel icon-middle" @click="getChangeChannel"></div>
      <div class="play" ref="playbtn" @click="playOrPause"></div>
      <div class="next icon-middle" @click="getMusic"></div>
      <div class="mode icon-sides" ref="mymode" @click="mode"></div>
    </div>
    <div class="glass">
      <img :src="songPicBig">
    </div>
    <audio id="mic_audio" ref="myaudio" ></audio>
  </footer>
</template>

<script>
  import Public from '../util/publicVue'
  import storageUtils from '../util/storageUtils'
  export default {
    name: "MyFooter",
    mounted(){
      this.getChannel();
      this.progressTimer = setInterval(this.activeProgressBar, 300);
      // 进度条操作音乐播放进度，绑定事件
      this.$refs.progressBtn.addEventListener('touchstart', () => {
        clearInterval(this.progressTimer);
      });
      this.$refs.progressBtn.addEventListener('touchmove', (e)=> {
        var progressBar = this.$refs.progress_bar
        var percentNum = (e.targetTouches[0].pageX - progressBar.offsetLeft) / progressBar.offsetWidth;
        if (percentNum > 1) {
          percentNum = 1;
        } else if (percentNum < 0){
          percentNum = 0;
        }
        this.$refs.progressBtn.style.left = percentNum * 100 + '%';
        this.$refs.myprogress.style.width = percentNum * 100 + '%';
      });
      this.$refs.progressBtn.addEventListener('touchend', (e) => {
        var progressBar = this.$refs.progress_bar
        var percentNum = (e.changedTouches[0].pageX - progressBar.offsetLeft) / progressBar.offsetWidth;
        this.$refs.myaudio.currentTime = this.$refs.myaudio.duration * percentNum;
        this.progressTimer = setInterval(this.activeProgressBar, 300);
      });
    },
    data(){
      return {
        songs:'',
        song:'',
        isplay:false,
        channel:'',
        num:1,
        channelArrs:'',
        progressTimer:'',
        isLoading:false,
        recordPic_className:'record-pic mid',
        songPicBig:'',
        sid:'',
        ssid:'',
        isshow:false,
        lyric:''

      }
    },
    methods:{
      //显示歌词
      showlyric(){
        if(this.isshow == false) {
          this.isshow = true
          Public.$emit('showlyric', this.isshow)
          console.log(this.lyric)

          if (!this.lyric) {
            this.getlyric();
          }
        }else if(this.isshow == true){
          this.isshow = false
          Public.$emit('showlyric', this.isshow)
        }
      },
      getlyric () {
        this.$http({
          url:'http://api.jirengu.com/fm/getLyric.php',
          method:'GET',
          params:{
            sid:this.sid
          }
        },false).then((response) =>{
          var lyricsObj = response.body

          if (lyricsObj.lyric) {
            var lineArr = lyricsObj.lyric.split('\n'); // 歌词以排为界数组
            var timeReg = /\[\d{2}:\d{2}.\d{2}\]/g;
            var result = []
            for (var i in lineArr) {
              var time = lineArr[i].match(timeReg);
              if (!time) continue;
              var curStr = lineArr[i].replace(timeReg, '');
              for (var j in time) {
                var t = time[j].slice(1, -1).split(':'); // 时间的格式是[00:00.00] 分钟和毫秒是t[0],t[1]
                var curSecond = parseInt(t[0], 10) * 60 + parseFloat(t[1]);
                result.push([curSecond, curStr]);
              }
            }
            result.sort(function (a, b) {
              return a[0] - b[0];
            });
            this.lyric = result
            Public.$emit('lyric', result)
          }
        })
      },
      activeProgressBar () {
        var percentNum = Math.floor((this.$refs.myaudio.currentTime / this.$refs.myaudio.duration) * 10000) / 100 + '%';
        this.$refs.myprogress.style.width = percentNum;
        this.$refs.progressBtn.style.left = percentNum;

        if (percentNum == '100%' && !this.isLoading && !this.$refs.myaudio.loop) {
          this.isLoading = true
          this.getMusic()
        }
        if (this.$refs.myaudio.paused && this.recordPic_className != 'record-pic mid') {
          this.recordPic_className = 'record-pic mid';
          Public.$emit('className',false)
        } else if (this.recordPic_className != 'record-pic mid rotate' && !this.$refs.myaudio.paused) {
          this.recordPic_className = 'record-pic mid rotate';
          Public.$emit('className',true)
          this.$refs.playbtn.style.backgroundImage = 'url(../static/img/播放.png)';
        }

        // 控制歌词动态滚动
        var lyricsLiArr = this.lyric
        if (lyricsLiArr) {
          for (var i = 0, len = lyricsLiArr.length-1; i < len; i++) {
            var curT = lyricsLiArr[i][0];
            var nexT = lyricsLiArr[i+1][0];
            var curtTime = this.$refs.myaudio.currentTime;
            if ((curtTime > curT) && (curtTime < nexT)) {
              var myposi = -34.75*i + 'px';
              Public.$emit('posi',myposi);
              Public.$emit('active',i)
              // lyricsLiArr[i].className = 'active';
              // lyrics.style.top = (100 - lyricsLiArr[i].offsetTop) + 'px';
            } else {
              // lyricsLiArr[i].className = '';
            }
          }
        }
      },
      // mode按钮
      mode () {
        if (this.$refs.myaudio.loop) {
          this.$refs.myaudio.loop = false;
          this.$refs.mymode.style.backgroundImage = 'url(../static/img/随机.png)'
        } else {
          this.$refs.myaudio.loop = true;
          this.$refs.mymode.style.backgroundImage = 'url(../static/img/单曲循环.png)'
        }
      },
      //播放音乐或暂停播放
      playOrPause(){
        this.$refs.myaudio.onplaying = null;  //  清除audio标签绑定的事件
        if (this.$refs.myaudio.paused) {
          this.$refs.playbtn.style.backgroundImage = 'url(../static/img/播放.png)'
          this.$refs.myaudio.play();
        } else {
          this.$refs.playbtn.style.backgroundImage = 'url(../static/img/暂停.png)';
          this.$refs.myaudio.pause();
        }
      },
      // 获取音乐
      getMusic() {
        this.$http({
          url:'http://api.jirengu.com/fm/getSong.php',
          method:'GET',
          params:{
            "channel":this.channel.channel_id
          }
        }).then((response) =>{
          response = response.body
          this.songs = response.song
          this.song = response.song[0]
          console.log(this.song)
          this.$refs.myaudio.src = response.song[0].url
          //传值给Header组件
          Public.$emit('songmsg',response.song[0]);
          Public.$emit('songPic',this.song.picture)

          this.songPicBig = this.song.picture
          this.sid = response.song[0].sid
          this.getlyric()
          this.isLoading = false;
          //解决首次进入页面时，自动播放的兼容问题，不自动播放
          if (this.num === 1) {
            this.$refs.myaudio.pause()
            this.$refs.myaudio.onplaying = null
            this.num++
          }else {
            this.$refs.myaudio.play()
          }

        })
      },
      // 获取频道
      getChannel() {
        this.$http({
          url:'http://api.jirengu.com/fm/getChannels.php',
          method:'GET',
          emulateJSON : true
        }).then((response) => {
          response = response.body
          console.log(response)
          this.channelArrs = response.channels
          this.getRandomChannel()
          this.getMusic()
        })
      },
      // 获取随机频道
      getRandomChannel() {
        var randomNum = Math.floor(this.channelArrs.length * Math.random())
        this.channel = this.channelArrs[randomNum]
      },
      getChangeChannel(){
        this.getRandomChannel()
        this.getMusic()
      }
    }
  }
</script>

<style scoped>
  footer{
    position: absolute;
    bottom: 0px;
    box-sizing: border-box;
    height: 26%;
    width: 100%;
    /*min-height: 126px;*/
    min-height: 3.9375rem;
  }
  footer .channel{
    text-align: center;
    font-size: 0.5rem;
    /*line-height: 20px;*/
    line-height: 0.625rem;
  }
  .progress-bar{
    position: relative;
    /*height: 4px;*/
    height: 0.125rem;
    /*width: 250px;*/
    width: 7.8125rem;
    /*width: 8.75rem;*/
    border-radius: 0.0625rem;
    background: rgba(255,255,255, 0.4);
    /*margin: 14px auto 20px;*/
    margin: 0.4375rem auto 0.625rem;
  }
  .progress{
    height: 100%;
    width: 0;
    background: red;
    border-radius: 0.0625rem;
  }
  .progress-btn{
    position: absolute;
    left: 0;
    top: -0.09375rem;
    /*width: 16px;*/
    width: 0.5rem;
    height: 0.375rem;
    margin-left: -0.25rem;
    background: #fff;
    border-radius: 0.125rem;
  }

  .btns{
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 0.625rem;
  }
  .icon-sides{
    /*width: 20px*/
    width: 0.625rem;
    height: 0.625rem;
    background-size: 100% 100%;
  }
  .icon-middle{
    width: 0.9375rem;
    height: 0.9375rem;
    border-radius: 50%;
    background-size: 100% 100%;
  }
  .play{
    width: 1.5625rem;
    height: 1.5625rem;
    border-radius: 50%;
    background-size: 100% 100%;
    background-image: url('../../static/img/暂停.png');
  }
  .change-channel{
    background-image: url("../../static/img/唱片.png");
  }
  .next{
    background-image: url('../../static/img/快进.png');
  }
  .show-lyrics{
    background-image: url('../../static/img/列表.png');
  }
  .mode{
    background-image: url('../../static/img/随机.png');
  }
  .glass{
    position: fixed;
    left: 0;
    top: 0;
    /*background: blue;*/
    z-index: -1;
    width: 100%;
    height: 100%;
  }
  .glass img{
    width: 100%;
    height: 100%;
    filter: blur(20px);
  }
</style>
