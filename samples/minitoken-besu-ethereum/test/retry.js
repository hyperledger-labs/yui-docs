module.exports = {
  retry: (func, retryCount) => {
    let promise = func();
    for (let i = 1; i <= retryCount; ++i) {
      promise = promise.catch(func);
    }
    return promise;
  },
};
