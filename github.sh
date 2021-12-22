#!bin/bash

GIT_REPOSITORY="../rn-im-github"
CACHE_DIR="rn-im-temp"

# 配置 GitHub 上的 name
# 配置 GitHub 上的 email
GIT_NAME="zhangyifan"
GIT_EMAIL="iosyifan@163.com"
PHA="ssh://git@pha.rongcloud.net:2222/diffusion/RNIMLIB/rn-imlib.git"
GITHUB="git@github.com:rongcloud/rongcloud-react-native-imlib.git"

if [[ -z $GIT_NAME ]]; then
	echo "请先在 github.sh 中配置 GitHub 的名称"
	exit 1;
fi

if [[ -z $GIT_EMAIL ]]; then
	echo "请先在 github.sh 中配置 GitHub 的邮箱"
	exit 1;
fi

git status

echo "请确认本地是否还有提交 输入 y 继续执行\n"
read option

if [[ $option != 'y' ]]; then
	echo "确认不执行，已退出"
    exit 1;
fi


cd ..

if [[ -d $CACHE_DIR ]]; then
	echo "rn-im-temp 目录已存在，请先删除"
	exit 1;
fi

mkdir $CACHE_DIR

cd $CACHE_DIR

git clone $PHA

cd rn-imlib

git checkout -b dev
git fetch origin dev
git pull origin dev

git config --local user.name $GIT_NAME
git config --local user.email $GIT_EMAIL

git remote add github $GITHUB
git fetch github master

git reset --hard
git switch dev
git checkout -b gmaster github/master

# git merge --allow-unrelated-histories --squash --strategy-option=theirs dev


# # 删除非必要文件夹
# echo "开始清除非必要文件"
# rm -rf ./CONTRIBUTING.md
# rm -rf ./node_modules
# rm -rf ./example/node_modules
# rm -rf ./example/ios/Pods

# echo "清除完成，请确认后手动 Push "



