const fs = require("fs");
const path = require("path");
const express = require("express");
const { createBundleRenderer } = require("vue-server-renderer");

const bundle = require("./dist/vue-ssr-server-bundle.json");
const clientManifest = require("./dist/vue-ssr-client-manifest.json");

const app = express();

// 新建一个renderer
const renderer = createBundleRenderer(bundle, {
  clientManifest,
  basedir: path.resolve(__dirname, "./dist"),
  runInNewContext: false
});

app.use("/dist", express.static("dist"));

app.get("*", (req, res) => {
  if (req.url === "/favicon.ico") return;
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8"
  });

  const context = { title: "SSR 测试", url: req.url };

  let resourceHintsText = "";
  // 获取manifest.json 需要 preload加载的资源
  clientManifest.initial.forEach(asset => {
    if (/.css$/.test(asset)) {
      resourceHintsText += `<link href="/dist/${asset}" rel="stylesheet">`;
    }
    if (/.js$/.test(asset)) {
      resourceHintsText += `<link as="script" href="/dist/${asset}" rel="preload">`;
    }
  });

  clientManifest.async.forEach(asset => {
    const suffixIdx = asset.lastIndexOf(".");
    const loadType =
      asset.substring(suffixIdx, asset.length) === "css" ? "style" : "script";
    resourceHintsText += `<link as="${loadType}" href="/dist/${asset}" rel="prefetch">`;
  });

  // 先将头部信息返回给浏览器，让浏览器预加载资源
  res.write(`<!DOCTYPE html><html><head>${resourceHintsText}</head><body>`);

  renderer.renderToString(context, (err, html) => {
    res.write(`
    ${html}
    ${context.renderState()}
    ${context.renderScripts()}
    <script>
    setTimeout(()=>{
      window.__GLOBAL_RENDER__ && window.__GLOBAL_RENDER__()
    },0)
    </script>
    </body>
    </html>`);
    res.end();
  });
});

app.listen(3006, () => {
  console.log(`server started at http://localhost:3006`);
});
