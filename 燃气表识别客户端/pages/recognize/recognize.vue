<template>
	<view class="page-container">
		<!-- 顶部装饰 -->
		<view class="top-decoration">
			<view class="decoration-circle circle-1"></view>
			<view class="decoration-circle circle-2"></view>
			<view class="decoration-circle circle-3"></view>
		</view>
		
		<!-- 主标题区域 -->
		<view class="header-section">
			<view class="title-wrapper">
				<text class="main-title">🔍 燃气表识别</text>
				<text class="subtitle">智能识别，精准读数</text>
			</view>
		</view>
		
		<!-- 拍照识别区域 -->
		<view class="photo-card">
			<view class="card-header">
				<text class="card-title">📸 拍照识别</text>
				<text class="card-desc">选择拍照方式开始识别</text>
			</view>
			
			<!-- 拍照预览区域 -->
			<view class="photo-preview-area" @tap="chooseImage">
				<view v-if="!imageUrl" class="empty-photo">
					<view class="camera-icon">
						<text class="icon-text">📷</text>
						<view class="scan-line"></view>
					</view>
					<text class="empty-text">点击拍摄燃气表</text>
					<text class="tip-text">确保数字清晰可见</text>
				</view>
				<image v-else :src="imageUrl" class="preview-image" mode="aspectFit"></image>
			</view>
			
			<!-- 拍照按钮组（移到预览区域外） -->
			<view v-if="!imageUrl" class="photo-buttons-container">
				<view class="photo-btn primary-btn" @tap="takePhoto">
					<text class="btn-icon">📷</text>
					<text class="btn-text">拍照</text>
				</view>
				<view class="photo-btn secondary-btn" @tap="chooseFromAlbum">
					<text class="btn-icon">🖼️</text>
					<text class="btn-text">相册</text>
				</view>
			</view>
			
			<!-- 重新拍照和下一步按钮 -->
			<view v-if="imageUrl && !showForm" class="action-buttons">
				<button class="retake-btn" @tap="clearImage">
					<text class="btn-icon">🔄</text>
					重新拍照
				</button>
				<button class="next-btn" @tap="showInfoForm">
					<text class="btn-icon">➡️</text>
					下一步
				</button>
			</view>
		</view>
		
		<!-- 地址信息填写表单 -->
		<view v-if="showForm" class="form-card">
			<view class="form-header">
				<text class="form-title">📍 填写地址信息</text>
				<text class="form-desc">请完善以下信息以生成准确的识别报告</text>
			</view>
			
			<!-- 楼栋选择 -->
			<view class="form-item">
				<text class="form-label">🏢 选择楼栋</text>
				<picker @change="onBuildingChange" :value="buildingIndex" :range="buildingOptions">
					<view class="picker-item">
						<text class="picker-text">{{ buildingOptions[buildingIndex] }}</text>
						<text class="picker-arrow">▼</text>
					</view>
				</picker>
			</view>
			
			<!-- 详细地址输入 -->
			<view class="form-item">
				<text class="form-label">📍 详细地址</text>
				<textarea 
					v-model="formData.detailAddress" 
					class="form-textarea" 
					placeholder="请输入详细地址，如：1单元101室" 
					maxlength="100"
					auto-height
				></textarea>
			</view>
			
			<!-- 备注输入 -->
			<view class="form-item">
				<text class="form-label">💭 备注信息<text class="optional">(可选)</text></text>
				<textarea 
					v-model="formData.remarks" 
					class="form-textarea" 
					placeholder="如有特殊情况可在此备注" 
					maxlength="200"
					auto-height
				></textarea>
			</view>
			
			<!-- 表单操作按钮 -->
			<view class="form-actions">
				<button class="back-btn" @tap="backToPhoto">
					<text class="btn-icon">◀️</text>
					返回
				</button>
				<button class="confirm-btn" :class="{ 'recognizing': recognizing }" @tap="confirmAndRecognize">
					<text class="btn-icon">{{ recognizing ? '⏳' : '✨' }}</text>
					{{ recognizing ? '识别中...' : '确认识别' }}
				</button>
			</view>
		</view>
		
		<!-- 使用指南 -->
		<view class="guide-card">
			<view class="guide-header">
				<text class="guide-icon">💡</text>
				<text class="guide-title">拍摄指南</text>
			</view>
			
			<view class="guide-list">
				<view class="guide-item" v-for="(tip, index) in shootingTips" :key="index">
					<view class="tip-number">{{ index + 1 }}</view>
					<view class="tip-content">
						<text class="tip-title">{{ tip.title }}</text>
						<text class="tip-desc">{{ tip.desc }}</text>
					</view>
					<text class="tip-emoji">{{ tip.emoji }}</text>
				</view>
			</view>
		</view>
		
		<!-- 识别记录卡片 -->
		<view class="stats-card">
			<view class="stats-header">
				<text class="stats-title">📊 今日识别</text>
				<text class="stats-count">{{ todayCount }}</text>
			</view>
			<view class="stats-desc">
				<text>累计为您识别 {{ totalCount }} 次燃气表读数</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			imageUrl: '',
			recognizing: false,
			todayCount: 0,
			totalCount: 0,
			showForm: false,
			buildingIndex: 0,
			buildingOptions: ['1号楼', '2号楼', '3号楼', '4号楼', '5号楼', '6号楼', '7号楼', '8号楼', '9号楼', '10号楼', '11号楼', '12号楼'],
			formData: {
				building: '1号楼',
				detailAddress: '',
				remarks: ''
			},
			shootingTips: [
				{
					title: '光线充足',
					desc: '确保燃气表数字显示清晰',
					emoji: '💡'
				},
				{
					title: '水平拍摄',
					desc: '保持手机与燃气表平行',
					emoji: '📐'
				},
				{
					title: '完整显示',
					desc: '确保读数完全显示在画面中',
					emoji: '🎯'
				},
				{
					title: '避免反光',
					desc: '防止阴影遮挡数字区域',
					emoji: '🚫'
				},
				{
					title: '核对读数',
					desc: '识别后请验证结果准确性',
					emoji: '✅'
				}
			]
		}
	},
	onLoad() {
		this.loadStatistics();
	},
	onShow() {
		this.loadStatistics();
	},
	methods: {
		// 加载统计数据
		async loadStatistics() {
			try {
				const gasMeter = uniCloud.importObject('gasMeter');
				const result = await gasMeter.getReports('全部');
				
				if (result.errCode === 0) {
					const reports = result.data;
					this.totalCount = reports.length;
					
					// 计算今日识别数量
					const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
					const todayFormatted = today.replace(/-/g, '/'); // YYYY/M/D 格式
					this.todayCount = reports.filter(report => {
						return report.date === todayFormatted || 
							   (report.updateTime && report.updateTime.startsWith(today));
					}).length;
				}
			} catch (error) {
				console.log('加载统计数据失败:', error);
			}
		},
		// 选择图片
		chooseImage() {
			const that = this;
			uni.showActionSheet({
				itemList: ['拍照', '从相册选择'],
				success(res) {
					if (res.tapIndex === 0) {
						that.takePhoto();
					} else {
						that.chooseFromAlbum();
					}
				}
			});
		},
		
		// 拍照
		takePhoto() {
			const that = this;
			uni.chooseImage({
				count: 1,
				sourceType: ['camera'],
				success(res) {
					that.imageUrl = res.tempFilePaths[0];
					uni.showToast({
						title: '拍照成功，请继续填写信息',
						icon: 'success',
						duration: 1500
					});
				},
				fail() {
					uni.showToast({
						title: '拍照失败，请重试',
						icon: 'none',
						duration: 2000
					});
				}
			});
		},
		
		// 从相册选择
		chooseFromAlbum() {
			const that = this;
			uni.chooseImage({
				count: 1,
				sourceType: ['album'],
				success(res) {
					that.imageUrl = res.tempFilePaths[0];
					uni.showToast({
						title: '图片选择成功，请继续填写信息',
						icon: 'success',
						duration: 1500
					});
				},
				fail() {
					uni.showToast({
						title: '选择图片失败，请重试',
						icon: 'none',
						duration: 2000
					});
				}
			});
		},
		
		// 清除图片
		clearImage() {
			this.imageUrl = '';
			this.showForm = false;
			// 重置表单数据
			this.formData = {
				building: '1号楼',
				detailAddress: '',
				remarks: ''
			};
			this.buildingIndex = 0;
		},
		
		// 显示信息填写表单
		showInfoForm() {
			this.showForm = true;
		},
		
		// 返回照片选择
		backToPhoto() {
			this.showForm = false;
		},
		
		// 楼栋选择变化
		onBuildingChange(e) {
			this.buildingIndex = e.detail.value;
			this.formData.building = this.buildingOptions[e.detail.value];
		},
		
		// 确认信息并识别图片
		async confirmAndRecognize() {
			if (!this.imageUrl) {
				uni.showToast({
					title: '请先选择图片',
					icon: 'none'
				});
				return;
			}
			
			// 验证表单数据
			if (!this.formData.detailAddress.trim()) {
				uni.showToast({
					title: '请填写详细地址信息',
					icon: 'none',
					duration: 2000
				});
				return;
			}
			
			this.recognizing = true;
			
			try {
				// 将图片转换为base64
				const imageBase64 = await this.convertImageToBase64(this.imageUrl);
				
				// 上传图片到云存储并获得URL
				let uploadedImageUrl = '';
				try {
					const uploadResult = await uniCloud.uploadFile({
						filePath: this.imageUrl,
						cloudPath: `gas-meter-images/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`,
						cloudPathAsRealPath: true
					});
					uploadedImageUrl = uploadResult.fileID;
				} catch (uploadError) {
					console.log('图片上传失败，继续进行识别但不保存图片URL:', uploadError);
				}
				
				// 调用云对象进行识别
				const gasMeter = uniCloud.importObject('gasMeter');
				// 构建完整地址
				const fullAddress = `${this.formData.building} ${this.formData.detailAddress}`;
				const result = await gasMeter.recognizeGasMeter(
					imageBase64, 
					fullAddress, 
					this.formData.building,
					this.formData.remarks,
					uploadedImageUrl
				);
				
				this.recognizing = false;
				
				if (result.errCode === 0) {
					// 识别成功
					this.todayCount++;
					this.totalCount++;
					
					uni.showToast({
						title: '🎉 识别成功！正在生成报告...',
						icon: 'success',
						duration: 2000
					});
					
					// 保存当前表单数据，用于页面跳转
					const currentImageUrl = this.imageUrl;
					const currentRemarks = this.formData.remarks;
					
					// 重置状态
					this.showForm = false;
					this.imageUrl = '';
					this.formData = {
						building: '1号楼',
						detailAddress: '',
						remarks: ''
					};
					this.buildingIndex = 0;
					
					// 延迟跳转，让用户看到成功提示
					setTimeout(() => {
						uni.navigateTo({
							url: `/pages/reportDetail/reportDetail?reportId=${result.data.reportId}&reading=${result.data.reading}&address=${result.data.address}&date=${result.data.date}&time=${result.data.time}&imageUrl=${encodeURIComponent(currentImageUrl)}&integerPart=${result.data.integerPart}&decimalPart=${result.data.decimalPart}&remarks=${encodeURIComponent(currentRemarks)}`
						});
					}, 1500);
					
				} else {
					// 识别失败
					uni.showModal({
						title: '识别失败',
						content: result.errMsg || '无法识别燃气表读数，请检查图片是否清晰，确保数字显示完整。',
						confirmText: '重新拍照',
						showCancel: true,
						cancelText: '稍后再试',
						success: (modalRes) => {
							if (modalRes.confirm) {
								// 清除当前图片，让用户重新拍照
								this.clearImage();
							}
						}
					});
				}
				
			} catch (error) {
				this.recognizing = false;
				console.error('识别出错:', error);
				
				uni.showModal({
					title: '网络错误',
					content: '识别过程中网络异常，请检查网络连接后重试。',
					confirmText: '重新识别',
					showCancel: true,
					cancelText: '稍后再试',
					success: (modalRes) => {
						if (modalRes.confirm) {
							// 让用户重新识别
							this.confirmAndRecognize();
						}
					}
				});
			}
		},
		
		// 将图片转换为base64编码
		convertImageToBase64(imagePath) {
			return new Promise((resolve, reject) => {
				uni.getFileSystemManager().readFile({
					filePath: imagePath,
					encoding: 'base64',
					success: (res) => {
						resolve(res.data);
					},
					fail: (error) => {
						reject(error);
					}
				});
			});
		},
		
	}
}
</script>

