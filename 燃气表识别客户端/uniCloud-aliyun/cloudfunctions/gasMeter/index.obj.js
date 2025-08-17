const https = require('https');

// 将私有方法定义在模块作用域中
function callAliCloudOCR(imageBase64) {
	return new Promise((resolve, reject) => {
		const appCode = '21197937a3e24f93bd1ca561bb9b3057'; // 你的AppCode
		const host = 'gas.market.alicloudapi.com';
		const path = '/api/predict/gas_meter_end2end';
		
		const postData = JSON.stringify({
			image: imageBase64
		});

		const options = {
			hostname: host,
			path: path,
			method: 'POST',
			headers: {
				'Authorization': `APPCODE ${appCode}`,
				'Content-Type': 'application/json; charset=UTF-8',
				'Content-Length': Buffer.byteLength(postData)
			}
		};

		const req = https.request(options, (res) => {
			let data = '';
			
			res.on('data', (chunk) => {
				data += chunk;
			});
			
			res.on('end', () => {
				try {
					const result = JSON.parse(data);
					console.log('OCR API 响应:', result); // 调试用日志
					resolve(result);
				} catch (error) {
					reject(new Error('解析OCR响应失败: ' + error.message));
				}
			});
		});

		req.on('error', (error) => {
			reject(new Error('请求OCR API失败: ' + error.message));
		});

		req.write(postData);
		req.end();
	});
}

function combineReading(integer, decimal) {
	if (!integer && !decimal) {
		return '0.000';
	}
	
	const integerPart = integer || '00000';
	const decimalPart = decimal || '000';
	
	// 移除前导零但保留至少一位
	const cleanInteger = integerPart.replace(/^0+/, '') || '0';
	
	return `${cleanInteger}.${decimalPart}`;
}

module.exports = {
	_before: function () { 
		// 通用预处理器
	},

	/**
	 * 识别燃气表读数
	 * @param {string} imageBase64 图片的base64编码
	 * @param {string} address 地址信息
	 * @param {string} building 楼栋号
	 * @param {string} remarks 备注信息
	 * @param {string} imageUrl 图片URL（可选，如果有的话直接保存）
	 * @returns {object} 返回识别结果
	 */
	async recognizeGasMeter(imageBase64, address = '', building = '', remarks = '', imageUrl = '') {
		// 参数校验
		if (!imageBase64) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '图片不能为空'
			}
		}

		try {
			// 调用阿里云OCR API
			const ocrResult = await callAliCloudOCR(imageBase64);
			
			// 检查OCR结果，根据实际API响应格式进行解析
			console.log('OCR原始响应:', JSON.stringify(ocrResult, null, 2));
			
			// 检查是否识别成功
			if (!ocrResult || !ocrResult.success) {
				return {
					errCode: 'OCR_FAILED',
					errMsg: '燃气表识别失败',
					data: ocrResult
				}
			}

			// 处理识别结果 - 根据实际API响应格式：{decimal: "xxx", integer: "xxxxx", success: true}
			let integerPart = '';
			let decimalPart = '';
			
			// 直接从响应中获取decimal和integer字段
			if (ocrResult.success) {
				integerPart = ocrResult.integer || '';
				decimalPart = ocrResult.decimal || '';
			} else {
				// 如果success为false，返回失败信息
				return {
					errCode: 'OCR_RECOGNITION_FAILED',
					errMsg: '识别失败，请确保图片清晰并包含燃气表',
					data: ocrResult
				}
			}
			
			const reading = combineReading(integerPart, decimalPart);
			
			// 保存到数据库
			const db = uniCloud.database();
			const reportCollection = db.collection('report');
			
			const reportData = {
				reading: reading,
				integerPart: integerPart,
				decimalPart: decimalPart,
				address: address,
				building: building,
				date: new Date().toLocaleDateString('zh-CN'),
				time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
				status: '已识别',
				imageUrl: imageUrl || '', // 使用传入的图片URL，如果没有则为空
				ocrResult: ocrResult,
				remark: remarks
			};

			const addResult = await reportCollection.add(reportData);
			
			if (addResult.id) {
				return {
					errCode: 0,
					errMsg: 'success',
					data: {
						reportId: addResult.id,
						reading: reading,
						integerPart: integerPart,
						decimalPart: decimalPart,
						address: address,
						building: building,
						date: reportData.date,
						time: reportData.time,
						ocrResult: ocrResult
					}
				}
			} else {
				return {
					errCode: 'SAVE_FAILED',
					errMsg: '保存报告失败'
				}
			}

		} catch (error) {
			console.error('识别燃气表出错:', error);
			return {
				errCode: 'SYSTEM_ERROR',
				errMsg: '系统错误：' + error.message
			}
		}
	},


	/**
	 * 获取报告列表
	 * @param {string} building 楼栋筛选条件
	 * @param {number} limit 限制数量
	 * @param {number} skip 跳过数量
	 * @returns {object} 报告列表
	 */
	async getReports(building = '', limit = 20, skip = 0) {
		try {
			const db = uniCloud.database();
			const reportCollection = db.collection('report');
			
			let query = reportCollection.orderBy('createTime', 'desc');
			
			if (building && building !== '全部') {
				query = query.where({
					building: building
				});
			}
			
			const result = await query.limit(limit).skip(skip).get();
			
			return {
				errCode: 0,
				errMsg: 'success',
				data: result.data
			}
			
		} catch (error) {
			console.error('获取报告列表失败:', error);
			return {
				errCode: 'QUERY_FAILED', 
				errMsg: '获取报告列表失败：' + error.message
			}
		}
	},

	/**
	 * 更新报告信息
	 * @param {string} reportId 报告ID
	 * @param {object} updateData 更新的数据
	 * @returns {object} 更新结果
	 */
	async updateReport(reportId, updateData) {
		if (!reportId) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '报告ID不能为空'
			}
		}

		try {
			const db = uniCloud.database();
			const reportCollection = db.collection('report');
			
			// 添加更新时间
			updateData.updateTime = new Date();
			
			const result = await reportCollection.doc(reportId).update(updateData);
			
			return {
				errCode: 0,
				errMsg: 'success',
				data: result
			}
			
		} catch (error) {
			console.error('更新报告失败:', error);
			return {
				errCode: 'UPDATE_FAILED',
				errMsg: '更新报告失败：' + error.message
			}
		}
	}
}