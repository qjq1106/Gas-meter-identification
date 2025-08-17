<template>
	<view class="uni-container">
		<uni-table ref="table" :loading="loading" border stripe emptyText="暂无更多数据" type="selection"
			@selection-change="selectionChange">
			<uni-tr>
				<uni-th width="150" align="center">识别读数</uni-th>
				<uni-th width="150" align="center">地址</uni-th>
				<uni-th width="120" align="center">楼栋</uni-th>
				<uni-th width="120" align="center">抄表日期</uni-th>
				<uni-th width="100" align="center">状态</uni-th>
				<uni-th width="150" align="center">更新时间</uni-th>
				<uni-th width="200" align="center">操作</uni-th>
			</uni-tr>
			<uni-tr v-for="(item, index) in tableData" :key="index">
				<uni-td>{{ item.reading }}</uni-td>
				<uni-td>{{ item.address }}</uni-td>
				<uni-td>{{ item.building || '-' }}</uni-td>
				<uni-td>{{ item.date }}</uni-td>
				<uni-td>
					<uni-tag :text="item.status" :type="getStatusType(item.status)" />
				</uni-td>
				<uni-td>{{ formatTime(item.updateTime) }}</uni-td>
				<uni-td>
					<view class="uni-group">
						<button class="uni-button uni-button--default" size="mini" @click="navigateTo('./edit?id=' + item._id)">修改</button>
						<button class="uni-button uni-button--primary" size="mini" @click="navigateTo('./detail?id=' + item._id)">详情</button>
						<button class="uni-button uni-button--danger" size="mini" @click="confirmDelete(item._id)">删除</button>
					</view>
				</uni-td>
			</uni-tr>
		</uni-table>
		<view class="uni-pagination-box">
			<uni-pagination show-icon :page-size="options.pageSize" :current="options.pageCurrent"
				:total="options.total" @change="change" />
		</view>
	</view>
</template>

<script>
import { 
	collection, 
	enumConverter 
} from '@/js_sdk/validator/report'

const db = uniCloud.database()
const dbCmd = db.command
const dbCollectionName = 'report'

export default {
	data() {
		return {
			loading: false,
			where: '',
			tableData: [],
			selectedIndexs: [],
			options: {
				pageCurrent: 1,
				pageSize: 20,
				total: 0
			},
			imageStyles: {
				width: 64,
				height: 64
			}
		}
	},
	onLoad() {
		this.getCloudDataList()
	},
	onReachBottom() {
		this.loadMore()
	},
	methods: {
		async getCloudDataList() {
			if (this.loading) {
				return
			}
			this.loading = true
			
			try {
				const res = await db.collection(dbCollectionName)
					.orderBy('updateTime', 'desc')
					.skip((this.options.pageCurrent - 1) * this.options.pageSize)
					.limit(this.options.pageSize)
					.get()
				
				this.tableData = res.result.data || []
				
				// 获取总数
				const countRes = await db.collection(dbCollectionName).count()
				this.options.total = countRes.result.total || 0
				
			} catch (err) {
				uni.$u.toast('获取数据失败')
				console.error(err)
			} finally {
				this.loading = false
			}
		},
		loadMore() {
			if (this.options.pageCurrent * this.options.pageSize < this.options.total) {
				this.options.pageCurrent++
				this.getCloudDataList()
			}
		},
		change(e) {
			this.options.pageCurrent = e.current
			this.getCloudDataList()
		},
		selectionChange(e) {
			this.selectedIndexs = e.detail.index
		},
		confirmDelete(id) {
			uni.showModal({
				title: '确认删除',
				content: '确定要删除这条燃气表记录吗？删除后无法恢复。',
				confirmText: '确定删除',
				cancelText: '取消',
				confirmColor: '#e74c3c',
				success: async (res) => {
					if (res.confirm) {
						await this.deleteRecord(id)
					}
				}
			})
		},
		async deleteRecord(id) {
			try {
				// 显示删除中的提示
				uni.showLoading({
					title: '删除中...',
					mask: true
				})
				
				const res = await db.collection(dbCollectionName).doc(id).remove()
				
				uni.hideLoading()
				
				if (res.result.deleted > 0) {
					uni.showToast({
						title: '删除成功',
						icon: 'success',
						duration: 2000
					})
					// 刷新列表
					this.getCloudDataList()
				} else {
					uni.showToast({
						title: '删除失败，请重试',
						icon: 'none',
						duration: 2000
					})
				}
			} catch (err) {
				uni.hideLoading()
				uni.showToast({
					title: '删除失败，请重试',
					icon: 'none',
					duration: 2000
				})
				console.error(err)
			}
		},
		navigateTo(url) {
			uni.navigateTo({
				url
			})
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
		}
	}
}
</script>

<style>
.uni-container {
	padding: 15px;
}

.uni-group {
	display: flex;
	gap: 5px;
}

.uni-pagination-box {
	margin-top: 15px;
	display: flex;
	justify-content: center;
}
</style>