<style scoped>
.page-container {
	min-height: 100vh;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 40rpx 30rpx 120rpx 30rpx;
	position: relative;
}

.top-decoration {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 200rpx;
	overflow: hidden;
	z-index: 0;
}

.decoration-circle {
	position: absolute;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.1);
}

.circle-1 {
	width: 120rpx;
	height: 120rpx;
	top: -40rpx;
	right: 60rpx;
}

.circle-2 {
	width: 80rpx;
	height: 80rpx;
	top: 30rpx;
	left: 40rpx;
}

.circle-3 {
	width: 200rpx;
	height: 200rpx;
	top: -100rpx;
	left: -80rpx;
}

.header-section {
	position: relative;
	z-index: 1;
	text-align: center;
	padding: 60rpx 0 50rpx 0;
}

.title-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.main-title {
	font-size: 48rpx;
	font-weight: bold;
	color: #ffffff;
	margin-bottom: 20rpx;
	text-shadow: 0 2px 8rpx rgba(0, 0, 0, 0.2);
}

.subtitle {
	font-size: 28rpx;
	color: rgba(255, 255, 255, 0.8);
	font-weight: 300;
}

.photo-card {
	background: #ffffff;
	border-radius: 30rpx;
	padding: 40rpx 30rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
	position: relative;
	z-index: 1;
}

