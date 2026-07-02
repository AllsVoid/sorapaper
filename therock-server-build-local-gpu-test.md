# TheRock 服务器编译与本地 GPU 测试复现方案

## 目标

将 TheRock CI 中的测试流程拆成两段：

1. **服务器侧编译**：通过 Dockerfile 构建统一编译镜像，在服务器内完成源码拉取、依赖安装、构建、产物打包。
2. **本地 GPU 测试**：本地机器不重新编译，只接收服务器产出的 ROCm artifact，安装后运行 TheRock CI 同款测试脚本，确认测试流程可独立复现。

这种方式对应 TheRock CI 的核心设计：**构建机产出 artifact，测试机下载并安装 artifact，然后执行 `test_script`**。

## 总体流程

```text
服务器
  ├─ docker build 编译镜像
  ├─ git clone ROCm/TheRock
  ├─ 拉取 submodule / fetch_sources.py
  ├─ 编译 ROCm 组件
  └─ 导出 therock-build artifact

本地 GPU 机器
  ├─ 获取服务器 artifact
  ├─ 安装测试依赖
  ├─ 设置 THEROCK_BIN_DIR / OUTPUT_ARTIFACTS_DIR / AMDGPU_FAMILIES
  ├─ 跑 test_sanity.py
  └─ 跑组件 test_script，例如 test_runner.py / test_rocblas.py
```

## 一、服务器侧：编译镜像

建议新增 `Dockerfile.build`，用于创建 TheRock 编译环境。

```dockerfile
FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    git \
    python3 \
    python3-venv \
    python3-pip \
    cmake \
    ninja-build \
    ccache \
    build-essential \
    pkg-config \
    file \
    xz-utils \
    zip \
    unzip \
    && rm -rf /var/lib/apt/lists/*

RUN curl -LsSf https://astral.sh/uv/install.sh | sh

ENV PATH="/root/.local/bin:${PATH}"
ENV CCACHE_DIR=/ccache
ENV CCACHE_MAXSIZE=50G

WORKDIR /work
```

构建镜像：

```bash
docker build -f Dockerfile.build -t therock-build:ubuntu24.04 .
```

启动编译容器：

```bash
docker run --rm -it \
  -v "$PWD:/work" \
  -v "$PWD/.ccache:/ccache" \
  therock-build:ubuntu24.04 \
  /bin/bash
```

## 二、服务器侧：拉取源码与准备依赖

在容器内执行：

```bash
git clone https://github.com/ROCm/TheRock.git
cd TheRock

uv venv .venv
source .venv/bin/activate
uv pip install -r requirements.txt
uv pip install -r requirements-test.txt
```

如果需要完整 submodule：

```bash
git submodule update --init --recursive
```

如果项目当前采用 TheRock 的源码获取脚本，应优先使用仓库内脚本，例如：

```bash
python build_tools/fetch_sources.py
```

具体以 TheRock 当前分支文档为准。

## 三、服务器侧：编译并导出产物

TheRock 的 CI 测试阶段依赖安装后的 artifact，而不是测试机重新编译。服务器侧需要导出两类内容：

1. **运行产物**：ROCm runtime、库、工具链等。
2. **测试产物**：`CTestTestfile.cmake`、GoogleTest 可执行、pytest 测试资源等。

推荐导出目录：

```text
therock-build/
  ├─ bin/
  ├─ lib/
  ├─ include/
  ├─ libexec/
  └─ ...
```

如果使用 TheRock 官方 artifact 工具链，应尽量复用：

```bash
python build_tools/fileset_tool.py
```

或者使用仓库内已有的 packaging / artifact 生成脚本。最终目标是让本地测试机能够设置：

```bash
export OUTPUT_ARTIFACTS_DIR=/path/to/therock-build
export THEROCK_BIN_DIR=/path/to/therock-build/bin
```

然后直接运行测试脚本。

## 四、本地 GPU 机器：基础环境

本地机器需要：

```text
Linux
AMD GPU
可访问 /dev/kfd 和 /dev/dri
git
python / uv
cmake / ctest
```

建议先检查 GPU 设备：

```bash
ls -l /dev/kfd /dev/dri
```

如果本地也用 Docker 跑测试，推荐使用 TheRock 文档中的无 ROCm 基础镜像：

```bash
docker run -it \
  --ipc host \
  --group-add video \
  --device /dev/kfd \
  --device /dev/dri \
  -v "$PWD:/work" \
  ghcr.io/rocm/no_rocm_image_ubuntu24_04:latest \
  /bin/bash
```

## 五、本地 GPU 机器：安装测试依赖

```bash
curl -LsSf https://astral.sh/uv/install.sh | bash
source $HOME/.local/bin/env

git clone https://github.com/ROCm/TheRock.git
cd TheRock

uv venv .venv
source .venv/bin/activate
uv pip install -r requirements-test.txt
```

将服务器产出的 `therock-build` 拷贝到本地，例如：

```bash
rsync -a server:/path/to/therock-build ./therock-build
```

设置环境变量：

```bash
export OUTPUT_ARTIFACTS_DIR="$PWD/therock-build"
export THEROCK_BIN_DIR="$PWD/therock-build/bin"
export ROCM_PATH="$PWD/therock-build"
export AMDGPU_FAMILIES="gfx94X-dcgpu"
```

