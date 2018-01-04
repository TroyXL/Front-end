onmessage = function(event){
  let total = 1
  for (let i = 0; i < 100000000; i ++) {
    total = total + i
  }
  console.log(self)
  postMessage(JSON.stringify({
    type: 'end',
    total: total
  }));
};