<template>
	<view class="page-container">
		<!-- 顶部统计区域 -->
		<view class="stats-overview">
			<view class="stats-bg">
				<view class="bg-decoration">
					<view class="decoration-dot dot-1"></view>
					<view class="decoration-dot dot-2"></view>
					<view class="decoration-dot dot-3"></view>
				</view>
				<view class="stats-content">
					<view class="stats-main">
						<text class="stats-number">{{ filteredReports.length }}</text>
						<text class="stats-label">份报告</text>
					</view>
					<view class="stats-sub">
						<view class="sub-item">
							<text class="sub-number">{{ confirmedCount }}</text>
							<text class="sub-label">已确认</text>
						</view>
						<view class="sub-item">
							<text class="sub-number">{{ pendingCount }}</text>
							<text class="sub-label">待审核</text>
						</view>
						<view class="sub-item">
							<text class="sub-number">{{ abnormalCount }}</text>
							<text class="sub-label">异常</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 楼栋筛选 -->
		<view class="filter-section">
			<view class="filter-header">
				<text class="filter-icon">🏢</text>
				<text class="filter-title">选择楼栋</text>
			</view>
			<scroll-view scroll-x="true" class="filter-scroll">
				<view class="filter-list">
					<view v-for="(category, index) in categories" :key="index"
						  class="filter-item"
						  :class="{ 'active': selectedCategory === category }"
						  @tap="selectCategory(category)">
						<text class="filter-text">{{ category }}</text>
						<view v-if="selectedCategory === category" class="active-indicator"></view>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 报告列表 -->
		<view class="reports-section">
			<view class="section-header">
				<text class="section-title">📋 抄表记录</text>
				<text class="section-subtitle">最近的抄表报告</text>
			</view>
			
			<view v-if="filteredReports.length === 0" class="empty-state">
				<text class="empty-icon">📝</text>
				<text class="empty-title">暂无报告</text>
				<text class="empty-desc">还没有{{ selectedCategory }}的抄表记录</text>
			</view>
			
			<view v-else class="reports-list">
				<view v-for="(report, index) in filteredReports" :key="report.id" 
					  class="report-card" :style="{ 'animation-delay': index * 0.1 + 's' }"
					  @tap="viewReportDetail(report)">
					
					<!-- 卡片头部 -->
					<view class="card-header">
						<view class="header-left">
							<text class="building-tag">{{ report.building }}</text>
							<text class="address-text">{{ report.address }}</text>
						</view>
						<view class="header-right">
							<view class="status-badge" :class="getStatusClass(report.status)">
								<text class="status-text">{{ report.status }}</text>
							</view>
						</view>
					</view>
					
					<!-- 读数信息 -->
					<view class="card-content">
						<view class="reading-section">
							<view class="current-reading">
								<text class="reading-label">当前读数</text>
								<view class="reading-value">
									<text class="reading-number">{{ report.reading }}</text>
									<text class="reading-unit">m³</text>
								</view>
							</view>
							<view class="usage-info">
								<text class="usage-label">本期用量</text>
								<text class="usage-value">{{ getUsage(report) }} m³</text>
							</view>
						</view>
						
						<view class="date-section">
							<text class="date-icon">📅</text>
							<text class="date-text">{{ report.date }}</text>
						</view>
						
						<view v-if="report.remark" class="remark-section">
							<text class="remark-text">💬 {{ report.remark }}</text>
						</view>
					</view>
					
					<!-- 卡片底部 -->
					<view class="card-footer">
						<view class="footer-left">
							<text class="view-detail">查看详情</text>
						</view>
						<view class="footer-right">
							<text class="arrow-icon">→</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			selectedCategory: '全部',
			categories: ['全部', '1号楼', '2号楼', '3号楼', '4号楼', '5号楼', '6号楼', '7号楼', '8号楼', '9号楼', '10号楼', '11号楼', '12号楼'],
			reports: [],
			loading: false
		}
	},
	
	onLoad() {
		this.loadReports();
	},
	
	onShow() {
		// 页面显示时刷新数据
		this.loadReports();
	},
	computed: {
		filteredReports() {
			if (this.selectedCategory === '全部') {
				return this.reports;
			}
			return this.reports.filter(report => report.building === this.selectedCategory);
		},
		confirmedCount() {
			return this.filteredReports.filter(r => r.status === '已确认').length;
		},
		pendingCount() {
			return this.filteredReports.filter(r => r.status === '待审核').length;
		},
		abnormalCount() {
			return this.filteredReports.filter(r => r.status === '异常').length;
		}
	},
	methods: {
		// 加载报告数据
		async loadReports() {
			if (this.loading) return;
			
			this.loading = true;
			
			try {
				const gasMeter = uniCloud.importObject('gasMeter');
				const result = await gasMeter.getReports(this.selectedCategory);
				
				if (result.errCode === 0) {
					this.reports = result.data.map(item => ({
						id: item._id,
						building: item.building || '未分配',
						address: item.address,
						reading: item.reading,
						lastReading: item.lastReading || '',
						date: item.date,
						status: item.status,
						remark: item.remark || '',
						integerPart: item.integerPart || '',
						decimalPart: item.decimalPart || '',
						imageUrl: item.imageUrl || '',
						time: item.time || '',
						updateTime: item.updateTime
					})).sort((a, b) => {
						// 按更新时间倒序排列，最新的在前面
						const timeA = new Date(a.updateTime || `${a.date} ${a.time}`).getTime();
						const timeB = new Date(b.updateTime || `${b.date} ${b.time}`).getTime();
						return timeB - timeA;
					});
				} else {
					console.error('加载报告失败:', result.errMsg);
					uni.showToast({
						title: '加载数据失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('加载报告出错:', error);
				uni.showToast({
					title: '网络错误',
					icon: 'none'
				});
			} finally {
				this.loading = false;
			}
		},
		
		selectCategory(category) {
			this.selectedCategory = category;
			// 切换分类时重新加载数据
			this.loadReports();
		},
		
		getStatusClass(status) {
			switch(status) {
				case '已确认': return 'status-confirmed';
				case '待审核': return 'status-pending';
				case '异常': return 'status-abnormal';
				default: return 'status-default';
			}
		},
		
		getUsage(report) {
			if (report.reading && report.lastReading) {
				const usage = parseFloat(report.reading) - parseFloat(report.lastReading);
				return usage.toFixed(2);
			}
			return '0.00';
		},
		
		viewReportDetail(report) {
			uni.navigateTo({
				url: `/pages/reportDetail/reportDetail?reportId=${report.id}&reading=${report.reading}&lastReading=${report.lastReading}&address=${encodeURIComponent(report.address)}&date=${report.date}&time=${encodeURIComponent(report.time)}&remarks=${encodeURIComponent(report.remark || '')}&status=${report.status}&imageUrl=${encodeURIComponent(report.imageUrl || '')}&integerPart=${report.integerPart}&decimalPart=${report.decimalPart}`
			});
		}
	}
}
</script>

<style scoped>
.page-container {
	min-height: 100vh;
	background: #f5f7fa;
	padding-bottom: 120rpx;
}

.stats-overview {
	margin-bottom: 30rpx;
}

.stats-bg {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	position: relative;
	overflow: hidden;
	border-radius: 0 0 40rpx 40rpx;
}

.bg-decoration {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}

.decoration-dot {
	position: absolute;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.1);
}

.dot-1 {
	width: 100rpx;
	height: 100rpx;
	top: 20rpx;
	right: 80rpx;
}

.dot-2 {
	width: 60rpx;
	height: 60rpx;
	top: 100rpx;
	left: 60rpx;
}

.dot-3 {
	width: 140rpx;
	height: 140rpx;
	bottom: -40rpx;
	right: -20rpx;
}

.stats-content {
	position: relative;
	z-index: 1;
	padding: 60rpx 40rpx 40rpx 40rpx;
	color: #ffffff;
}

.stats-main {
	text-align: center;
	margin-bottom: 40rpx;
}

.stats-number {
	font-size: 72rpx;
	font-weight: bold;
	display: block;
	text-shadow: 0 2px 8rpx rgba(0, 0, 0, 0.2);
}

.stats-label {
	font-size: 28rpx;
	opacity: 0.9;
	margin-top: 10rpx;
}

.stats-sub {
	display: flex;
	justify-content: space-around;
}

.sub-item {
	text-align: center;
}

.sub-number {
	font-size: 36rpx;
	font-weight: bold;
	display: block;
}

.sub-label {
	font-size: 24rpx;
	opacity: 0.8;
	margin-top: 8rpx;
}

.filter-section {
	margin: 30rpx;
	background: #ffffff;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.filter-header {
	display: flex;
	align-items: center;
	margin-bottom: 25rpx;
}

.filter-icon {
	font-size: 36rpx;
	margin-right: 15rpx;
}

.filter-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.filter-scroll {
	white-space: nowrap;
}

.filter-list {
	display: inline-flex;
	gap: 20rpx;
}

.filter-item {
	position: relative;
	padding: 20rpx 30rpx;
	background: #f8f9ff;
	border-radius: 25rpx;
	transition: all 0.3s ease;
	white-space: nowrap;
}

.filter-item.active {
	background: linear-gradient(135deg, #667eea, #764ba2);
}

.filter-text {
	font-size: 28rpx;
	color: #666666;
}

.filter-item.active .filter-text {
	color: #ffffff;
	font-weight: 600;
}

.active-indicator {
	position: absolute;
	bottom: -10rpx;
	left: 50%;
	transform: translateX(-50%);
	width: 0;
	height: 0;
	border-left: 12rpx solid transparent;
	border-right: 12rpx solid transparent;
	border-top: 12rpx solid #667eea;
}

.reports-section {
	margin: 0 30rpx;
}

.section-header {
	margin-bottom: 30rpx;
}

.section-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333333;
	display: block;
	margin-bottom: 8rpx;
}

.section-subtitle {
	font-size: 26rpx;
	color: #666666;
}

.empty-state {
	text-align: center;
	padding: 100rpx 0;
	background: #ffffff;
	border-radius: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.empty-icon {
	font-size: 100rpx;
	display: block;
	margin-bottom: 30rpx;
}

.empty-title {
	font-size: 32rpx;
	color: #333333;
	font-weight: 600;
	display: block;
	margin-bottom: 15rpx;
}

.empty-desc {
	font-size: 26rpx;
	color: #999999;
}

.reports-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.report-card {
	background: #ffffff;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
	transition: all 0.3s ease;
	animation: slideInUp 0.6s ease forwards;
	opacity: 0;
	transform: translateY(30rpx);
}

@keyframes slideInUp {
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 25rpx;
}

.header-left {
	flex: 1;
}

.building-tag {
	display: inline-block;
	background: #e8f2ff;
	color: #667eea;
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	font-size: 22rpx;
	font-weight: 600;
	margin-bottom: 15rpx;
}

.address-text {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.header-right {
	flex-shrink: 0;
	margin-left: 20rpx;
}

.status-badge {
	padding: 12rpx 20rpx;
	border-radius: 20rpx;
	font-weight: 600;
}

.status-confirmed {
	background: #e8f5e8;
	color: #4caf50;
}

.status-pending {
	background: #fff8e1;
	color: #ff9800;
}

.status-abnormal {
	background: #ffebee;
	color: #f44336;
}

.status-text {
	font-size: 24rpx;
}

.card-content {
	margin-bottom: 25rpx;
}

.reading-section {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: #f8f9ff;
	padding: 25rpx;
	border-radius: 16rpx;
	margin-bottom: 20rpx;
}

.current-reading {
	flex: 1;
}

.reading-label {
	font-size: 24rpx;
	color: #666666;
	display: block;
	margin-bottom: 8rpx;
}

.reading-value {
	display: flex;
	align-items: baseline;
}

.reading-number {
	font-size: 36rpx;
	font-weight: bold;
	color: #333333;
}

.reading-unit {
	font-size: 22rpx;
	color: #999999;
	margin-left: 5rpx;
}

.usage-info {
	text-align: right;
}

.usage-label {
	font-size: 24rpx;
	color: #666666;
	display: block;
	margin-bottom: 8rpx;
}

.usage-value {
	font-size: 28rpx;
	font-weight: bold;
	color: #4caf50;
}

.date-section {
	display: flex;
	align-items: center;
	margin-bottom: 15rpx;
}

.date-icon {
	font-size: 28rpx;
	margin-right: 10rpx;
}

.date-text {
	font-size: 26rpx;
	color: #666666;
}

.remark-section {
	background: #fffbf0;
	padding: 20rpx;
	border-radius: 12rpx;
	border-left: 6rpx solid #ffa726;
}

.remark-text {
	font-size: 26rpx;
	color: #666666;
	line-height: 1.5;
}

.card-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 20rpx;
	border-top: 2rpx solid #f5f5f5;
}

.view-detail {
	font-size: 26rpx;
	color: #667eea;
	font-weight: 600;
}

.arrow-icon {
	font-size: 28rpx;
	color: #667eea;
	font-weight: bold;
}

.report-card:active {
	transform: scale(0.98);
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}
</style>