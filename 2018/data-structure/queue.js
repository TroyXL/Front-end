// 环形队列
class CircleQueue {
  constructor (capacity = 0) {
    this.capacity = capacity // 容量
    this.clean()
  }

  // 清空队列
  clean () {
    this.head = 0 // 队头
    this.tail = 0 // 队尾
    this.length = 0 // 队列长度
    this.queue = []
  }

  // 将元素添加到队尾
  push (element) {
    // 判断队列是否已满
    // 如果已满则返回 false
    if (this.isFull()) return false
    // 将元素添加进队尾
    this.queue[this.tail] = element
    this.length++
    // 修改队尾
    // 先将原队尾+1并对容量取余，防止队尾超出数组长度，实现环形队列的队尾
    this.tail = ++this.tail % this.capacity
    return this.length
  }

  // 将元素移出队列
  shift () {
    // 判断队列是否为空
    // 如果为空则返回
    if (this.isEmpty()) return
    // 获取对头并将队头移除(置空)
    let temp = this.queue[this.head]
    this.queue[this.head] = null
    this.length--
    // 修改队头
    // 先将原队头+1并对容量取余，防止队头超出数组长度，实现环形队列的队头
    this.head = ++this.head % this.capacity
    return temp
  }

  // 判断是否已满
  isFull () {
    if (this.length === this.capacity) return true
    return false
  }

  // 判断是否为空
  isEmpty () {
    if (this.length === 0) return true
    return false
  }

  // 遍历所有元素
  travel (cb) {
    for (let i = this.head; i < this.length + this.head; i++) {
      cb && cb(this.queue[i % this.capacity])
    }
  }
}