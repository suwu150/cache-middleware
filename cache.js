const isNewDay = (cacheDate) => {
  const currentDate = new Date();
  if (currentDate.getFullYear() !== new Date(cacheDate).getFullYear()) return true;
  if (currentDate.getMonth() !== new Date(cacheDate).getMonth()) return true;
  if (currentDate.getDate() !== new Date(cacheDate).getDate()) return true;
  if (currentDate.getDay() !== new Date(cacheDate).getDay()) return true;
  return currentDate.getHours() === 0 && currentDate.getMinutes() === 0 && currentDate.getSeconds() === 0;
};
class CacheHandle {
  constructor() {
    this.caches = {};
    this.count = 0;
  }

  setCacheItem (api, item) {
    this.caches[api] = { data: item, time: new Date().toLocaleString() };
  }

  getCacheItem (api) {
    if (isNewDay(this.caches[api] && this.caches[api].time || new Date())) this.clearCache();
    return this.caches[api];
  }
  clearCache() {
    console.log(`---------清空缓存时间${new Date().toLocaleString()}-------`);
    this.caches = {};
  }

  addCount() {
   this.count += 1;
  }

  getCount() {
    return this.count;
  }
};

const cacheHandle = new CacheHandle();

const Cache = () => {
  return async (ctx, next) => {
    if (ctx.url.indexOf("/api/data/") === 0) {
      if (cacheHandle.getCacheItem(ctx.url)) {
        const cacheDataSource = cacheHandle.getCacheItem(ctx.url);
        const content = cacheDataSource.data;
        console.log(`${ctx.url}:缓存数据:缓存时间=${cacheDataSource.time}:内容=${content}`);
        ctx.body = content;
      } else {
        cacheHandle.addCount();
        const content = `${Math.random() * 1000000}`;
        console.log(`${ctx.url}:查询数据:查询时间=${new Date().toLocaleString()}:内容=${content}:查询总次数为：${cacheHandle.getCount()}`);
        ctx.body = content;
        cacheHandle.setCacheItem(ctx.url, content);
      }
    } else {
      await next();
    }
  }
};

module.exports = Cache;
