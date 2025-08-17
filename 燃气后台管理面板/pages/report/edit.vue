<template>
	<view class="uni-container">
		<uni-forms ref="form" :model="formData" :rules="rules" validate-trigger="submit" err-show-type="toast">
			<uni-forms-item label="当前读数" name="reading" required>
				<uni-easyinput v-model="formData.reading" placeholder="请输入当前读数" />
			</uni-forms-item>
			
			<uni-forms-item label="上次读数" name="lastReading">
				<uni-easyinput v-model="formData.lastReading" placeholder="请输入上次读数" />
			</uni-forms-item>
			
			<uni-forms-item label="整数部分" name="integerPart">
				<uni-easyinput v-model="formData.integerPart" placeholder="请输入整数部分" />
			</uni-forms-item>
			
			<uni-forms-item label="小数部分" name="decimalPart">
				<uni-easyinput v-model="formData.decimalPart" placeholder="请输入小数部分" />
			</uni-forms-item>
			
			<uni-forms-item label="详细地址" name="address" required>
				<uni-easyinput v-model="formData.address" placeholder="请输入详细地址" />
			</uni-forms-item>
			
			<uni-forms-item label="楼栋号" name="building">
				<uni-data-select 
					v-model="formData.building" 
					:localdata="buildingOptions"
					placeholder="请选择楼栋号"
				/>
			</uni-forms-item>
			
			<uni-forms-item label="抄表日期" name="date" required>
				<picker mode="date" :value="formData.date" @change="onDateChange">
					<view class="picker-item">
						<text class="picker-text">{{ getDisplayDate() || '请选择抄表日期' }}</text>
						<text class="picker-arrow">▼</text>
					</view>
				</picker>
			</uni-forms-item>
			
			<uni-forms-item label="抄表时间" name="time">
				<picker mode="time" :value="formData.time" @change="onTimeChange">
					<view class="picker-item">
						<text class="picker-text">{{ formData.time || '请选择抄表时间' }}</text>
						<text class="picker-arrow">▼</text>
					</view>
				</picker>
			</uni-forms-item>
			
			<uni-forms-item label="报告状态" name="status">
				<uni-data-select 
					v-model="formData.status" 
					:localdata="statusOptions"
					placeholder="请选择报告状态"
				/>
			</uni-forms-item>
			
			<uni-forms-item label="备注信息" name="remark">
				<uni-easyinput 
					v-model="formData.remark" 
					type="textarea" 
					placeholder="请输入备注信息" 
					:maxlength="200"
				/>
			</uni-forms-item>
			
			<uni-forms-item label="燃气表图片" name="imageUrl" required>
				<uni-file-picker 
					v-model="formData.imageUrl" 
					file-mediatype="image"
					mode="grid"
					:limit="1"
					:auto-upload="true"
				/>
			</uni-forms-item>
		</uni-forms>
		
		<view class="uni-button-group">
			<button class="uni-button uni-button--default" @click="cancel">取消</button>
			<button class="uni-button uni-button--primary" @click="submit">更新</button>
		</view>
	</view>
</template>

<script>
const db = uniCloud.database()
const dbCollectionName = 'report'

