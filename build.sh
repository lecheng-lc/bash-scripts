#!/bin/sh

echo "正在添加文件..."
git add .
echo -n "正在提交备注...，请填写备注（可空）"
read remarks
if [ ! -n "$remarks" ]
then
	remarks="常规提交"
fi

git commit -m "$remarks"
echo "正在开始提交代码..."
git push


echo "代码提交成功!!!"
echo "是否需要打包,请输入y/n"
read buid
if [ $buid = "y" ]
then
	echo "等待打包中......"
    yarn build
else
	exit
fi

#自动压缩
echo "等待压缩中......"
winrar a dist.zip  dist
echo "<<<<<<<<<<<<<<<<<<成功了>>>>>>>>>>>>>>>>>>"
exit
