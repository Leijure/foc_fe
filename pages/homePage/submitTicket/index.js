import {
  addTicket,
  uploadQiniuImg
} from "../../../utils/req"
import { formatDate } from "../../../utils/util";
import Toast from "@vant/weapp/toast/toast";
import Dialog from "@vant/weapp/dialog/dialog";

var app = getApp();

// 图片、标题、问题描述、校区、机型、是否在保、故障类型

Page({
  data: {
    // 日期区间
    minDate: new Date(2019, 0, 1).getTime(),
    maxDate: new Date().getTime(),
    currentDate: new Date().getTime(),
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      }
      if (type === "month") {
        return `${value}月`;
      }
      if (type === "day") {
        return `${value}日`;
      }
      return value;
    },
    // model: "", // 设备型号
    // 图像链接
    imageUrl: [],
    // 设备问题描述
    problemDesc: "",
    // 购买日期
    purchaseDate: "",
    // 校区
    campusValue: "",
    // 设备类型
    deviceTypeValue: "",
    // 设备品牌
    brandValue: "",
    // 保修状态
    warrantStatusValue: "",
    // 设备问题
    deviceProblemValue: "",
    // 不弹出选择框
    showPopup: 0,
    // showPopup = 1:
    campusList: ["江安", "望江", "华西"],
    // showPopup = 2:
    deviceTypeList: [
      "笔记本 (Laptop)",
      "台式机 (PC/Mac)",
      "移动手机 (Phone)",
      "其他设备 (Others)",
    ],
    // showPopup = 3:
    brandList: [
      "苹果 Apple",
      "戴尔 DELL",
      "华为 HUAWEI",
      "联想 Lenovo",
      "华硕 ASUS",
      "神舟 HASEE",
      "三星 SamSung",
      "微软 MicroSoft",
      "惠普 HP",
      "宏碁 Acer",
      "雷蛇 Razer",
      "ThinkPad",
      "外星人 Alienware",
      "雷神 Thunder",
      "NEC",
      "机械师 MACHENIKE",
      "微星 Msi",
      "炫龙 Shinelon",
      "清华同方",
      "Intel",
      "技嘉 GIGABYTE",
      "海尔 Haier",
      "LG",
      "东芝 Toshiba",
      "松下 Panasonic",
      "Terrans Force",
      "富士通 FUJITSU",
      "爱尔轩 AIERXUAN",
      "酷比魔方 CUBE",
      "锡恩帝 CENDE",
      "海鲅 HIPAA",
      "索立信",
      "夏普 Sharp",
      "SO-SOON",
      "其他",
    ],
    // showPopup = 4:
    warrantStatusList: ["过保", "在保", "未知"],
    // showPopup = 5:
    problemList: ["设备清灰", "系统重装", "无法开机", "设备进水", "软件问题"],
    // userinfo
    qq: app.globalData.userInfo.qq,
    phone: app.globalData.userInfo.phone,
  },
  // 显示页面时更新数据
  onShow() {
    this.reloadData();
  },
  reloadData() {
    this.setData({
      qq: app.globalData.userInfo.qq,
      phone: app.globalData.userInfo.phone,
    });
  },
  onConfirmCampus(event) {
    // 校区
    const {
      value
    } = event.detail;
    this.setData({
      campusValue: value,
      showPopup: 0,
    });
  },
  onConfirmDeviceType(event) {
    // 设备类型
    const {
      value
    } = event.detail;
    this.setData({
      deviceTypeValue: value,
      showPopup: 0,
    });
  },
  onConfirmBrand(event) {
    // 设备品牌
    const {
      value
    } = event.detail;
    this.setData({
      brandValue: value,
      showPopup: 0,
    });
  },
  onConfirmWarrantStatus(event) {
    // 保修状态
    const {
      value
    } = event.detail;
    this.setData({
      warrantStatusValue: value,
      showPopup: 0,
    });
  },
  onConfirmDeviceProblem(event) {
    // 设备问题
    const {
      value
    } = event.detail;
    this.setData({
      deviceProblemValue: value,
      showPopup: 0,
    });
  },
  // 输入框
  onPhoneChange(e) {
    this.setData({
      phone: e.detail
    });
  },
  onQQChange(e) {
    this.setData({
      qq: e.detail
    });
  },
  onProblemDescChange(e) {
    this.setData({
      problemDesc: e.detail
    });
  },
  onConfirmPurchaseDate(event) {
    this.setData({
      showPopup: 0,
      purchaseDate: formatDate(event.detail),
    });
  },
  onClose() {
    this.setData({
      showPopup: 0,
    });
  },
  showPopup(event) {
    this.setData({
      showPopup: parseInt(event.target.dataset.index),
    });
  },
  chooseImage() {
    const that = this;
    wx.chooseMedia({
      count: 4, // 可选择的图片数量
      // sizeType: ['compressed'], // 压缩图片
      mediaType: ["image"],
      sourceType: ["album", "camera"], // 来源：相册或相机
      camera: "back",
      success(res) {
        // console.log(res);
        res.tempFiles.forEach((item) => {
          console.log("start uploading:", item.tempFilePath);
          uploadQiniuImg(item.tempFilePath).then((url) => {
            console.log("qiniu upload success!", url);
            let temp_imageUrl = that.data.imageUrl;
            temp_imageUrl.push(url);
            that.setData({
              imageUrl: temp_imageUrl,
            });
          });
        });
      },
    });
  },
  previewImage(event) {
    wx.previewImage({
      current: event.target.dataset.src,
      urls: this.data.imageUrl,
    });
  },
  deleteImage(event) {
    const image_src = event.target.dataset.src;
    let temp_imageUrl = this.data.imageUrl;
    const image_index = temp_imageUrl.indexOf(image_src); // 查找值的索引
    if (image_index !== -1) {
      temp_imageUrl.splice(image_index, 1); // 删除值
    }
    this.setData({
      imageUrl: temp_imageUrl,
    });
  },
  submitTicket() {
    let fields = {
      "purchaseDate": "购买时间",
      "phone": "手机号",
      "deviceTypeValue": "设备类型",
      "brandValue": "设备品牌",
      "problemDesc": "报修问题描述",
      "deviceProblemValue": "问题类型",
      "qq": "预留QQ号",
      "campusValue": "所在校区"
    }
    for (const field in fields) {
      if (this.data[field] === "") {
        Toast(`请先填写${fields[field]}`);
        return;
      }
    }
    Dialog.confirm({
      title: "确认提交？",
      confirmButtonText: "确认",
      message: `提交后不可更改；技术员会通过您提交的信息联系您。`,
    }).then(() => {
      // on confirm
      console.log(this.data.purchaseDate);
      console.log(this.data.phone);
      console.log(this.data.deviceTypeValue);
      console.log(this.data.brandValue);
      console.log(this.data.problemDesc);
      console.log(this.data.imageUrl);
      console.log(this.data.deviceProblemValue);
      console.log(this.data.qq);
      console.log(this.data.campusValue);
      addTicket(
        this.data.purchaseDate, // 机器购买时间
        this.data.phone, // 用于联系的手机号
        this.data.deviceTypeValue, // 设备类型
        this.data.brandValue, // 设备品牌
        this.data.problemDesc, // 报修问题描述
        this.data.imageUrl[0], // 报修图片地址
        this.data.deviceProblemValue, // 问题类型
        this.data.qq, // 用户预留qq号
        this.data.campusValue, // 用户所在校区
      ).then((returnCode) => {
        if (returnCode === 401) {
          Toast("鉴权失败，请刷新重试");
        } else if (returnCode === 200) {
          Toast("提交工单成功，请耐心等待技术员接单");
          setTimeout(() => {
            wx.navigateBack();
          }, 1000);
        } else if (returnCode === 300) {
          Toast("工单创建失败");
        }
      });
    }).catch(() => {
      // on cancel
      console.log("用户已取消提交");
    });
  },
});