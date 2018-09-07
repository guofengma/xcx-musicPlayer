// pages/bgAudio/bgAudio.js
//获取应用实例
var app = getApp()
//背景音乐api
const backgroundAudioManager = wx.getBackgroundAudioManager()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_url: '../images', //图片地址
    isOpen:false,  //是否播放开关
    disabled: true,  //是否禁止组件拖动 
    nowtime:0,     //当前时间s
    alltime:401,    //总时长s
    curtime:'00:00',  //当前时间格式
    endtime: '06:41',  //总时间格式
    x: 0, //自动滑动比例 %
    x2: 0, //拖动的比例 %
    tuoX: 0,   //拖动距离
    mx: 0, //movable-view滑动距离x
    moveAreaWidth: 270, //滑线长px
    mState: 0, // 监听是否手指拖动的状态 0：非手指 1：手指
    mWidth: 22,  //滑块的宽度比
    curtime2:'00:00',
    nowtime2:0
  },

  

  //播放
  listenerButtonPlay: function () {
    var that = this;
    backgroundAudioManager.title = '此时此刻'
    backgroundAudioManager.epname = '此时此刻'
    backgroundAudioManager.singer = '许巍'
    backgroundAudioManager.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
    backgroundAudioManager.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46' // 设置了 src 之后会自动播放

    //播放时间
   backgroundAudioManager.startTime = that.data.nowtime;

    //播放
    backgroundAudioManager.play();
    // 监听播放
    backgroundAudioManager.onPlay(() => {
      that.setData({
        isOpen: true,
        disabled: false
      })
    })
    //监听暂停
    backgroundAudioManager.onPause(() => {
      that.setData({
        isOpen: false,
        disabled: true
      })
    })  
    // 监听结束
    backgroundAudioManager.onEnded(() => {
      console.log(backgroundAudioManager.duration);
      that.setData({
        isOpen: false,
        disabled: true,
        nowtime:0,
        x:0,
        x2:0,
        mx:0,
        tuoX:0
      })
      //设置时间
      backgroundAudioManager.seek(0);
      //播放时间
      backgroundAudioManager.startTime = 0;
      //时间格式 00：00
      that.timeTransform(0);

      if (that.data.alltime >= 3600) {
        that.setData({
          curtime: '00:00:00'
        })
      }
    })
    
    //监听播放进度
    backgroundAudioManager.onTimeUpdate(() => {
      that.setData({
          nowtime: backgroundAudioManager.currentTime,      //当前时间
          duration: backgroundAudioManager.duration,           //总时间
          alltime: backgroundAudioManager.duration,             //总时间
      })
     //移动的距离
      that.tolMoveDistance(backgroundAudioManager.currentTime, backgroundAudioManager.duration);
       //时间格式 00：00
      that.timeTransform(backgroundAudioManager.currentTime, backgroundAudioManager.duration);

    })
  },

  //暂停
  listenerButtonPause: function () {
    var that = this;
    backgroundAudioManager.pause();
    backgroundAudioManager.onPause(() => {
      that.setData({
        isOpen: false,
        disabled: true
      })
    })
  },

  //拖动组件
  onChange: function (e) {
    var that = this;
    var v = e.detail.x;  //拖动的距离
    // if (e.detail.source == 'touch'){

    // }
    that.setData({
      tuoX: v,
    })
  },
  //触摸开始
  touchstart: function (e) {
    var that = this;
    var be = that.data.nowtime / that.data.alltime;
    var tuoX = (that.data.moveAreaWidth - that.data.moveAreaWidth * (that.data.mWidth / 100)) * be;
    that.setData({
      mState: 1,
      x2: that.data.x,
      tuoX: tuoX,
    })
  },

  // 触摸移动
  touchmove: function (e) {
    var that = this;
    //比例
    var be = that.data.tuoX / (that.data.moveAreaWidth - that.data.moveAreaWidth * (that.data.mWidth / 100));
    var n = that.data.alltime * be;
    // 滑动时记录比例x2
    var x2 = be * 100 * (1 - (that.data.mWidth / 100));

    var seconds = n

    var hh, mm, ss;
    //传入的时间为空或小于0
    if (seconds == null || seconds < 0) {
      return;
    }
    //得到小时
    hh = seconds / 3600 | 0;
    seconds = parseInt(seconds) - hh * 3600;
    if (parseInt(hh) < 10) {
      hh = "0" + hh;
    }
    //得到分
    mm = seconds / 60 | 0;
    //得到秒
    ss = parseInt(seconds) - mm * 60;
    if (parseInt(mm) < 10) {
      mm = "0" + mm;
    }
    if (ss < 10) {
      ss = "0" + ss;
    }

    that.setData({
      nowtime2: n,
      mState: 1,
      x2: x2,
      mx: that.data.tuoX,
      curtime2: mm + ":" + ss
    })

  },


  //触摸结束
  touchend: function (e) {
    var that = this;
    //比例
    var be = that.data.tuoX / (that.data.moveAreaWidth - that.data.moveAreaWidth * (that.data.mWidth / 100));
    var n = that.data.alltime * be;
    that.setData({
      nowtime:n,
      mState: 0,
      x: that.data.x2,       //结束把x2比例赋值给x
    })
    //设置时间
    backgroundAudioManager.seek(that.data.nowtime);

  },


  // 快进15s
  addTime:function(e){
    var that = this,
      h = 0,
      resultTime = 0,
      nowtime = e.currentTarget.dataset.nowtime,
      alltime = e.currentTarget.dataset.alltime,
      h = nowtime + 15;
    resultTime += h

    if (that.data.isOpen) {
      var be = (that.data.nowtime + 15) / that.data.alltime;
      var tuoX = (that.data.moveAreaWidth - that.data.moveAreaWidth * (that.data.mWidth / 100)) * be;
      that.setData({
        nowtime: nowtime + 15,
        tuoX: tuoX,
        mx: tuoX
      })


      if (resultTime > alltime) {
        resultTime = alltime
      }
    }
 
    //设置时间
    backgroundAudioManager.seek(resultTime);
    //播放时间
    backgroundAudioManager.startTime = resultTime;

   //移动的距离
    that.tolMoveDistance(nowtime, alltime);
    
  },
  
  // 快退15s
  backTime: function (e) {
    var that = this,
      h = 0,
      resultTime = 0,
      nowtime = e.currentTarget.dataset.nowtime,
      h = nowtime - 15;
    resultTime += h
    if (that.data.isOpen) {
      var be = (that.data.nowtime - 15) / that.data.alltime;
      var tuoX = (that.data.moveAreaWidth - that.data.moveAreaWidth * (that.data.mWidth / 100)) * be;
      that.setData({
        nowtime: nowtime - 15,
        tuoX: tuoX,
        mx: tuoX
      })

      if (resultTime < 0) {
        resultTime = 0
      }
    }

    //设置时间
    backgroundAudioManager.seek(resultTime);
    //播放时间
    backgroundAudioManager.startTime = resultTime;
  },


  //重置
  restPlay: function (e) {
    var that = this;
    //调用播放按钮
    that.listenerButtonPlay();

    that.setData({
      isOpen: true,
      nowtime: 0,
      x: 0,
      x2: 0,
      mx: 0,
      tuoX: 0
    })

    if (that.data.alltime >= 3600) {
      that.setData({
        curtime: '00:00:00',
        curtime2: '00:00:00'
      })
    } else {
      that.setData({
        curtime: '00:00',
        curtime2: '00:00'
      })
    }

    backgroundAudioManager.seek(0);
    //播放时间
    backgroundAudioManager.startTime = 0; 
  },

  //移动距离
  tolMoveDistance: function (cur, all) {
    var that = this;
    var x = 0;
    if (cur >= all) {
      cur = all
      backgroundAudioManager.seek(all);
      backgroundAudioManager.startTime = all;
    }

    if (all >= 3600) {
      that.setData({
        mWidth: 28
      })
      x = (100 - that.data.mWidth) * cur / all;
      that.setData({
        x: x
      })
    } else {
      that.setData({
        mWidth: 22
      })
      x = (100 - that.data.mWidth) * cur / all;
      that.setData({
        x: x
      })
    }

    that.setData({
      x: x
    })

  },

  //秒数转换时分秒
  timeTransform(seconds, seconds2) {
    var allSeconds = seconds2;  //总长

    seconds = Math.round(seconds)
    var that = this;
    var hh, mm, ss;
    //传入的时间为空或小于0
    if (seconds == null || seconds < 0) {
      return;
    }
    //得到小时
    hh = seconds / 3600 | 0;
    seconds = parseInt(seconds) - hh * 3600;
    if (parseInt(hh) < 10) {
      hh = "0" + hh;
    }
    //得到分
    mm = seconds / 60 | 0;
    //得到秒
    ss = parseInt(seconds) - mm * 60;
    if (parseInt(mm) < 10) {
      mm = "0" + mm;
    }
    if (ss < 10) {
      ss = "0" + ss;
    }

    //当前时间
    if (allSeconds >= 3600) {
      that.setData({
        curtime: hh + ":" + mm + ":" + ss
      })
    } else {
      that.setData({
        curtime: mm + ":" + ss
      })
    }

    // return hh + ":" + mm + ":" + ss;


    ////////////////////////

    var hh2, mm2, ss2;
    //传入的时间为空或小于0
    if (seconds2 == null || seconds2 < 0) {
      return;
    }
    //得到小时
    hh2 = seconds2 / 3600 | 0;
    seconds2 = parseInt(seconds2) - hh2 * 3600;
    if (parseInt(hh2) < 10) {
      hh2 = "0" + hh2;
    }
    //得到分
    mm2 = seconds2 / 60 | 0;
    //得到秒
    ss2 = parseInt(seconds2) - mm2 * 60;
    if (parseInt(mm2) < 10) {
      mm2 = "0" + mm2;
    }
    if (ss2 < 10) {
      ss2 = "0" + ss2;
    }

    //当前时间

    //当前时间
    if (allSeconds >= 3600) {
      that.setData({
        endtime: hh2 + ":" + mm2 + ":" + ss2
      })
    } else {
      that.setData({
        endtime: mm2 + ":" + ss2
      })
    }
    // return hh2 + ":" + mm2 + ":" + ss2;

  },

  //slide组件拖动
  sliderChange:function(e){
    var that = this,
        v = e.detail.value,
        all = e.currentTarget.dataset.alltime;
    //设置时间
    if (that.data.isOpen){
      backgroundAudioManager.seek(v);
      //播放时间
      backgroundAudioManager.startTime = v;
      that.setData({
        disabled: false
      })
      //移动
      that.tolMoveDistance(v, all);
    }


  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取组件movable-area宽
    that.setData({
      moveAreaWidth: wx.getSystemInfoSync().windowWidth * 0.7
    })

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