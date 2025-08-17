// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema.json 更改。
// 如需修改，请通过下方提供的快捷链接，直接修改 schema。

export const enumConverter = {}

function filterToWhere(filter, command) {
	let where = {}
	for (let field in filter) {
		let { type, value } = filter[field]
		switch (type) {
			case "search":
				if (typeof value === 'string' && value.length) {
					where[field] = new RegExp(value)
				}
				break;
			case "select":
				if (value.length) {
					let selectValue = []
					for (let s of value) {
						selectValue.push(command.eq(s))
					}
					where[field] = command.or(selectValue)
				}
				break;
			case "range":
				if (value.length) {
					let gt = value[0]
					let lt = value[1]
					where[field] = command.and([command.gte(gt), command.lte(lt)])
				}
				break;
			case "date":
				if (value.length) {
					let [s, e] = value
					let startDate = new Date(s)
					let endDate = new Date(e)
					where[field] = command.and([command.gte(startDate), command.lte(endDate)])
				}
				break;
		}
	}
	return where
}

export { filterToWhere }

function toString(val) {
	return val == null ? '' : (typeof val === 'object' ? JSON.stringify(val) : String(val))
}

export function createValidator(params) {
	return {}
}

// 集合名称
export const collection = 'report'

// 页面路径
export const pagePath = '/pages/report/list'