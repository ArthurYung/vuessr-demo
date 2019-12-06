const path = require("path");
const express = require("express");
const LRU = require("lru-cache");
const { createBundleRenderer } = require("vue-server-renderer");

const bundle = require("./dist/vue-ssr-server-bundle.json");
const clientManifest = require("./dist/vue-ssr-client-manifest.json");

const app = express();

// 新建一个缓存策略
const microCache = new LRU({
  max: 100,
  maxAge: 60000 // 重要提示：条目在 60 秒后过期。
});

// 新建一个renderer
const renderer = createBundleRenderer(bundle, {
  clientManifest,
  basedir: path.resolve(__dirname, "./dist"),
  runInNewContext: false
});

// 新建一个存放client端资源文件的静态资源路径
app.use("/dist", express.static("dist"));

// 页面请求
app.get("*", (req, res) => {
  if (req.url === "/favicon.ico") return;
  // 如果命中缓存，直接返回
  const hit = microCache.get(req.url);
  if (hit) {
    res.send(hit);
    res.end();
    console.log("by microCache");
    return;
  }

  console.log("by renderer");
  const context = {
    title: "SSR 测试",
    url: req.url
  };

  // 渲染页面
  renderer.renderToString(context, (err, html) => {
    const renderHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      ${context.renderResourceHints()}
      ${context.renderStyles()}
    </head>
    <body>
      ${html}
      ${context.renderState()}
      ${context.renderScripts()}
    </body>
    </html>
    `;

    microCache.set(req.url, renderHtml);
    res.send(renderHtml);
    res.end();
  });
});

app.listen(3001, () => {
  console.log(`server started at http://localhost:3001`);
});
