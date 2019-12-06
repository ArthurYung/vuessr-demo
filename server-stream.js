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

  const context = {
    title: "SSR 测试", // default title
    url: req.url
  };

  const stream = renderer.renderToStream(context);

  let templateHtml;

  stream.on("data", data => {
    if (!templateHtml) {
      // 首次渲染将hints，style等信息添加到头部
      templateHtml =
        "<!DOCTYPE html><html><head>" +
        context.renderResourceHints() +
        context.renderStyles() +
        "</head>" +
        "<body>";
      res.write(templateHtml);
    }
    // 流式渲染
    res.write(data);
  });

  stream.on("end", () => {
    res.write(context.renderState()); // 最后一帧write init_state
    res.write(context.renderScripts()); // script标签
    res.write("</body></html>"); // 闭合标签
    res.end();
  });
});

app.listen(3002, () => {
  console.log(`server started at http://localhost:3002`);
});
