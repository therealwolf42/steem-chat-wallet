export let wait_sec = async (sec) => {
  return await Promise.all([
      timeout(sec * 1000)
  ])
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}