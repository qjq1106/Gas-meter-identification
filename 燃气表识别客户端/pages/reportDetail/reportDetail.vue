<template>
	<view class="page-container">
		<!-- 顶部状态卡片 -->
		<view class="status-card">
			<view class="status-bg" :class="getStatusBgClass(reportData.status)">
				<view class="status-decoration">
					<view class="decoration-circle circle-1"></view>
					<view class="decoration-circle circle-2"></view>
				</view>
				<view class="status-content">
					<view class="status-header">
						<text class="status-icon">{{ getStatusIcon(reportData.status) }}</text>
						<text class="status-title">抄表报告</text>
					</view>
					<view class="status-badge-container">
						<view class="status-badge" :class="getStatusClass(reportData.status)">
							<text class="status-text">{{ reportData.status || '已识别' }}</text>
						</view>
					</view>
					<text class="report-id">报告编号：#{{ reportData.id || '001' }}</text>
				</view>
			</view>
		</view>

		<!-- 识别图片展示 -->
		<view v-if="reportData.imageUrl" class="image-card">
			<view class="card-header">
				<text class="card-title">📸 识别图片</text>
				<text class="card-subtitle">点击查看原图</text>
			</view>
			<view class="image-container" @tap="previewImage">
				<image :src="reportData.imageUrl" class="report-image" mode="aspectFit"></image>
				<view class="image-overlay">
					<text class="overlay-text">点击预览</text>
				</view>
			</view>
		</view>

		<!-- 读数详情 -->
		<view class="reading-card">
			<view class="card-header">
				<text class="card-title">📊 读数详情</text>
				<text class="card-subtitle">燃气表抄表数据</text>
			</view>
			
			<view class="reading-content">
				<!-- 当前读数 -->
				<view class="reading-item primary">
					<view class="reading-icon">📋</view>
					<view class="reading-info">
						<text class="reading-label">当前读数</text>
						<view class="reading-value-container">
							<text class="reading-value">{{ reportData.reading }}</text>
							<text class="reading-unit">m³</text>
						</view>
					</view>
				</view>

				<!-- 上次读数 -->
				<view v-if="reportData.lastReading" class="reading-item">
					<view class="reading-icon">📝</view>
					<view class="reading-info">
						<text class="reading-label">上次读数</text>
						<view class="reading-value-container">
							<text class="reading-value secondary">{{ reportData.lastReading }}</text>
							<text class="reading-unit">m³</text>
						</view>
					</view>
				</view>

				<!-- 本期用气量 -->
				<view v-if="reportData.lastReading" class="usage-highlight">
					<view class="usage-content">
						<text class="usage-label">本期用气量</text>
						<view class="usage-value-container">
							<text class="usage-value">{{ gasUsage }}</text>
							<text class="usage-unit">m³</text>
						</view>
					</view>
					<view class="usage-trend" :class="getUsageTrend()">
						<text class="trend-icon">{{ getTrendIcon() }}</text>
						<text class="trend-text">{{ getTrendText() }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 基本信息 -->
		<view class="info-card">
			<view class="card-header">
				<text class="card-title">🏠 基本信息</text>
			</view>
			
			<view class="info-list">
				<view class="info-item">
					<view class="info-icon">📍</view>
					<view class="info-content">
						<text class="info-label">详细地址</text>
						<text class="info-value">{{ reportData.address }}</text>
					</view>
				</view>
				
				<view class="info-item">
					<view class="info-icon">📅</view>
					<view class="info-content">
						<text class="info-label">抄表日期</text>
						<text class="info-value">{{ reportData.date }}</text>
					</view>
				</view>
				
				<view class="info-item">
					<view class="info-icon">⏰</view>
					<view class="info-content">
						<text class="info-label">抄表时间</text>
						<text class="info-value">{{ getCurrentTime() }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 备注信息 -->
		<view class="remark-card">
			<view class="card-header">
				<text class="card-title">💬 备注信息</text>
				<view class="edit-btn" @tap="toggleEdit">
					<text class="edit-icon">{{ isEditing ? '✅' : '✏️' }}</text>
					<text class="edit-text">{{ isEditing ? '保存' : '编辑' }}</text>
				</view>
			</view>
			
			<view class="remark-content">
				<textarea 
					v-model="editableRemark" 
					class="remark-input"
					:class="{ 'editing': isEditing }"
					placeholder="请输入备注信息..."
					:disabled="!isEditing"
					maxlength="200">
				</textarea>
				<view class="char-count">{{ editableRemark.length }}/200</view>
			</view>
		</view>

		<!-- 操作按钮 -->
		<view class="action-section">
			<button class="action-btn confirm-btn full-width" @tap="confirmReport">
				<text class="btn-icon">✅</text>
				<text class="btn-text">确认报告</text>
			</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			reportData: {
				id: '',
				reading: '',
				lastReading: '',
				address: '',
				date: '',
				remark: '',
				status: '',
				imageUrl: ''
			},
			editableRemark: '',
			isEditing: false,
			originalRemark: ''
		}
	},
	computed: {
		gasUsage() {
			if (this.reportData.reading && this.reportData.lastReading) {
				const current = parseFloat(this.reportData.reading);
				const last = parseFloat(this.reportData.lastReading);
				return (current - last).toFixed(2);
			}
			return '0.00';
		}
	},
	onLoad(options) {
		// 获取页面参数
		this.reportData = {
			id: options.reportId || options.id || Date.now().toString().slice(-6),
			reading: options.reading || '',
			lastReading: options.lastReading || '',
			address: decodeURIComponent(options.address || ''),
			date: options.date || '',
			time: decodeURIComponent(options.time || ''),
			remark: decodeURIComponent(options.remarks || ''),
			status: options.status || '已识别',
			imageUrl: decodeURIComponent(options.imageUrl || ''),
			integerPart: options.integerPart || '',
			decimalPart: options.decimalPart || ''
		};
		
		this.editableRemark = this.reportData.remark;
		this.originalRemark = this.reportData.remark;
	},
	methods: {
		getStatusBgClass(status) {
			switch(status) {
				case '已确认': return 'status-confirmed-bg';
				case '待审核': return 'status-pending-bg';
				case '异常': return 'status-abnormal-bg';
				default: return 'status-default-bg';
			}
		},
		
		getStatusClass(status) {
			switch(status) {
				case '已确认': return 'status-confirmed';
				case '待审核': return 'status-pending';
				case '异常': return 'status-abnormal';
				default: return 'status-default';
			}
		},
		
		getStatusIcon(status) {
			switch(status) {
				case '已确认': return '✅';
				case '待审核': return '⏳';
				case '异常': return '⚠️';
				default: return '📋';
			}
		},
		
		getUsageTrend() {
			const usage = parseFloat(this.gasUsage);
			if (usage > 80) return 'trend-high';
			if (usage > 40) return 'trend-normal';
			return 'trend-low';
		},
		
		getTrendIcon() {
			const usage = parseFloat(this.gasUsage);
			if (usage > 80) return '📈';
			if (usage > 40) return '➡️';
			return '📉';
		},
		
		getTrendText() {
			const usage = parseFloat(this.gasUsage);
			if (usage > 80) return '用量较高';
			if (usage > 40) return '正常用量';
			return '用量较低';
		},
		
		getCurrentTime() {
			return new Date().toLocaleTimeString('zh-CN', { hour12: false });
		},
		
		previewImage() {
			if (this.reportData.imageUrl) {
				uni.previewImage({
					urls: [this.reportData.imageUrl],
					current: this.reportData.imageUrl
				});
			}
		},
		
		toggleEdit() {
			if (this.isEditing) {
				this.saveRemark();
			} else {
				this.isEditing = true;
			}
		},
		
		async saveRemark() {
			try {
				// 调用云对象更新报告
				const gasMeter = uniCloud.importObject('gasMeter');
				const result = await gasMeter.updateReport(this.reportData.id, {
					remark: this.editableRemark
				});
				
				if (result.errCode === 0) {
					this.reportData.remark = this.editableRemark;
					this.originalRemark = this.editableRemark;
					this.isEditing = false;
					
					uni.showToast({
						title: '备注已保存',
						icon: 'success'
					});
				} else {
					uni.showToast({
						title: '保存失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('保存备注失败:', error);
				uni.showToast({
					title: '保存失败',
					icon: 'none'
				});
			}
		},
		
		async confirmReport() {
			uni.showModal({
				title: '确认报告',
				content: '确定要提交此抄表报告吗？',
				confirmText: '确定提交',
				cancelText: '继续编辑',
				confirmColor: '#4CAF50',
				success: async (res) => {
					if (res.confirm) {
						uni.showLoading({ title: '提交中...' });
						
						try {
							// 调用云对象更新报告状态
							const gasMeter = uniCloud.importObject('gasMeter');
							const result = await gasMeter.updateReport(this.reportData.id, {
								status: '已确认'
							});
							
							uni.hideLoading();
							
							if (result.errCode === 0) {
								uni.showToast({
									title: '报告已确认',
									icon: 'success'
								});
								
								setTimeout(() => {
									uni.navigateBack();
								}, 1500);
							} else {
								uni.showToast({
									title: '提交失败',
									icon: 'none'
								});
							}
						} catch (error) {
							uni.hideLoading();
							console.error('确认报告失败:', error);
							uni.showToast({
								title: '提交失败',
								icon: 'none'
							});
						}
					}
				}
			});
		}
	}
}
</script>

<style scoped>
.page-container {
	min-height: 100vh;
	background: #f5f7fa;
	padding: 30rpx;
	padding-bottom: 140rpx;
}

.status-card {
	margin-bottom: 30rpx;
}

.status-bg {
	position: relative;
	border-radius: 25rpx;
	overflow: hidden;
	padding: 40rpx 30rpx;
}

.status-confirmed-bg {
	background: linear-gradient(135deg, #4CAF50, #66BB6A);
}

.status-pending-bg {
	background: linear-gradient(135deg, #FF9800, #FFB74D);
}

.status-abnormal-bg {
	background: linear-gradient(135deg, #F44336, #EF5350);
}

.status-default-bg {
	background: linear-gradient(135deg, #667eea, #764ba2);
}

.status-decoration {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}

.decoration-circle {
	position: absolute;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.1);
}

.circle-1 {
	width: 80rpx;
	height: 80rpx;
	top: -20rpx;
	right: 40rpx;
}

.circle-2 {
	width: 120rpx;
	height: 120rpx;
	bottom: -30rpx;
	left: -20rpx;
}

.status-content {
	position: relative;
	z-index: 1;
	color: #ffffff;
}

.status-header {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.status-icon {
	font-size: 40rpx;
	margin-right: 15rpx;
}

.status-title {
	font-size: 36rpx;
	font-weight: bold;
}

.status-badge-container {
	margin-bottom: 15rpx;
}

.status-badge {
	display: inline-block;
	padding: 8rpx 20rpx;
	background: rgba(255, 255, 255, 0.2);
	border-radius: 20rpx;
	font-weight: 600;
}

.status-text {
	font-size: 24rpx;
	color: #ffffff;
}

.report-id {
	font-size: 24rpx;
	opacity: 0.8;
}

.image-card, .reading-card, .info-card, .remark-card {
	background: #ffffff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 25rpx;
}

.card-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.card-subtitle {
	font-size: 24rpx;
	color: #999999;
}

.image-container {
	position: relative;
	border-radius: 15rpx;
	overflow: hidden;
	background: #f8f9ff;
}

.report-image {
	width: 100%;
	height: 400rpx;
}

.image-overlay {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	background: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
	padding: 20rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}

.overlay-text {
	color: #ffffff;
	font-size: 26rpx;
	font-weight: 600;
}

.reading-content {
	display: flex;
	flex-direction: column;
	gap: 25rpx;
}

.reading-item {
	display: flex;
	align-items: center;
	padding: 25rpx;
	background: #f8f9ff;
	border-radius: 16rpx;
	border-left: 6rpx solid #e0e6ff;
}

.reading-item.primary {
	background: linear-gradient(135deg, #e8f4fd, #f0f8ff);
	border-left-color: #667eea;
}

.reading-icon {
	width: 80rpx;
	height: 80rpx;
	background: linear-gradient(135deg, #667eea, #764ba2);
	border-radius: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	margin-right: 20rpx;
}

.reading-info {
	flex: 1;
}

.reading-label {
	font-size: 26rpx;
	color: #666666;
	display: block;
	margin-bottom: 8rpx;
}

.reading-value-container {
	display: flex;
	align-items: baseline;
}

.reading-value {
	font-size: 40rpx;
	font-weight: bold;
	color: #333333;
}

.reading-value.secondary {
	font-size: 32rpx;
	color: #666666;
}

.reading-unit {
	font-size: 24rpx;
	color: #999999;
	margin-left: 8rpx;
}

.usage-highlight {
	background: linear-gradient(135deg, #e8f5e8, #f0fff0);
	border: 2rpx solid #4CAF50;
	border-radius: 20rpx;
	padding: 30rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.usage-content {
	flex: 1;
}

.usage-label {
	font-size: 28rpx;
	color: #4CAF50;
	font-weight: 600;
	display: block;
	margin-bottom: 10rpx;
}

.usage-value-container {
	display: flex;
	align-items: baseline;
}

.usage-value {
	font-size: 48rpx;
	font-weight: bold;
	color: #4CAF50;
}

.usage-unit {
	font-size: 24rpx;
	color: #4CAF50;
	margin-left: 8rpx;
	opacity: 0.8;
}

.usage-trend {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 15rpx;
	border-radius: 15rpx;
}

.trend-high {
	background: #ffebee;
	color: #f44336;
}

.trend-normal {
	background: #e8f5e8;
	color: #4caf50;
}

.trend-low {
	background: #e3f2fd;
	color: #2196f3;
}

.trend-icon {
	font-size: 32rpx;
	margin-bottom: 5rpx;
}

.trend-text {
	font-size: 20rpx;
	font-weight: 600;
}

.info-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.info-item {
	display: flex;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 2rpx solid #f5f5f5;
}

.info-item:last-child {
	border-bottom: none;
}

.info-icon {
	width: 60rpx;
	height: 60rpx;
	background: #f8f9ff;
	border-radius: 30rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	margin-right: 20rpx;
}

.info-content {
	flex: 1;
}

.info-label {
	font-size: 24rpx;
	color: #999999;
	display: block;
	margin-bottom: 5rpx;
}

.info-value {
	font-size: 28rpx;
	color: #333333;
	font-weight: 600;
}

.edit-btn {
	display: flex;
	align-items: center;
	padding: 12rpx 20rpx;
	background: #f8f9ff;
	border-radius: 20rpx;
	transition: all 0.3s ease;
}

.edit-icon {
	font-size: 24rpx;
	margin-right: 8rpx;
}

.edit-text {
	font-size: 24rpx;
	color: #667eea;
	font-weight: 600;
}

.remark-content {
	position: relative;
}

.remark-input {
	width: 100%;
	min-height: 120rpx;
	padding: 20rpx;
	background: #f8f9ff;
	border: 2rpx solid #e0e6ff;
	border-radius: 12rpx;
	font-size: 28rpx;
	color: #333333;
	line-height: 1.5;
	transition: all 0.3s ease;
}

.remark-input.editing {
	border-color: #667eea;
	background: #ffffff;
	box-shadow: 0 4rpx 15rpx rgba(102, 126, 234, 0.1);
}

.char-count {
	position: absolute;
	bottom: 15rpx;
	right: 15rpx;
	font-size: 22rpx;
	color: #999999;
}

.action-section {
	display: flex;
	gap: 20rpx;
	margin-top: 20rpx;
}

.action-btn {
	flex: 1;
	height: 88rpx;
	border-radius: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10rpx;
	border: none;
	font-size: 28rpx;
	font-weight: 600;
	transition: all 0.3s ease;
}

.confirm-btn {
	background: linear-gradient(135deg, #4CAF50, #66BB6A);
	color: #ffffff;
	box-shadow: 0 6rpx 20rpx rgba(76, 175, 80, 0.3);
}

.full-width {
	flex: none;
	width: 100%;
}

.btn-icon {
	font-size: 32rpx;
}

.btn-text {
	font-size: 28rpx;
}

.action-btn:active {
	transform: scale(0.98);
}
</style>