# muse

工程级前端构建工具

## [更新日志](./CHANGELOG.md)

## 安装

```bash
npm install -g @mochen/muse
```
OR
```bash
sudo npm install -g @mochen/muse --unsafe-perm
```

## 项目目录约束

```
.
├── README.md
├── dist
│   └── front
│       └── online
└── websrc # 前端源文件
    └── front # 工程名称
        ├── node_modules
        ├── package-lock.json
        ├── package.json
        ├── src # 工程源文件
        │   ├── common # common 不作为页面编译，存放公共文件
        │   └── about # 最终会编译为 about.html, 文件夹内部是他的文件资源
        │       ├── index.html
        │       ├── index.js
        │       └── index.less
        └── stylelint.config.js
```

项目结构建设完毕后。需要先执行两个命令用于初始化项目。

```
muse create muserc
muse create browser
```


## 参数配置

详细参数配置说明，参看[.muserc.js](./config/default/.muserc.js)

## 使用

### Build

```
$ muse build [page]
```

*该命令与`watch`命令互斥，属于两种开发构建模式。*

#### 参数

`[page]`参数不必须，默认为`all`，也即所有页面。

如果`page`不等于`all`，则使用watch模式，进程会一直监听变化，但不会刷新页面，需要手动刷新。

如果`page`等于`all`，在构建之前会清空对应的`dist`目录。

#### 命令

`build`模式下，会生成实体文件。也就意味着，你可以将文件作为后端模板使用。所以这个模式也被用于前后端不分离的项目开发模型。

### Watch

```
$ muse watch [page]
```

*该命令与`build`命令互斥，属于两种开发构建模式。*

#### 参数

`[page]`参数不必须，默认为`all`，也即所有页面。


#### 命令

`watch`模式下，默认会生成本地一个`http server`用于预览。不会产生实体文件。

可以通过配置文件，将其配置为`sock`模式。用于需要`nginx`的项目。可将`sock`在`nginx`反向代理。请求会落到`webpack-dev-server`。`sock`模式需要具备一定的工程思维和必要的`nginx`配置能力。

### Deploy

```
$ muse deploy [page]
```

#### 参数

`[page]`参数不必须，默认为`all`，也即所有页面。

#### 命令

deploy保留了`[page]`参数。但这不意味着`deploy`某一个页面是个正确的行为。

`webpack`在进行多页项目构建时，会针对整个项目做出优化。`deploy`某一个页面，会使得无法对整个项目进行优化。

除非你要debug某个页面，否则，不建议`deploy`单独的页面。

### New

```
$ muse new [page]
```

#### 参数

`[page]`参数必须，需指定一个页面名称。

#### 命令

该命令可快速创建一个页面代码文件夹。如下所示。

该目录规则可以通过`.muserc.js`中的`pagePath`修改。

```
about
└── static
    ├── about.html
    ├── about.js
    └── about.less
```


### Create

```
$ muse create [file]
```

#### 参数

`[file]`参数可选值 ['muse', 'eslint', 'babel', 'postcss', 'stylelint', 'browserlist', 'tsconfig']

#### 命令

muse内置了各种rc文件，如果需要个性化，可以自己生成rc文件到项目中，自行修改。

### Lint

```
$ muse lint [fix]
```

#### 参数

`[fix]` 非必须，可选值['fix']

#### 命令

代码检测，根据`.muserc.js`中的配置进行`js/css`代码检测。增加`fix`参数，可自动修复一些可以被自动修复的错误。

### Lint:fix

```
$ muse lint:fix
```

#### 命令

`muse lint fix`的别名