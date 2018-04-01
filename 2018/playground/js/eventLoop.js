

(function () {
  const $test = document.getElementById('test')
  let counter = 0

  function func1 () {
    $test.innerText = ++counter
    alert('func1')
  }

  function func2 () {
    $test.innerText = ++counter
    alert('func2')
  }

  function func3 () {
    $test.innerText = ++counter
    alert('func3')
  }

  function func4 () {
    $test.innerText = ++counter
    alert('func4')
  }

  (function () {
    // main task
    func1()

    // macro task
    setTimeout(() => {
      func2()
      // micro task
      Promise.resolve().then(func4)
      Promise.resolve().then(func3)
    }, 0)

    // macro task
    setTimeout(func1, 0)

    // micro task
    Promise.resolve().then(func3)

    // main task
    func4()
  })()

  // alert func1
  // alert func4
  // alert func3
  // UI update -- counter = 3
  // alert func2
  // alert func4
  // alert func3
  // UI update -- counter = 6
  // alert func1
  // UI update -- counter = 7

})()