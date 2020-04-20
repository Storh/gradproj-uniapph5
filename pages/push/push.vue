<template>
	<view>
		<!-- 取消和发布按键区域 -->
		<view class="buttom">
			<button @click="backView" class="cancel">返回</button>
			<button class="push" @click="pushContent(data)">发布</button>
		</view>
		<!-- 内容填写位置 -->
		<view class="details">
			<input class="title" v-model="data.title" placeholder="添加标题…" @blur="markPush" />
			<textarea maxlength="-1" class="content" v-model="data.content" placeholder="添加发布的内容…" @blur="markPush" />
			<input class="link_external_url"
        v-model="data.link_external_url"
        placeholder="可添加链接"
        @blur="markPush"  />
      <input class="link_external_name"
        v-model="data.link_external_name"
        placeholder="可命名链接"
        @blur="markPush"   />
    </view>
    <view class="pictures">
      <image-cropper @confirm="confirm" :src="tempFilePath" @cancel="cancel"></image-cropper>
      <block v-for="(item, index) in data.images" :key="index">
        <view class="pictures-item">
          <image mode="aspectFill" :src="item.src" @tap="imageCropper(index)"></image>
          <view :data-index="index" @tap="delImg">
            <ailin-icon class="delimg" iconId="#icon-fabu-off"></ailin-icon>
          </view>
        </view>
      </block>
      <!-- 灰色方框+加号 -->
      <view v-if="addImgBtn" class="pictures-item" @tap="chooseImg">
        <view class="plusback">
          <ailin-icon class="plus" iconId="#icon-plus"></ailin-icon>
        </view>
      </view>
    </view>
    <view class="add">
      <!-- 这里是分割线 -->
      <ailin-icon class="icon-biaoqian" iconId="#icon-biaoqian"></ailin-icon>
      <view class="add_label">
        <text class="label">添加标签，让更多人看到</text>
        <view @tap="toKeyWord">
          <text class="label_text">{{ data.keyword }}</text>
          <ailin-icon class="arrowright_1" iconId="#icon-right-copy"></ailin-icon>
        </view>
      </view>
      <!-- 这里是分割线 -->
      <ailin-icon class="icon-wode-off" iconId="#icon-wode-off"></ailin-icon>
      <view class="able_view">
        <text class="able">谁可以看</text>
        <view @tap="changeViewType">
          <text class="able_text">{{ viewtypetext[data.show_type - 1] }}</text>
          <ailin-icon class="arrowright_2" iconId="#icon-zhuan"></ailin-icon>
        </view>
      </view>
      <!-- 这里是分割线 -->
      <ailin-icon v-if="typekey" class="icon-fabu-deadline" iconId="#icon-fabu-deadline"></ailin-icon>
      <view v-if="typekey" class="deadline">
        <text class="deadline_date">截止日期</text>
        <view class="date_input">
          <input
            class="uni-input"
            maxlength="17"
            v-model="data.closing_date"
            style="text-align: right;"
            placeholder="年-月-日 时:分"
          />
        </view>
      </view>
      <!-- 这里是分割线 -->
      <ailin-icon v-if="typekey" class="icon-fabu-date" iconId="#icon-fabu-date"></ailin-icon>
      <view v-if="typekey" class="max_people">
        <text class="max">活动人数</text>
        <input
          class="max_num"
          placeholder="0"
          type="number"
          v-model="data.num_upper_limit"
          @blur="markPush"
        />
      </view>
    </view>
  </view>
</template>

