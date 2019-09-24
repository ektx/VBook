const os = require('os')
const macaddress = require('macaddress')

async function getMacAdd () {
	return new Promise((resolve, reject) => {
		macaddress.one((err, mac) => {
			if (err) {
				reject(err)
				return
			}
			resolve(mac)
		})
	})
}

/**
 * 获取当前服务器的 IP
 * @returns 返回 IPv4 与 IPv6
 */
async function getIPs () {
	const mac = await getMacAdd()
	const ip = {}
	const ips = os.networkInterfaces()
	
	for (let key in ips) {
		ips[key].forEach(item => {
			if (item.mac === mac) {
				ip[item.family] = item.address
			}
		})
	}
	
	return ip
}

exports.getIPs = getIPs
