import { Component } from 'react'
import { View, Text, Canvas, Button, Icon } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'


export default class Index extends Component {

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  ctx;
  CANVAS;
  SOURCEIMAGE;
  heartMap;
  fullModeMap;
  /**
   * 360  8x2 4x2x3
   * 120 40
   */
  squareLength = 40;//背景单元长度
  SudokuLength = 120;//九宫格长度=背景单元长度x3
  squarePadding = 2;//背景单元长度
  SudokuPadding = 4;//九宫格长度=背景单元长度x3

  async onReady() {
    await this.initCanvas();
    this.drawSudoku();
  }
  //初始朋友圈背景画布
  initCanvas() {
    return new Promise((resolve, reject) => {
      try {
        Taro.createSelectorQuery().select('#heart-canvas').fields({ node: true, context: true, size: true }).exec((res) => {
          console.log(res);
          //无法获取到 canvas dom https://github.com/NervJS/taro/issues/7116
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          this.ctx = ctx;
          this.CANVAS = canvas;

          const sysInfo = Taro.getSystemInfoSync()
          const dpr = sysInfo.pixelRatio;

          canvas.width = res[0].width * dpr;
          canvas.height = res[0].height * dpr;
          ctx.scale(dpr, dpr);

          this.squareLength = (sysInfo.screenWidth - 20 - this.SudokuPadding * 2 - this.squarePadding * 6) / 9;
          this.SudokuLength = this.squareLength * 3;

          resolve({ canvas, ctx });
        })
      } catch (error) {
        reject(error)
      }

    })
  }
  initCanvas1 = () => {
    this.ctx = Taro.createCanvasContext('heart-canvas', this);

    const sysInfo = Taro.getSystemInfoSync()
    // const dpr = sysInfo.pixelRatio;

    // canvas.width = res[0].width * dpr;
    // canvas.height = res[0].height * dpr;
    // this.ctx.scale(dpr, dpr);
    this.squareLength = (sysInfo.screenWidth - 20 - this.SudokuPadding * 2 - this.squarePadding * 6) / 9;
    this.SudokuLength = this.squareLength * 3;
  }
  /**
   * 画九背景
   * @param pos 
   * @param picPos 
   * @param fullMode 
   */
  drawSudoku(pos = 9, picPos = [0, 0, 0, 0, 0, 0, 0, 0, 0], fullMode = 0) {
    for (let index = 0; index < pos; index++) {
      this.heartMap && (picPos = this.heartMap[index]);
      this.fullModeMap && (fullMode = this.fullModeMap[index]);
      console.log(picPos, fullMode);

      this.drawSudokuHandler(index, picPos, fullMode);
    }
  }
  drawSudokuHandler(pos, picPos, fullMode) {
    let x, y, l;
    if (fullMode) {
      x = (this.squareLength * 3 + this.squarePadding * 2 + this.SudokuPadding) * (pos % 3);
      x += 10;
      y = (this.squareLength * 3 + this.squarePadding * 2 + this.SudokuPadding) * ~~(pos / 3);
      l = this.squareLength * 3 + this.squarePadding * 2
      this.drawPic(x, y, l);
    } else {
      for (let index = 0; index < picPos.length; index++) {
        const e = picPos[index];
        x = (this.squareLength + this.squarePadding) * (index % 3) + (this.squareLength * 3 + this.squarePadding * 2 + this.SudokuPadding) * (pos % 3);
        x += 10;
        y = (this.squareLength + this.squarePadding) * ~~(index / 3) + (this.squareLength * 3 + this.squarePadding * 2 + this.SudokuPadding) * ~~(pos / 3);
        if (e) {
          this.drawPic(x, y);
        } else {
          this.drawSquare(x, y);

          // this.drawSquare((this.squareLength + this.squarePadding) * 0, 0);
          // this.drawSquare((this.squareLength + this.squarePadding) * 1, 0);
          // this.drawSquare((this.squareLength + this.squarePadding) * 2, 0);

          // this.drawSquare((this.squareLength + this.squarePadding) * 0, (this.squareLength + this.squarePadding) * 1);
          // this.drawSquare((this.squareLength + this.squarePadding) * 1, (this.squareLength + this.squarePadding) * 1;
          // this.drawSquare((this.squareLength + this.squarePadding) * 2, (this.squareLength + this.squarePadding) * 1);

          // this.drawSquare((this.squareLength + this.squarePadding) * 0, (this.squareLength + this.squarePadding) * 2);
          // this.drawSquare((this.squareLength + this.squarePadding) * 1, (this.squareLength + this.squarePadding) * 2;
          // this.drawSquare((this.squareLength + this.squarePadding) * 2, (this.squareLength + this.squarePadding) * 2);
        }

      }
    }
  }
  //画背景单元
  drawSquare(x, y, l = this.squareLength, fillStyle = 'pink') {
    this.ctx.fillStyle = fillStyle;
    this.ctx.fillRect(x, y, l, l);
  }
  drawPic(x, y, l = this.squareLength) {
    this.ctx.drawImage(this.SOURCEIMAGE, x, y, l, l);
    // this.ctx.draw()
  }
  //获取图片
  getImageInfo(imgSrc) {
    console.log(imgSrc, 'getImageInfoMp')
    return new Promise((resolve, reject) => {
      Taro.getImageInfo({
        src: imgSrc,
        success: (image) => {
          resolve(image);
          console.log('获取成功', image)
        },
        fail: (err) => {
          reject(err);
          console.log('获取失败', err)
        }
      });
    });
  }

