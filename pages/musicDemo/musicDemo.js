// pages/musicDemo/musicDemo.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_url: '../images', //图片地址

    // 音频模块：
    adudioSrc: 'http://dl.stream.qqmusic.qq.com/C400003fJsVr1lXg2K.m4a?vkey=2EA28F4630DDF6CC0406796CA33778475A23BF1B14ACD049415237249EC47B87B659910375F9DBB1663160CB7E189408FA2AD3CBEB8C9B9E&guid=1908569250&uin=494535607&fromtag=66',
    isOpen: false,//播放开关
    starttime: '00:00', //正在播放时长
    duration: '04:13', //总时长
    nowTime:'0',  //当前时间
    beginTime:'0', //开始时间
    endTime:'0',   //结束时间
    disabled:true,   //是否可滑动
    sliderX:0,        //滑锁距离
    mWidth:20,  //滑块的宽度比

  },

 /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var that = this;
    //使用wx.createAudioContext 获取 audio
    that.audioCtx = wx.createAudioContext('myAudio');

  },

  //开始播放
  audioPlay: function () {
    var that = this;
    that.audioCtx.play()
    that.setData({
      isOpen: true,
      disabled:false
    })
  },

  //暂停播放
  audioPause: function () {
    var that = this;
    that.audioCtx.pause()
    that.setData({
      isOpen: false
    })
  },

  //重置播放
  restPlay:function(){
    var that = this;
    that.audioCtx.play()
    that.setData({
      isOpen: true,
      disabled: false
    })
    //设置时间
    that.audioCtx.seek(0);
  },

  //监听播放时长
  audioUpdata(e) {
    var that = this,
       offset = parseInt(offset * 100 / duration),
       duration = e.detail.duration, //总时长
       offset = e.detail.currentTime, //当前播放时长
       currentTime = parseInt(e.detail.currentTime),
       min = "0" + parseInt(currentTime / 60),
      max = parseInt(duration),
      sec = currentTime % 60,
      minHour = "0" + parseInt(currentTime / 3600);

    //控制时间格式 
    if (parseInt(currentTime / 60)>10){
      min = parseInt(currentTime / 60)
    }
    if(min >= 60){
      min = min-60
      if(min < 10){
        min = "0" + min
      }
    }
    if (sec < 10) {
      sec = "0" + sec;
    };

    //起初时间格式：
    var starttime = '',
      sliderX;
    //时间格式长度
    var mWidth = that.data.mWidth;
    if (duration< 3600) {
      starttime = min + ':' + sec; /*00:00 */
      that.setData({
        mWidth: 20
      })
      sliderX = ((100 - mWidth) * currentTime / duration).toFixed(2);
    }
    if (duration >=3600) {
      starttime = minHour + ':' + min + ':' + sec; /*00:00:00 */
      that.setData({
        mWidth: 28
      })
      sliderX = ((100 - mWidth) * currentTime / duration).toFixed(2);
    }

    //设置值
    that.setData({
      offset: currentTime,
      starttime: starttime,
      max: max,
      nowTime: currentTime,
      beginTime:min,
      endTime : max,
      sliderX: sliderX
    })

    //判断音频播放结束
    if (offset >= duration) {
     // console.log("播放结束")
      that.setData({
        starttime: '00:00', //正在播放时长
        isOpen: false,
        offset: 0,
        sliderX: 0
      })
    }
  },

  // 快进15s
  forwardTime(e) {
     var that = this,
        h = 0,
        resultTime = 0,    
        nowtime = parseInt(e.currentTarget.dataset.nowtime),
        endTime = parseInt(e.currentTarget.dataset.endtime),
        h = nowtime + 15;
        resultTime+=h
    if (resultTime > endTime){
      resultTime = endTime
    }
    //设置时间
    that.audioCtx.seek(resultTime);
  },

  //快退15s
  backTime(e) {
    var that = this,
      h = 0,
      resultTime = 0,
      nowtime = parseInt(e.currentTarget.dataset.nowtime),
      beginTime = parseInt(e.currentTarget.dataset.beginTime),
      h = nowtime -15;
    resultTime += h
    if (resultTime > beginTime) {
      resultTime = beginTime
    }
    //设置时间
    that.audioCtx.seek(resultTime);
  },


  //拖动状态
  sliderChange: function (e) {
    var that = this,
      offset = parseInt(e.detail.value);
    //设置时间
    that.audioCtx.play();
    that.setData({
      isOpen: true,
      disabled: false
    })
    that.audioCtx.seek(offset);

  },


  //拖动状态
  onSliderProgress: function(e) {
    var that = this,
      max = e.currentTarget.dataset.alltime,
      currentTime  = e.currentTarget.dataset.curtime;

    // console.log(curTime, allTime);
    // that.initWidth(curTime,allTime);
  
    var sliderX = 0;
    var mWidth = that.data.mWidth;
    if (max < 3600) {
      that.setData({
        mWidth: 20
      })
      sliderX = ((100 - mWidth) * currentTime / max).toFixed(2)
    }
    if (max >= 3600) {
      that.setData({
        mWidth: 28
      })
      sliderX = ((100 - mWidth) * currentTime / max).toFixed(2)
    }
    that.setData({
      sliderX: sliderX
    })

    that.audioCtx.seek(currentTime);

  },


  //音频初始进度条
  initWidth: function (currentTime, max) {
    var that = this,
        sliderX=0;
    var mWidth = that.data.mWidth;
    if (max<3600) {
      that.setData({
        mWidth: 20
      })
      sliderX = ((100 - mWidth) * currentTime / max).toFixed(2)
    }
    if (max >= 3600) {
      that.setData({
        mWidth: 28
      })
      sliderX = ((100 - mWidth) * currentTime / max).toFixed(2)
    }
    that.setData({
      sliderX: sliderX
    })

    that.audioCtx.seek(currentTime);
  },




  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})