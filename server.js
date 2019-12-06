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

// 新建一个存放client端资源文件的静态资源路径
app.use("/dist", express.static("dist"));

// 页面请求
app.get("*", (req, res) => {
  if (req.url === "/favicon.ico") return;
  const context = {
    title: "SSR 测试", // default title
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

    res.send(renderHtml);
    res.end();
  });
});

app.listen(3000, () => {
  console.log(`server started at http://localhost:3000`);
});
