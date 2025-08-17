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
				<uni-datetime-picker 
					v-model="formData.date" 
					type="date"
					placeholder="请选择抄表日期"
				/>
			</uni-forms-item>
			
			<uni-forms-item label="抄表时间" name="time">
				<uni-datetime-picker 
					v-model="formData.time" 
					type="time"
					placeholder="请选择抄表时间"
				/>
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
			<button class="uni-button uni-button--primary" @click="submit">提交</button>
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
			]
		}
	},
	methods: {
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
				}
				
				const res = await db.collection(dbCollectionName).add(data)
				
				if (res.result.id) {
					uni.$u.toast('添加成功')
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)
				}
				
			} catch (err) {
				uni.$u.toast('添加失败')
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