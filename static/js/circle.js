var toCanvas = function(id, progress, r, lineWidth) {
  // canvas进度条
  var canvas = document.getElementById(id),
    ctx = canvas.getContext("2d"),
    percent = progress || 1, //最终百分比
    circleX = canvas.width / 2, //中心x坐标
    circleY = canvas.height / 2, //中心y坐标
    radius = r || 50, //圆环半径//
    lineWidth = lineWidth || 10, //圆形线条的宽度
    fontSize = 20; //字体大小

  var img = new Image()
  img.src = 'http://obng7479r.bkt.clouddn.com/images/blog/other/canvas-bg.png'
  // img.src = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1536744634926&di=11e1244a94691317c23403c02479178b&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F810a19d8bc3eb135056bef87ad1ea8d3fd1f4459.jpg'
  var newFill = null;

  function setImageFill() {
    newFill = ctx.createPattern(img, 'no-repeat');
    drawImage(circleX, circleY, radius, Math.PI * 3 / 2, 0);
  }

  function drawImage(cx, cy, r, startAngle, x) {
    if (x >= percent) {
      return
    }

    // if (window.innerWidth<768) {
    //   let deviceScale = window.devicePixelRatio
    //   ctx.clearRect(0, 0, cx*2/deviceScale, cy*2/deviceScale);
    //   ctx.lineWidth = deviceScale/lineWidth;
    //   ctx.lineCap = 'round'
    //   ctx.beginPath();
    //
    //   ctx.strokeStyle = newFill;
    //
    //   ctx.arc(cx/deviceScale, cy/deviceScale, r/deviceScale, startAngle, percent * 2 * Math.PI /100 + startAngle, false);
    //
    //
    //   ctx.stroke();
    //
    //   ctx.closePath()
    //
    //   ctx.scale(deviceScale,deviceScale)
    //
    //
    //   return
    // }

    ctx.clearRect(0, 0, cx*2, cy*2);

    ctx.lineWidth = lineWidth;

    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.strokeStyle = newFill;
    if (x < percent) {
      if (x / percent > 0.90) {
        x += 0.5;
      } else if (x / percent > 0.80) {
        x += 0.7;
      } else if (x / percent > 0.70) {
        x += 0.9;
      } else {
        x += 1.5;
      }
    } else {
      x = 0;
    }
    ctx.arc(cx, cy, r, startAngle, percent * 2 * Math.PI /100 + startAngle, false);
    ctx.stroke();




    requestAnimationFrame(function() {
      drawImage(cx, cy, r, startAngle, x);
    });
  }


  //画弧线
  function sector(cx, cy, r, startAngle, endAngle, beginColor, endColor) {

    // if (process >= percent) {
    //   clearInterval(circleLoading);
    // }

    ctx.beginPath();
    //ctx.moveTo(cx, cy + r); // 从圆形底部开始画
    ctx.lineWidth = lineWidth;

    // 渐变色 - 可自定义
    var linGrad = ''
    if (startAngle == Math.PI * 3 / 2) {
      linGrad = ctx.createLinearGradient(
        circleX, circleY - radius, circleX + radius, circleY
      );
    } else if (startAngle == Math.PI * 4 / 2) {
      linGrad = ctx.createLinearGradient(
        circleX + radius, circleY, circleX, circleY + radius
      );
    } else if (startAngle == Math.PI * 5 / 2) {
      linGrad = ctx.createLinearGradient(
        circleX, circleY + radius, circleX - radius, circleY
      );
    } else if (startAngle == Math.PI * 6 / 2) {
      linGrad = ctx.createLinearGradient(
        circleX - radius, circleY, circleX, circleY - radius
      );
    }



    linGrad.addColorStop(0, beginColor);
    linGrad.addColorStop(1, endColor);
    ctx.strokeStyle = linGrad;




    // ctx.drawImage(img,0,0,cx.cy)

    //圆弧两端的样式
    ctx.lineCap = 'round';

    //圆弧
    ctx.arc(
      cx, cy, r,
      startAngle,
      startAngle + endAngle / 100 * (Math.PI * 2),
      false
    );
    ctx.stroke();



  }

  // 刷新
  function loading() {


    // if (process >= percent) {
    //   clearInterval(circleLoading);
    // }

    //清除canvas内容

    ctx.clearRect(0, 0, circleX * 2, circleY * 2);

    if (img.complete) {
      setImageFill();
    } else {
      img.onload = setImageFill;
      return
    }

    // 圆形
    // circle(circleX, circleY, radius);

    // 圆弧
    // if (process > 0) {
    //   sector(circleX, circleY, radius, Math.PI * 3 / 2, process, "black", 'yellow');
    // }
    // if (process > 25) {
    //   sector(circleX, circleY, radius, Math.PI * 4 / 2, process - 25, "yellow", 'green');
    // }
    // if (process > 50) {
    //   sector(circleX, circleY, radius, Math.PI * 5 / 2, process - 50, "green", 'red');
    // }
    // if (process > 75) {
    //   sector(circleX, circleY, radius, Math.PI * 6 / 2, process - 75, "red", 'black');
    // }





    // sector(circleX, circleY, radius, Math.PI * 3 / 2, process, 'blue', 'green');
    //两端圆点
    // smallcircle1(circleX+Math.cos(2*Math.PI/360*120)*radius, circleX+Math.sin(2*Math.PI/360*120)*radius, 5);
    // smallcircle2(circleX+Math.cos(2*Math.PI/360*(120+process*3))*radius, circleX+Math.sin(2*Math.PI/360*(120+process*3))*radius, 5);
    //控制结束时动画的速度
    // if (process / percent > 0.90) {
    //   process += 0.30;
    // } else if (process / percent > 0.80) {
    //   process += 0.55;
    // } else if (process / percent > 0.70) {
    //   process += 0.75;
    // } else {
    //   process += 1.0;
    // }
  }

  // var process = 0.0; // 进度
  // var circleLoading = window.setInterval(function() {
  //   loading();
  // }, 20);

  loading();

}

export default toCanvas;