export default {
	data() {
		return {
			formData: {
				reading: '',
				lastReading: '',
				integerPart: '',
				decimalPart: '',
				address: '',
				building: '',
				date: '',
				time: '',
				status: '已识别',
				remark: '',
				imageUrl: []
			},
			rules: {
				reading: {
					rules: [{
						required: true,
						errorMessage: '读数不能为空'
					}]
				},
				address: {
					rules: [{
						required: true,
						errorMessage: '地址不能为空'
					}]
				},
				date: {
					rules: [{
						required: true,
						errorMessage: '日期不能为空'
					}]
				},
				imageUrl: {
					rules: [{
						required: true,
						errorMessage: '图片不能为空'
					}]
				}
			},
			buildingOptions: [
				{ value: '1号楼', text: '1号楼' },
				{ value: '2号楼', text: '2号楼' },
				{ value: '3号楼', text: '3号楼' },
				{ value: '4号楼', text: '4号楼' },
				{ value: '5号楼', text: '5号楼' },
				{ value: '6号楼', text: '6号楼' },
				{ value: '7号楼', text: '7号楼' },
				{ value: '8号楼', text: '8号楼' },
				{ value: '9号楼', text: '9号楼' },
				{ value: '10号楼', text: '10号楼' },
				{ value: '11号楼', text: '11号楼' },
				{ value: '12号楼', text: '12号楼' }
			],
			statusOptions: [
				{ value: '已识别', text: '已识别' },
				{ value: '已确认', text: '已确认' },
				{ value: '待审核', text: '待审核' },
				{ value: '异常', text: '异常' }
			],
			recordId: '',
			originalDate: '' // 保存原始日期格式用于显示
		}
	},
	async onLoad(options) {
		if (options.id) {
			this.recordId = options.id
			await this.loadData()
		}
	},
	methods: {
		// 日期选择变化
		onDateChange(e) {
			// picker返回的是 "2025-08-16" 格式，需要转换为 "2025/8/16" 格式
			const dateStr = e.detail.value;
			if (dateStr && dateStr.includes('-')) {
				const dateParts = dateStr.split('-');
				if (dateParts.length === 3) {
					const year = dateParts[0];
					const month = parseInt(dateParts[1]).toString(); // 去掉前导0
					const day = parseInt(dateParts[2]).toString(); // 去掉前导0
					this.formData.date = `${year}/${month}/${day}`;
				}
			} else {
				this.formData.date = dateStr;
			}
		},
		// 时间选择变化
		onTimeChange(e) {
			this.formData.time = e.detail.value;
		},
		// 获取显示用的日期格式
		getDisplayDate() {
			// 如果有选择新日期，转换显示格式
			if (this.formData.date && this.formData.date.includes('-')) {
				const dateParts = this.formData.date.split('-');
				if (dateParts.length === 3) {
					const year = dateParts[0];
					const month = parseInt(dateParts[1]).toString();
					const day = parseInt(dateParts[2]).toString();
					return `${year}/${month}/${day}`;
				}
			}
			// 否则返回原始格式或当前值
			return this.originalDate || this.formData.date;
		},
		async loadData() {
			try {
				const res = await db.collection(dbCollectionName).doc(this.recordId).get()
				if (res.result.data && res.result.data.length > 0) {
					const data = res.result.data[0]
					
					// 处理日期时间格式，确保datetime-picker组件能正确显示
					let dateValue = ''
					let timeValue = ''
					
					// 处理日期格式 - 为picker组件转换格式
					if (data.date && typeof data.date === 'string') {
						// 如果是 "2025/8/16" 格式，转换为picker需要的 "2025-08-16" 格式
						if (data.date.includes('/')) {
							const dateParts = data.date.split('/');
							if (dateParts.length === 3) {
								const year = dateParts[0];
								const month = dateParts[1].padStart(2, '0');
								const day = dateParts[2].padStart(2, '0');
								dateValue = `${year}-${month}-${day}`;
							}
						} else if (data.date.includes('-')) {
							// 如果已经是picker格式，直接使用
							dateValue = data.date;
						}
					}
					
					// 如果还没有日期值，使用创建时间或更新时间
					if (!dateValue && (data.createTime || data.updateTime)) {
						const timestamp = data.updateTime || data.createTime
						const date = new Date(timestamp)
						if (!isNaN(date.getTime())) {
							dateValue = date.toISOString().split('T')[0]
						}
					}
					
					// 处理时间格式 - 原生picker需要HH:mm格式
					if (data.time && typeof data.time === 'string' && data.time.includes(':')) {
						// 如果是 "02:48:56" 格式，只取HH:mm部分
						const timeParts = data.time.split(':')
						if (timeParts.length >= 2) {
							const hours = timeParts[0].padStart(2, '0')
							const minutes = timeParts[1].padStart(2, '0')
							timeValue = `${hours}:${minutes}`
						}
					}
					
					// 如果还没有时间值，尝试从updateTime解析
					if (!timeValue && data.updateTime) {
						try {
							const date = new Date(data.updateTime)
							if (!isNaN(date.getTime())) {
								const hours = String(date.getHours()).padStart(2, '0')
								const minutes = String(date.getMinutes()).padStart(2, '0')
								timeValue = `${hours}:${minutes}`
							}
						} catch (e) {
							console.log('解析updateTime失败:', e)
						}
					}
					
					// 最后fallback到createTime
					if (!timeValue && data.createTime) {
						try {
							const date = new Date(data.createTime)
							if (!isNaN(date.getTime())) {
								const hours = String(date.getHours()).padStart(2, '0')
								const minutes = String(date.getMinutes()).padStart(2, '0')
								timeValue = `${hours}:${minutes}`
							}
						} catch (e) {
							console.log('解析createTime失败:', e)
						}
					}
					
					// 调试信息
					console.log('原始时间数据:', {
						time: data.time,
						updateTime: data.updateTime,
						createTime: data.createTime,
						处理后的时间: timeValue
					})
					
					this.formData = {
						reading: data.reading || '',
						lastReading: data.lastReading || '',
						integerPart: data.integerPart || '',
						decimalPart: data.decimalPart || '',
						address: data.address || '',
						building: data.building || '',
						date: dateValue,
						time: timeValue,
						status: data.status || '已识别',
						remark: data.remark || '',
						imageUrl: this.formatImageUrl(data.imageUrl)
					}
					
					// 为了显示用途，保存原始日期格式
					this.originalDate = data.date || ''
				}
			} catch (err) {
				uni.$u.toast('加载数据失败')
				console.error(err)
			}
		},
		formatImageUrl(imageUrl) {
			console.log('formatImageUrl 接收到的参数:', imageUrl)
			
			if (!imageUrl) return []
			
			// 如果是数组，检查格式并返回
			if (Array.isArray(imageUrl)) {
				return imageUrl.map(item => {
					if (typeof item === 'string') {
						return { url: item, name: '燃气表图片' }
					}
					return item
				})
			}
			
			// 如果是字符串，检查是否是有效的图片URL
			if (typeof imageUrl === 'string' && imageUrl.trim()) {
				// 过滤掉本地文件路径，只保留有效的URL
				if (imageUrl.startsWith('http') || imageUrl.startsWith('https') || imageUrl.startsWith('data:')) {
					// uni-file-picker需要的格式
					const result = [{
						url: imageUrl,
						name: '燃气表图片.jpg',
						extname: 'jpg'
					}]
					console.log('formatImageUrl 返回结果:', result)
					return result
				}
			}
			
			console.log('formatImageUrl 返回空数组')
			return []
		},
		async submit() {
			try {
				const isValid = await this.$refs.form.validate()
				if (!isValid) return
				
				// 处理图片URL
				let imageUrl = ''
				if (this.formData.imageUrl && this.formData.imageUrl.length > 0) {
					imageUrl = this.formData.imageUrl[0].url || this.formData.imageUrl[0]
				}
				
				const data = {
					...this.formData,
					imageUrl: imageUrl
					// updateTime会由数据库自动设置，不需要手动传递
				}
				
				const res = await db.collection(dbCollectionName).doc(this.recordId).update(data)
				
				if (res.result.updated > 0) {
					uni.showToast({
						title: '更新成功',
						icon: 'success',
						duration: 2000
					})
					
					// 延迟返回列表页，让用户看到成功提示
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						})
					}, 1500)
				} else {
					uni.showToast({
						title: '更新失败，请重试',
						icon: 'none',
						duration: 2000
					})
				}
				
			} catch (err) {
				uni.showToast({
					title: '更新失败，请重试',
					icon: 'none',
					duration: 2000
				})
				console.error(err)
			}
		},
		cancel() {
			uni.navigateBack()
		}
	}
}
</script>

<style>
.uni-container {
	padding: 15px;
}

.uni-button-group {
	margin-top: 30px;
	display: flex;
	gap: 15px;
}

.uni-button {
	flex: 1;
}
</style>