<script>
import ImageCropper from "@/components/ailin-image-cropper.vue";
import Base from "../../api/base";
import Content from "../../api/content";
export default {
  components: { ImageCropper },
  data() {
    return {
		doCrop:0,//要被更换的
	  sendPoint:{},
      getCanvPoint: new Array(), //识别结果数组
      rowImage: [],
      tempFilePath: "",
      // 是否显示上传按键
      addImgBtn: true,
      viewtypetext: ["仅本社区可见", "本街道可见"],
      typekey: false,
      data: {
        type_id: undefined,
        title: "",
        images: [],
        content: "",
        show_type: 1,
        keyword: "",
        closing_date: "",
        num_upper_limit: "",
        link_external_url: "",
        link_external_name: ""
      },
      pushInfo: ["求助", "问答", "闲置", "活动", "团购", "话题"],
      // 未上传的标记
      unPush: false
      // date: currentDate
    };
  },
  onLoad(params) {
    // 设置标题和发布题材类型
    let title = "发布" + params.title;
    var me = this;
    me.data.type_id = params.key;
    if (params.key == 4) {
      uni.redirectTo({ url: "activity" });
    } else if (params.key == 5) {
      uni.redirectTo({ url: "pack" });
    } else {
      uni.setNavigationBarTitle({
        title: title
      });
    }
  },
  onUnload() {},
  methods: {
    saveData() {
      uni.setStorageSync("HistoryPush", this.data);
    },
    pushFailed(mesg) {
      uni.showToast({
        title: mesg,
        icon: "none",
        duration: 3000
      });
    },
    // 发布
    pushContent(data) {
      if (data.title === "") {
        this.pushFailed("标题必填");
      } else if (data.content === "") {
        this.pushFailed("内容必填");
      } else if (data.images.length < 1) {
        this.pushFailed("图片必填");
      } else {
        uni.showLoading({
          title: "发布中"
        });
        Content.addDetail(data).then(res => {
          uni.hideLoading();
          if (res.data.data.content_id) {
            this.unPush = false;
            uni.showModal({
              title: "成功",
              content: "发布成功",
              confirmColor: "#3CC51F",
              showCancel: false,
              success: function() {
                uni.removeStorageSync("HistoryPush");
                uni.navigateBack();
              }
            });
          }
        });
      }
    },
    // 修改可见范围
    changeViewType() {
      if (this.data.show_type == 1) {
        this.data.show_type = 2;
      } else {
        this.data.show_type = 1;
      }
    },
    // 标记内容未上传
    markPush() {
      // this.saveData();
      this.unPush = true;
    },
    // 点击取消返回
    backView() {
      // 检查是否有未发布内容
      if (this.unPush) {
        uni.showModal({
          title: "提醒",
          content: "您有未发布的内容，是否继续编辑",
          confirmText: "编辑",
          cancelText: "放弃",
          cancelColor: "#DD524D",
          success: function(showres) {
            if (showres.cancel) {
              uni.removeStorageSync("HistoryPush");
              uni.navigateBack();
            }
          }
        });
      } else {
        uni.navigateBack();
      }
    },
    // 前往关键词修改界面
    toKeyWord() {
      var me = this;
      uni.$once("updatekeyword", function(data) {
        me.data.keyword = data.lab;
      });
      uni.navigateTo({
        url: "keyword?lab=" + this.data.keyword
      });
    },
    confirm(e) {
      this.tempFilePath = "";
	  this.compressImg(e.detail.tempFilePath);
    },
    cancel() {
		this.doCrop=0
		this.tempFilePath = "";
    },
    // 图片裁剪
    imageCropper(index) {
      const imgObj = this.rowImage[index];
	  this.doCrop=index+1
      this.tempFilePath = imgObj.path;
    },
    // 移除预览图片
    delImg(e) {
      let imgindex = e.currentTarget.dataset.index;
      this.data.images.splice(imgindex, 1);
      this.rowImage.splice(imgindex, 1);
      this.addImgBtn = true;
    },
    chooseImg() {
      uni.chooseImage({
        count: 1,
        success: res => {
          this.rowImage.push(res.tempFiles[0]); //保留原图片
          this.checkImg(res.tempFiles[0]);
        }
      });
    },
    checkImg(imgObj) {
      if (imgObj.size > 204800) {
        // 图片大于200k
        this.compressImg(imgObj.path);
      } else {
        this.upLoadImg(imgObj.path);
      }
    },
    upLoadImg(imgURL) {
      uni.showLoading({
        title: "上传中"
      });
      Base.uploadPhoto(imgURL, 2)
        .then(res => {
          let item = {};
          item.id = res.data.data.id;
          item.src = res.data.data.src;
		  if(this.doCrop)
		  {
			  this.$set(this.data.images, (this.doCrop-1), item);
			  this.doCrop=0
		  }else{
		this.data.images.push(item);
		  }
          if (this.data.images.length === 6) {
            this.addImgBtn = false;
          }
          this.markPush();
          uni.hideLoading();
        })
        .catch(err => {
          uni.hideLoading();
		  var title="上传失败，请重新选择图片"
		  if(this.doCrop)
		  {
			  this.doCrop=0
		title="修改失败，请重新裁剪图片"
		}else{
		this.data.images.pop();
		  }
          uni.showToast({
            title: title,
            icon: "none",
            duration: 3000
          });
        });
    },
    compressImg(imageObj) {
      var me = this;
      // 新建图片对象
      var quality = 0.92;
      var img = new Image();
      img.src = imageObj;
      img.onload = function() {
        var that = this;
        var w = that.width,
          h = that.height,
          scale = w / h;
        if (w > h) {
          w = 720;
          h = Math.floor(w / scale);
        } else {
          h = 720;
          w = Math.floor(h * scale);
        }
        //生成canvas
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        // 创建属性节点
        var anw = document.createAttribute("width");
        anw.nodeValue = w;
        var anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(that, 0, 0, w, h);
        var base64 = canvas.toDataURL("image/jpeg", quality);
        me.upLoadImg(base64);
      };
    }
  }
};
</script>

<style>
@import url("push.css");
.link_external_name {
  position: absolute;
  top: 310upx;
  right: 30upx;
  width: 200upx;
  font-size: 28upx;
}
.link_external_url {
  position: absolute;
  top: 310upx;
  left: 58upx;
  width: 400upx;
  font-size: 28upx;
}
</style>