`AMDGPU_FAMILIES` 需要按本地 GPU 和服务器编译目标填写，例如：

```text
gfx94X-dcgpu
gfx110X-all
gfx1151
```

## 六、本地 GPU 机器：Sanity 测试

先跑 CI 的 sanity 闸门：

```bash
python build_tools/github_actions/test_executable_scripts/test_sanity.py
```

通过标准：

```text
退出码为 0
ROCm 动态库可加载
GPU 可枚举
基础 HIP / runtime 调用正常
```

如果这一步失败，不建议继续跑组件测试，应先处理驱动、权限、动态库路径或 artifact 安装问题。

## 七、本地 GPU 机器：组件测试

### 通用 CTest 组件

对于使用 `test_runner.py` 的组件，设置：

```bash
export TEST_COMPONENT=rocblas
export TEST_TYPE=quick
export SHARD_INDEX=1
export TOTAL_SHARDS=1
export AMDGPU_FAMILIES="gfx94X-dcgpu"
```

执行：

```bash
python build_tools/github_actions/test_executable_scripts/test_runner.py
```

`test_runner.py` 会执行以下逻辑：

```text
ctest -N
ctest --print-labels
按 TEST_TYPE 选择 quick / standard / comprehensive / full
按 AMDGPU_FAMILIES 匹配 ex_gpu_gfx*
组装 ctest -L / -LE 命令
执行测试
```

### 分片测试

模拟 CI 分片：

```bash
export TOTAL_SHARDS=4

export SHARD_INDEX=1
python build_tools/github_actions/test_executable_scripts/test_runner.py

export SHARD_INDEX=2
python build_tools/github_actions/test_executable_scripts/test_runner.py

export SHARD_INDEX=3
python build_tools/github_actions/test_executable_scripts/test_runner.py

export SHARD_INDEX=4
python build_tools/github_actions/test_executable_scripts/test_runner.py
```

全部 shard 退出码为 `0` 才表示该组件完整通过。

### 专用脚本组件

部分组件不走通用 `test_runner.py`，而是使用专用脚本：

```bash
python build_tools/github_actions/test_executable_scripts/test_rocblas.py
python build_tools/github_actions/test_executable_scripts/test_rccl.py
python build_tools/github_actions/test_executable_scripts/test_hipblaslt.py
python build_tools/github_actions/test_executable_scripts/test_rocfft.py
python build_tools/github_actions/test_executable_scripts/test_hiptests.py
```

实际应以测试矩阵中的 `component.test_script` 为准。

## 八、建议的最小跑通路径

第一轮不要直接跑全量，建议按以下顺序验收：

```text
1. 服务器编译镜像能构建成功
2. 服务器能产出 therock-build
3. 本地 GPU 机器能加载 therock-build
4. test_sanity.py 通过
5. 一个 quick 组件通过，例如 rocblas quick
6. 同组件开启分片后通过
7. 再扩展到 standard / comprehensive
```

最小命令：

```bash
python build_tools/github_actions/test_executable_scripts/test_sanity.py

export TEST_COMPONENT=rocblas
export TEST_TYPE=quick
export SHARD_INDEX=1
export TOTAL_SHARDS=1
python build_tools/github_actions/test_executable_scripts/test_runner.py
```

## 九、验收标准

本地独立复现成功应满足：

```text
服务器侧：
  编译镜像可重复构建
  TheRock 源码和依赖可重复拉取
  artifact 可重复生成
  artifact 包含运行产物和测试产物

本地测试侧：
  不执行编译
  只安装或挂载服务器 artifact
  sanity 测试通过
  至少一个真实组件 quick 测试通过
  ctest --print-labels 能发现测试标签
  GPU 架构标签能按 AMDGPU_FAMILIES 正确匹配
```

## 十、常见问题

### 1. 找不到测试目录

现象：

```text
Error: Test directory does not exist
```

通常是 `THEROCK_BIN_DIR` 设置错误，或者服务器 artifact 没有包含测试产物。

### 2. 找不到 ctest

现象：

```text
Error: ctest not found
```

本地测试环境需要安装 CMake / CTest。

### 3. 找不到 GPU

检查：

```bash
ls -l /dev/kfd /dev/dri
groups
```

Docker 内需要带：

```bash
--device /dev/kfd
--device /dev/dri
--group-add video
--ipc host
```

### 4. GPU label 匹配不到

检查：

```bash
echo "$AMDGPU_FAMILIES"
ctest --print-labels --test-dir "$THEROCK_BIN_DIR/rocblas"
```

如果 artifact 是 `gfx94X`，本地却设置成不兼容的 `gfx110X`，测试会被过滤或无法运行。

## 十一、后续可自动化内容

可以进一步拆成三个脚本：

```text
scripts/server/build-image.sh
scripts/server/build-therock.sh
scripts/local/run-tests.sh
```

也可以将服务器产物统一命名：

```text
therock-${git_sha}-${gpu_family}-${build_type}.tar.xz
```

本地测试脚本只接收：

```bash
./scripts/local/run-tests.sh \
  --artifact therock-xxx.tar.xz \
  --gpu-family gfx94X-dcgpu \
  --component rocblas \
  --test-type quick
```