  chooseImage = () => {
    let that = this;
    Taro.chooseImage({
      success: function (res) {
        that.heartMap = [
          [0, 0, 0, 0, 0, 1, 0, 1, 1],
          [0, 0, 0, 1, 0, 1, 1, 1, 1],
          [0, 0, 0, 1, 0, 0, 1, 1, 0],

          [1, 1, 1, 1, 1, 1, 0, 1, 1],
          [2, 2, 2, 2, 2, 2, 2, 2, 2],
          [1, 1, 1, 1, 1, 1, 1, 1, 0],

          [0, 0, 1, 0, 0, 0, 0, 0, 0],
          [1, 1, 1, 1, 1, 1, 0, 1, 0],
          [1, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        that.fullModeMap = [0, 0, 0, 0, 1, 0, 0, 0, 0];

        const ig = that.CANVAS.createImage();

        ig.onload = () => {
          console.log('img onload');
          that.SOURCEIMAGE = ig;
          that.drawSudoku();
        }
        ig.onerror = () => {
          console.log('img onerror');
        }
        ig.src = res.tempFilePaths[0];


      }
    })
  }

  saveImage = () => {
    //判断用户授权
    Taro.getSetting({
      success(res) {
        console.log('获取用户权限', res.authSetting)
        if (Object.keys(res.authSetting).length > 0) {
          //判断是否有相册权限
          if (res.authSetting['scope.writePhotosAlbum'] == undefined) {
            //打开设置权限
            Taro.openSetting({
              success(ress) {
                console.log('设置权限', ress.authSetting)
              }
            })
          } else {
            if (!res.authSetting['scope.writePhotosAlbum']) {
              //打开设置权限
              Taro.openSetting({
                success(resss) {
                  console.log('设置权限', resss.authSetting)
                }
              })
            }
          }
        } else {
          return
        }
      }
    })
    var that = this
    Taro.canvasToTempFilePath({
      canvasId: 'heart-canvas',
      canvas: that.CANVAS,
      quality: 1,
      fileType: 'jpg',
      x: 10,
      width: that.SudokuLength * 3 + that.SudokuPadding * 2 + that.SudokuPadding * 2 + that.squarePadding * 6 - 10,
      height: that.SudokuLength * 3 + that.SudokuPadding * 2 + that.SudokuPadding * 2 + that.squarePadding * 6 - 10,
      destWidth: that.SudokuLength * 3 + that.SudokuPadding * 2 + that.SudokuPadding * 2 + that.squarePadding * 6 - 10,
      destHeight: that.SudokuLength * 3 + that.SudokuPadding * 2 + that.SudokuPadding * 2 + that.squarePadding * 6 - 10,
      success: (ressss) => {
        console.log('保存到相册', ressss);
        Taro.saveImageToPhotosAlbum({
          filePath: ressss.tempFilePath,
          success() {
            Taro.showToast({
              title: '已保存到相册',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    }, this);
  }

  render() {
    return (
      <View className='index'>
        {/* <Text>朋友圈分享图片生成</Text> */}
        <Canvas type='2d' style='width:400px;height:400px;' canvasId='heart-canvas' id='heart-canvas' />
        <View className='btn-wrap'>
          <View className='icon-box'>
            <View className='icon-small-wrp'>
              <Icon className='icon-small' type='info_circle' size='16'></Icon>
            </View>
            <View className='icon-box-ctn'>
              选择要分享的图片，生成后保存到相册中就可以发朋友圈啦~。如果您有好的建议或发现Bug请右上角向开发者反馈。
            </View>
          </View>
          <Button type='primary' onClick={this.chooseImage}>选择图片</Button>
          <Button type='primary' onClick={this.saveImage}>保存到相册</Button>
        </View>

      </View>
    )
  }
}
