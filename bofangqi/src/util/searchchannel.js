import {ajax} from './original_ajax'
import storageUtils from './storageUtils'
export default {
  // 获取频道
  getChannel () {
    ajax({
      method: 'GET',
      async: false,
      url: 'http://api.jirengu.com/fm/getChannels.php',
      success: function (response) {
        var jsonObj = JSON.parse(response);
        var channelArr = jsonObj['channels'];
        var channel = getRandomChannel(channelArr);
        storageUtils.saveTodos(channel)
        // getMusic();
      }
    });
  },
  // 获取随机频道
  getRandomChannel (channelArr) {
    var randomNum = Math.floor(channelArr.length * Math.random());
    return channelArr[randomNum];

    // channel.innerHTML = randomChannel.name;
    // channel.setAttribute('data-channel-id', randomChannel.channel_id);
  },
  getMusic () {
    ajax({
      method: 'GET',
      url: 'http://api.jirengu.com/fm/getSong.php',
      data: {
        "channel": storageUtils.readTodos()
      },
      success: function (response) {
        var jsonObj = JSON.parse(response);
        var songObj = jsonObj['song'][0];

        // songTitle.innerHTML = songObj.title;
        // singer.innerHTML = songObj.artist;
        // recordImg.src = songObj.picture;
        // bigBg.src = songObj.picture;
        // musicAudio.src = songObj.url;
        // musicAudio.setAttribute('data-sid', songObj.sid);
        // musicAudio.setAttribute('data-ssid', songObj.ssid);
        musicAudio.play();
        isLoading = false;
        getlyric();

        // 解决首次进入页面时，自动播放的兼容问题，不自动播放
        if (num === 1) {
          musicAudio.onplaying = function () {
            this.pause();
            musicAudio.onplaying = null;
          };
          num++;
        }
      }
    });
  }
}