.card-header {
	text-align: center;
	margin-bottom: 40rpx;
}

.card-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333333;
	display: block;
	margin-bottom: 10rpx;
}

.card-desc {
	font-size: 26rpx;
	color: #666666;
}

.photo-preview-area {
	background: #f8f9ff;
	border: 3rpx dashed #e0e6ff;
	border-radius: 20rpx;
	min-height: 400rpx;
	position: relative;
	overflow: hidden;
}

.empty-photo {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 400rpx;
	position: relative;
}

.camera-icon {
	position: relative;
	margin-bottom: 30rpx;
}

.icon-text {
	font-size: 120rpx;
	color: #667eea;
}

.scan-line {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 100rpx;
	height: 4rpx;
	background: #667eea;
	border-radius: 2rpx;
	animation: scan 2s infinite;
}

@keyframes scan {
	0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scaleX(0.8); }
	50% { opacity: 1; transform: translate(-50%, -50%) scaleX(1.2); }
}

.empty-text {
	font-size: 32rpx;
	color: #333333;
	font-weight: 600;
	margin-bottom: 15rpx;
}

.tip-text {
	font-size: 24rpx;
	color: #888888;
}

.preview-image {
	width: 100%;
	height: 400rpx;
	border-radius: 16rpx;
}

.photo-buttons-container {
	display: flex;
	justify-content: space-between;
	gap: 20rpx;
	margin-top: 25rpx;
	padding: 0 40rpx;
}

