const log = console.log.bind(console)
const benAutoSendBanana = function () {
  const log = console.log.bind(console)

  let autoSendBanana = localStorage.getItem('autoSendBanana')
  if (autoSendBanana == null) {
    localStorage.setItem('autoSendBanana', '0')
  } else {
    if (autoSendBanana == '1') {
      let bananaers = document.getElementsByClassName('div-banana')
      // SendBanana
      // bananaers[0].childNodes[4].click()
    }
  }

  let banana = document.querySelector('.banana')
  let newCheckBox = document.createElement('input')
  newCheckBox.type = 'checkbox'
  if (autoSendBanana == null || autoSendBanana == '0') {
    newCheckBox.checked = false
  } else {
    newCheckBox.checked = true
  }
  newCheckBox.onclick = function () {
    log('autoSendBanana', newCheckBox.checked)
    if (newCheckBox.checked == true) {
      localStorage.setItem('autoSendBanana', '1')
    } else {
      localStorage.setItem('autoSendBanana', '0')
    }
  }

  banana.insertBefore(newCheckBox, banana.childNodes[0])

  log('banana', banana)
  log('localStorage.getItem("autoSendBanana")', typeof localStorage.getItem('autoSendBanana'))
}

async function bananaNumber() {
  let n = localStorage.getItem('bananaNumber')
  if (n == null) {
    n = updateBananaNumber()
  }
  // banana number
  return n
}

async function updateBananaNumber() {
  let data = await Ajax('GET', 'https://www.acfun.cn/member/', {})
  let parser = new DOMParser()
  let doc = parser.parseFromString(data, 'text/html')
  let pts = doc.getElementsByClassName('pts')
  let bananaNumber = pts[3].innerText
  localStorage.setItem('bananaNumber', pts[3].innerText)
  return bananaNumber
}

const Ajax = async function (method, path, data, callback) {
  // 创建 AJAX 对象
  let r = new XMLHttpRequest()
  // 设置请求方法和请求地址
  r.open(method, path, true)
  // 设置发送的数据的格式
  r.setRequestHeader('Content-Type', 'application/json')
  // 注册响应函数
  // 发送请求
  data = JSON.stringify(data)
  r.send(data)

  return new Promise((resolve, reject) => {
    r.onreadystatechange = function () {
      if (r.readyState === 4) {
        // var response = JSON.parse(r.response)
        var response = r.response
        // console.log('response', response)
        // callback(r.response)
        resolve(r.response)
      } else {
        console.log('change')
      }
    }
  })
}
