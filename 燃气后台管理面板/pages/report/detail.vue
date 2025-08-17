<template>
	<view class="uni-container">
		<view v-if="loading" class="loading-container">
			<uni-load-more status="loading" />
		</view>
		
		<view v-else-if="reportData" class="detail-container">
			<!-- 基础信息卡片 -->
			<uni-card title="基础信息" :is-shadow="true">
				<view class="info-grid">
					<view class="info-item">
						<text class="label">当前读数：</text>
						<text class="value">{{ reportData.reading }}</text>
					</view>
					<view class="info-item">
						<text class="label">上次读数：</text>
						<text class="value">{{ reportData.lastReading || '-' }}</text>
					</view>
					<view class="info-item">
						<text class="label">整数部分：</text>
						<text class="value">{{ reportData.integerPart || '-' }}</text>
					</view>
					<view class="info-item">
						<text class="label">小数部分：</text>
						<text class="value">{{ reportData.decimalPart || '-' }}</text>
					</view>
				</view>
			</uni-card>
			
			<!-- 位置信息卡片 -->
			<uni-card title="位置信息" :is-shadow="true">
				<view class="info-grid">
					<view class="info-item">
						<text class="label">详细地址：</text>
						<text class="value">{{ reportData.address }}</text>
					</view>
					<view class="info-item">
						<text class="label">楼栋号：</text>
						<text class="value">{{ reportData.building || '-' }}</text>
					</view>
				</view>
			</uni-card>
			
			<!-- 时间信息卡片 -->
			<uni-card title="时间信息" :is-shadow="true">
				<view class="info-grid">
					<view class="info-item">
						<text class="label">抄表日期：</text>
						<text class="value">{{ reportData.date }}</text>
					</view>
					<view class="info-item">
						<text class="label">抄表时间：</text>
						<text class="value">{{ reportData.time || '-' }}</text>
					</view>
					<view class="info-item">
						<text class="label">创建时间：</text>
						<text class="value">{{ formatTime(reportData.createTime) }}</text>
					</view>
					<view class="info-item">
						<text class="label">更新时间：</text>
						<text class="value">{{ formatTime(reportData.updateTime) }}</text>
					</view>
				</view>
			</uni-card>
			
			<!-- 状态信息卡片 -->
			<uni-card title="状态信息" :is-shadow="true">
				<view class="info-grid">
					<view class="info-item">
						<text class="label">报告状态：</text>
						<uni-tag :text="reportData.status" :type="getStatusType(reportData.status)" />
					</view>
					<view class="info-item full-width" v-if="reportData.remark">
						<text class="label">备注信息：</text>
						<text class="value">{{ reportData.remark }}</text>
					</view>
				</view>
			</uni-card>
			
			<!-- 图片信息卡片 -->
			<uni-card title="燃气表图片" :is-shadow="true">
				<view class="image-container" v-if="getImageUrl()">
					<image :src="getImageUrl()" mode="aspectFit" @click="previewImage" />
				</view>
				<view v-else class="no-image">
					<text>暂无图片</text>
				</view>
			</uni-card>
			
			<!-- OCR识别结果卡片 -->
			<uni-card title="OCR识别结果" :is-shadow="true" v-if="reportData.ocrResult">
				<view class="ocr-result">
					<view class="info-item">
						<text class="label">识别状态：</text>
						<uni-tag :text="reportData.ocrResult.success ? '成功' : '失败'" 
							:type="reportData.ocrResult.success ? 'success' : 'error'" />
					</view>
					<view class="info-item">
						<text class="label">请求ID：</text>
						<text class="value">{{ reportData.ocrResult.request_id || '-' }}</text>
					</view>
					<view class="info-item">
						<text class="label">整数识别：</text>
						<text class="value">{{ reportData.ocrResult.integer || '-' }}</text>
					</view>
					<view class="info-item">
						<text class="label">小数识别：</text>
						<text class="value">{{ reportData.ocrResult.decimal || '-' }}</text>
					</view>
				</view>
			</uni-card>
			
			<!-- 操作按钮 -->
			<view class="button-group">
				<button class="uni-button uni-button--default" @click="goBack">返回</button>
				<button class="uni-button uni-button--primary" @click="editRecord">编辑</button>
			</view>
		</view>
		
		<view v-else class="empty-container">
			<text>暂无数据</text>
		</view>
	</view>
</template>

<script>
const db = uniCloud.database()
const dbCollectionName = 'report'

export default {
	data() {
		return {
			reportData: null,
			loading: true,
			recordId: ''
		}
	},
	async onLoad(options) {
		if (options.id) {
			this.recordId = options.id
			await this.loadData()
		}
	},
	methods: {
		async loadData() {
			try {
				this.loading = true
				const res = await db.collection(dbCollectionName).doc(this.recordId).get()
				if (res.result.data && res.result.data.length > 0) {
					this.reportData = res.result.data[0]
				}
			} catch (err) {
				uni.$u.toast('加载数据失败')
				console.error(err)
			} finally {
				this.loading = false
			}
		},
		getStatusType(status) {
			const statusMap = {
				'已识别': 'primary',
				'已确认': 'success', 
				'待审核': 'warning',
				'异常': 'error'
			}
			return statusMap[status] || 'default'
		},
		formatTime(timestamp) {
			if (!timestamp) return '-'
			const date = new Date(timestamp)
			return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
		},
		getImageUrl() {
			if (!this.reportData || !this.reportData.imageUrl) return null
			
			let imageUrl = this.reportData.imageUrl
			
			// 如果是数组，取第一个元素
			if (Array.isArray(imageUrl)) {
				if (imageUrl.length > 0) {
					imageUrl = imageUrl[0].url || imageUrl[0]
				} else {
					return null
				}
			}
			
			// 检查是否是有效的URL
			if (typeof imageUrl === 'string' && imageUrl.trim()) {
				// 过滤掉本地文件路径，只返回有效的URL
				if (imageUrl.startsWith('http') || imageUrl.startsWith('https') || imageUrl.startsWith('data:')) {
					return imageUrl
				}
			}
			
			return null
		},
		previewImage() {
			const imageUrl = this.getImageUrl()
			if (imageUrl) {
				uni.previewImage({
					urls: [imageUrl],
					current: 0
				})
			}
		},
		editRecord() {
			uni.navigateTo({
				url: `./edit?id=${this.recordId}`
			})
		},
		goBack() {
			uni.navigateBack()
		}
	}
}
</script>

<style>
.uni-container {
	padding: 15px;
	background-color: #f5f5f5;
}

.loading-container, .empty-container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 200px;
}

.detail-container {
	display: flex;
	flex-direction: column;
	gap: 15px;
}

.info-grid {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.info-item {
	display: flex;
	align-items: flex-start;
	gap: 10px;
}

.info-item.full-width {
	flex-direction: column;
	gap: 5px;
}

.label {
	font-weight: bold;
	color: #666;
	min-width: 80px;
}

.value {
	color: #333;
	flex: 1;
	word-break: break-all;
}

.image-container {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 200px;
}

.image-container image {
	max-width: 100%;
	max-height: 300px;
	border-radius: 8px;
	cursor: pointer;
}

.no-image {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100px;
	color: #999;
	background-color: #f9f9f9;
	border-radius: 8px;
}

.ocr-result {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.button-group {
	margin-top: 20px;
	display: flex;
	gap: 15px;
}

.uni-button {
	flex: 1;
}
</style>