.photo-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 140rpx;
	height: 100rpx;
	border-radius: 20rpx;
	transition: all 0.3s ease;
	box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.1);
	flex: 1;
	max-width: 200rpx;
}

.primary-btn {
	background: linear-gradient(135deg, #667eea, #764ba2);
	color: #ffffff;
}

.secondary-btn {
	background: #ffffff;
	color: #667eea;
	border: 2rpx solid #e0e6ff;
}

.btn-icon {
	font-size: 36rpx;
	margin-bottom: 6rpx;
}

.btn-text {
	font-size: 24rpx;
	font-weight: 600;
}

.action-buttons {
	display: flex;
	gap: 20rpx;
	margin-top: 30rpx;
}

.retake-btn, .recognize-btn {
	flex: 1;
	height: 88rpx;
	border-radius: 44rpx;
	font-size: 28rpx;
	font-weight: 600;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10rpx;
	border: none;
	transition: all 0.3s ease;
}

.retake-btn {
	background: #f5f7fa;
	color: #666666;
}

.recognize-btn {
	background: linear-gradient(135deg, #00c9ff, #92fe9d);
	color: #ffffff;
	box-shadow: 0 4rpx 15rpx rgba(0, 201, 255, 0.3);
}

.recognize-btn.recognizing {
	background: linear-gradient(135deg, #ffa726, #ff7043);
}

.next-btn {
	background: linear-gradient(135deg, #667eea, #764ba2);
	color: #ffffff;
	box-shadow: 0 4rpx 15rpx rgba(102, 126, 234, 0.3);
}

.form-card {
	background: #ffffff;
	border-radius: 30rpx;
	padding: 40rpx 30rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
	position: relative;
	z-index: 1;
}

.form-header {
	text-align: center;
	margin-bottom: 40rpx;
}

.form-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333333;
	display: block;
	margin-bottom: 10rpx;
}

.form-desc {
	font-size: 26rpx;
	color: #666666;
	line-height: 1.5;
}

.form-item {
	margin-bottom: 35rpx;
}

.form-label {
	font-size: 28rpx;
	font-weight: 600;
	color: #333333;
	display: block;
	margin-bottom: 15rpx;
}

.optional {
	font-size: 22rpx;
	color: #999999;
	font-weight: normal;
}

.picker-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 25rpx;
	background: #f8f9ff;
	border: 2rpx solid #e0e6ff;
	border-radius: 15rpx;
	transition: all 0.3s ease;
}

.picker-item:active {
	background: #e8edff;
	border-color: #667eea;
}

.picker-text {
	font-size: 28rpx;
	color: #333333;
}

.picker-arrow {
	font-size: 20rpx;
	color: #667eea;
	transform: rotate(0deg);
	transition: transform 0.3s ease;
}

.form-textarea {
	width: 100%;
	min-height: 120rpx;
	padding: 20rpx 25rpx;
	background: #f8f9ff;
	border: 2rpx solid #e0e6ff;
	border-radius: 15rpx;
	font-size: 28rpx;
	color: #333333;
	line-height: 1.5;
	box-sizing: border-box;
	transition: all 0.3s ease;
}

.form-textarea:focus {
	border-color: #667eea;
	background: #ffffff;
	box-shadow: 0 0 20rpx rgba(102, 126, 234, 0.2);
}

.form-actions {
	display: flex;
	gap: 20rpx;
	margin-top: 40rpx;
}

.back-btn, .confirm-btn {
	flex: 1;
	height: 88rpx;
	border-radius: 44rpx;
	font-size: 28rpx;
	font-weight: 600;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10rpx;
	border: none;
	transition: all 0.3s ease;
}

.back-btn {
	background: #f5f7fa;
	color: #666666;
	border: 2rpx solid #e5e8ec;
}

.confirm-btn {
	background: linear-gradient(135deg, #00c9ff, #92fe9d);
	color: #ffffff;
	box-shadow: 0 4rpx 15rpx rgba(0, 201, 255, 0.3);
}

.confirm-btn.recognizing {
	background: linear-gradient(135deg, #ffa726, #ff7043);
}

.guide-card {
	background: #ffffff;
	border-radius: 30rpx;
	padding: 40rpx 30rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
	position: relative;
	z-index: 1;
}

.guide-header {
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
}

.guide-icon {
	font-size: 40rpx;
	margin-right: 15rpx;
}

.guide-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.guide-list {
	display: flex;
	flex-direction: column;
	gap: 25rpx;
}

.guide-item {
	display: flex;
	align-items: flex-start;
	padding: 25rpx;
	background: #f8f9ff;
	border-radius: 20rpx;
	border-left: 6rpx solid #667eea;
	transition: all 0.3s ease;
}

.tip-number {
	width: 40rpx;
	height: 40rpx;
	background: #667eea;
	color: #ffffff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	font-weight: bold;
	margin-right: 20rpx;
	flex-shrink: 0;
}

.tip-content {
	flex: 1;
	margin-right: 20rpx;
}

.tip-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #333333;
	display: block;
	margin-bottom: 8rpx;
}

.tip-desc {
	font-size: 24rpx;
	color: #666666;
	line-height: 1.5;
}

.tip-emoji {
	font-size: 36rpx;
	flex-shrink: 0;
}

.stats-card {
	background: rgba(255, 255, 255, 0.95);
	border-radius: 30rpx;
	padding: 40rpx 30rpx;
	box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
	position: relative;
	z-index: 1;
	text-align: center;
}

.stats-header {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 15rpx;
}

.stats-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	margin-right: 20rpx;
}

.stats-count {
	font-size: 44rpx;
	font-weight: bold;
	color: #667eea;
	background: linear-gradient(135deg, #667eea, #764ba2);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.stats-desc text {
	font-size: 24rpx;
	color: #666666;
}
</style>